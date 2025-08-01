import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () => {
    
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;


    

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL and Key must be provided in environment variables.");
  }

  return createClient(supabaseUrl, supabaseKey);
}