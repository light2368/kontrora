import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { first_name, last_name, email, company, subject, message } = await req.json()

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Save to DB
    await sb.from('contact_messages').insert({ first_name, last_name, email, company, subject, message })

    // Send email via Resend
    const RESEND_KEY = Deno.env.get('RESEND_API_KEY')
    if (RESEND_KEY) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Kontrora Contact <noreply@kontrora.com>',
          to: ['contact@kontrora.com'],
          reply_to: email,
          subject: `Contact Form: ${subject} — ${first_name} ${last_name}`,
          html: `
            <h2>New Contact Message</h2>
            <table style="border-collapse:collapse;width:100%;font-family:sans-serif;">
              <tr><td style="padding:8px;font-weight:bold;color:#666;">Name</td><td style="padding:8px;">${first_name} ${last_name}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#666;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#666;">Company</td><td style="padding:8px;">${company}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#666;">Topic</td><td style="padding:8px;">${subject}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;color:#666;vertical-align:top;">Message</td><td style="padding:8px;">${message.replace(/\n/g, '<br>')}</td></tr>
            </table>
          `
        })
      })
      const emailResult = await emailRes.json()
      console.log('Resend response:', JSON.stringify(emailResult))
      if (!emailRes.ok) throw new Error('Resend error: ' + JSON.stringify(emailResult))
    } else {
      console.log('No RESEND_API_KEY found in secrets')
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
