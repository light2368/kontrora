import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function row(label: string, value: string | undefined | null) {
  if (!value) return ''
  return `<tr><td style="padding:8px 12px;font-weight:bold;color:#555;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;">${value.replace(/\n/g, '<br>')}</td></tr>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()
    const {
      first_name, last_name, email, phone,
      job_title, cover_letter, preferred_location, referral, keep_for_future, resume_url,
      // New fields
      contact_method, contact_id, country,
      exp_years, current_role, availability,
      portfolio, relevant_work, compensation,
      // Blockchain-only
      interested_roles, blockchain_tools, strongest_area
    } = body

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Save to database
    const { error: dbError } = await sb.from('job_applications').insert({
      first_name, last_name, email, phone, job_title,
      cover_letter, preferred_location, referral,
      keep_for_future: keep_for_future || false,
      resume_url: resume_url || null
    })

    if (dbError) throw new Error(dbError.message)

    // 2. Send email via Resend
    const RESEND_KEY = Deno.env.get('RESEND_API_KEY')
    if (RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Kontrora Careers <noreply@kontrora.com>',
          to: ['talents@kontrora.com'],
          subject: `New Application: ${job_title} — ${first_name} ${last_name}`,
          html: `
            <h2 style="font-family:sans-serif;">New Job Application</h2>
            <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
              ${row('Position', job_title)}
              ${row('Name', `${first_name} ${last_name}`)}
              ${row('Email', `<a href="mailto:${email}">${email}</a>`)}
              ${row('Phone', phone)}
              ${row('Preferred Location', preferred_location)}
              ${row('Referral', referral)}
              <tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Keep for future</td><td style="padding:8px 12px;">${keep_for_future ? 'Yes' : 'No'}</td></tr>
              ${resume_url ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#555;">Resume</td><td style="padding:8px 12px;"><a href="${resume_url}">Download</a></td></tr>` : ''}
              ${row('Cover Letter', cover_letter)}
              <tr><td colspan="2" style="padding:12px;background:#f5f5f5;font-weight:bold;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#888;">Contact Preference</td></tr>
              ${row('Preferred Contact Method', contact_method)}
              ${row('Contact ID / Link', contact_id)}
              <tr><td colspan="2" style="padding:12px;background:#f5f5f5;font-weight:bold;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#888;">Background</td></tr>
              ${row('Current Location / Country', country)}
              ${row('Years of Experience', exp_years)}
              ${row('Current / Most Recent Role', current_role)}
              ${row('Earliest Availability', availability)}
              <tr><td colspan="2" style="padding:12px;background:#f5f5f5;font-weight:bold;font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:#888;">Portfolio & Work</td></tr>
              ${row('Portfolio / Links', portfolio)}
              ${interested_roles ? row('Interested Roles', interested_roles) : ''}
              ${blockchain_tools ? row('Blockchain Tools / Ecosystems', blockchain_tools) : ''}
              ${strongest_area ? row('Strongest Area', strongest_area) : ''}
              ${row('Most Relevant Work', relevant_work)}
              ${row('Compensation Expectation', compensation)}
            </table>
          `
        })
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
