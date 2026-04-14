import { supabase } from './supabaseClient.js'

export async function checkRateLimit(ip, endpoint, maxRequests = 3, windowMinutes = 60) {
  if (!supabase) return { limited: false }

  try {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString()

    const { count, error } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart)

    if (error) return { limited: false }

    if (count >= maxRequests) {
      const { data: oldest } = await supabase
        .from('rate_limits')
        .select('created_at')
        .eq('ip_address', ip)
        .eq('endpoint', endpoint)
        .gte('created_at', windowStart)
        .order('created_at', { ascending: true })
        .limit(1)

      const oldestTime = oldest?.[0]?.created_at
        ? new Date(oldest[0].created_at).getTime()
        : Date.now()
      const retryAfter = Math.max(
        Math.ceil((oldestTime + windowMinutes * 60 * 1000 - Date.now()) / 1000),
        0
      )

      return {
        limited: true,
        retryAfter,
        message: `Rate limit exceeded. You can make ${maxRequests} ${endpoint} requests per hour. Please try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
      }
    }

    await supabase.from('rate_limits').insert({ ip_address: ip, endpoint })

    // Cleanup entries older than 2 hours (fire and forget)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    supabase.from('rate_limits').delete().lt('created_at', twoHoursAgo).then(() => {})

    return { limited: false }
  } catch {
    return { limited: false }
  }
}
