import { supabase } from './supabaseClient.js'

export function trackEvent({ eventType, fileType, overallScore, jobTitle, matchScore, cacheHit = false }) {
  if (!supabase) return

  supabase
    .from('analytics')
    .insert({
      event_type: eventType,
      file_type: fileType ?? null,
      overall_score: overallScore ?? null,
      job_title: jobTitle ?? null,
      match_score: matchScore ?? null,
      cache_hit: cacheHit,
    })
    .then(() => {})
    .catch(() => {})
}
