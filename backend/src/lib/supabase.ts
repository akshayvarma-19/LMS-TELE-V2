import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables in backend (SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY)');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
