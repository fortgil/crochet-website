// ===============================================
//  TWIZIE | ROSETTE CROCHET — SUPABASE CONFIG
// ===============================================

const SUPABASE_URL = 'https://teggqbhbctspkbmyjkmc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__lS-wXrYAZg8V6pcQzC7iA_s-A6WJpc';

// Initialize Supabase client if SDK is loaded
let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase.createClient) {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
