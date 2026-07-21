const SUPABASE_URL = 'https://gaxjtqdsfxdsqbtmzbee.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IfmaouzX1R7qBvonLRa4sA_d2VTMorC';

let supabaseClient = null;

try {
  if (
    typeof window.supabase !== 'undefined' &&
    SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' &&
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
  ) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase is not configured yet. Bookings and gallery will work locally only. See SUPABASE_SETUP.md.');
  }
} catch (err) {
  console.warn('Supabase failed to initialize:', err);
}