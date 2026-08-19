import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables in backend (SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY)');
}

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabasePublishableKey;

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

