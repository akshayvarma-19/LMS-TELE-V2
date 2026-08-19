import { supabase } from './lib/supabase';

async function run() {
  const { data, error } = await supabase.from('users').select('*');
  console.log('--- START USERS LIST ---');
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
  console.log('--- END USERS LIST ---');
}

run();
