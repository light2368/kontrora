import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get real IP from headers
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'Unknown'

    // Get user from auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No auth header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await sb.auth.getUser(token)

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Geolocate the IP
    let city = 'Unknown'
    let country = 'Unknown'
    let region = 'Unknown'

    if (ip !== 'Unknown' && ip !== '127.0.0.1' && !ip.startsWith('192.168') && !ip.startsWith('10.')) {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`)
        const geo = await geoRes.json()
        city = geo.city || 'Unknown'
        country = geo.country_name || 'Unknown'
        region = geo.region || 'Unknown'
      } catch (_) {
        // geo lookup failed, keep defaults
      }
    }

    // Insert login record
    const { error: insertError } = await sb
      .from('user_logins')
      .insert({
        user_id: user.id,
        email: user.email,
        ip_address: ip,
        city,
        country,
        region,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, ip, city, country }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
