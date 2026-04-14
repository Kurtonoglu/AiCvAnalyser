import { supabase } from './supabaseClient.js'

export function hashText(text) {
  const str = text.slice(0, 200) + text.slice(-200) + text.length
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // convert to 32-bit int
  }
  return Math.abs(hash).toString(36)
}

export async function getCache(contentHash) {
  if (!supabase) return null

  try {
    const windowStart = new Date(Date.now() - 30 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('analysis_cache')
      .select('result')
      .eq('content_hash', contentHash)
      .gte('created_at', windowStart)
      .limit(1)
      .maybeSingle()

    if (error || !data) return null
    return data.result
  } catch {
    return null
  }
}

export async function setCache(contentHash, result) {
  if (!supabase) return

  try {
    await supabase
      .from('analysis_cache')
      .upsert(
        { content_hash: contentHash, result, created_at: new Date().toISOString() },
        { onConflict: 'content_hash' }
      )

    // Cleanup entries older than 2 hours (fire and forget)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    supabase.from('analysis_cache').delete().lt('created_at', twoHoursAgo).then(() => {})
  } catch {
    // silently ignore
  }
}
