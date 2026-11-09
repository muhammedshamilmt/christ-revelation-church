import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://psxdxygtenkaurdbxgvq.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeGR4eWd0ZW5rYXVyZGJ4Z3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3Njg0MzUsImV4cCI6MjEwOTM0NDQzNX0.eVCA3eIiCMgA_-A6EaMuX7rc-AT2rSdPe4atQXv7rIc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
