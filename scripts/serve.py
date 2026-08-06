#!/usr/bin/env python3
"""Static site server with chatbot learning endpoint.

Serves the Worklo marketing site and accepts POST /api/chatbot-learn
so the chatbot can persist new Q&A pairs to data/chatbot-learned.json.

Usage:
  python3 scripts/serve.py
  python3 scripts/serve.py 5500
"""
from __future__ import annotations

import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
LEARNED_PATH = ROOT / "data" / "chatbot-learned.json"
MAX_LEARNED = 200


def load_learned() -> list:
    if not LEARNED_PATH.exists():
        return []
    try:
        data = json.loads(LEARNED_PATH.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except Exception:
        return []


def save_learned(entries: list) -> None:
    LEARNED_PATH.parent.mkdir(parents=True, exist_ok=True)
    LEARNED_PATH.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        if path != "/api/chatbot-learn":
            self.send_error(404, "Not Found")
            return

        length = int(self.headers.get("Content-Length", 0) or 0)
        if length <= 0 or length > 20000:
            self.send_error(400, "Bad Request")
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self.send_error(400, "Invalid JSON")
            return

        question = (payload.get("question") or "").strip()
        answer = (payload.get("answer") or "").strip()
        keywords = payload.get("keywords") or []
        if not question or not answer:
            self.send_error(400, "question and answer required")
            return

        entry = {
            "id": "learned-" + str(abs(hash(question.lower())) % 10_000_000),
            "keywords": keywords if isinstance(keywords, list) else [],
            "patterns": [question.lower()[:120]],
            "answer": answer,
            "question": question,
            "learned": True,
            "count": 1,
        }

        learned = load_learned()
        qn = question.lower()
        updated = False
        for item in learned:
            if (item.get("question") or "").lower() == qn:
                item["answer"] = answer
                item["count"] = int(item.get("count") or 1) + 1
                if keywords:
                    existing = set(item.get("keywords") or [])
                    item["keywords"] = list(existing.union(keywords))[:12]
                updated = True
                break
        if not updated:
            learned.append(entry)

        # Keep newest / most frequent
        learned.sort(key=lambda x: (-int(x.get("count") or 1), x.get("question") or ""))
        learned = learned[:MAX_LEARNED]
        save_learned(learned)

        body = json.dumps({"ok": True, "total": len(learned)}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
    os.chdir(ROOT)
    LEARNED_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not LEARNED_PATH.exists():
        save_learned([])

    server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"Worklo server + chatbot learn API on http://127.0.0.1:{port}")
    print(f"Learning file: {LEARNED_PATH}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
