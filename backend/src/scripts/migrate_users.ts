import { supabaseAdmin } from '../lib/supabase.js';

const usersToMigrate = [
  { name: "Rama", username: "rama", email: "rama@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Akshay", username: "akshay", email: "akshay@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Suresh", username: "suresh", email: "suresh@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Priya", username: "priya", email: "priya@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Karthik", username: "karthik", email: "karthik@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Anitha", username: "anitha", email: "anitha@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Rajesh", username: "rajesh", email: "rajesh@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Lakshmi", username: "lakshmi", email: "lakshmi@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Vijay", username: "vijay", email: "vijay@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Divya", username: "divya", email: "divya@example.com", password: "123", phone: "1234", role: "citizen" },
  { name: "Deshana", username: "deshana", email: "deshana@officer.gov.in", password: "123", phone: "1234", role: "officer" }
];

async function migrate() {
  console.log('--- START USER MIGRATION TO SUPABASE AUTH ---');
  
  if (!process.env.SUPABASE_SECRET_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY environment variable is required to run migration.');
    process.exit(1);
  }

  try {
    // 1. Fetch all existing Auth users to prevent duplicates
    let page = 1;
    const existingEmails = new Set<string>();
    
    console.log('Fetching existing Supabase Auth users...');
    while (true) {
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
        page: page,
        perPage: 100
      });
      
      if (error) {
        console.error('Error fetching auth users:', error.message);
        break;
      }
      
      if (!users || users.length === 0) {
        break;
      }
      
      users.forEach(u => {
        if (u.email) {
          existingEmails.add(u.email.toLowerCase());
        }
      });
      
      if (users.length < 100) {
        break;
      }
      page++;
    }

    console.log(`Found ${existingEmails.size} existing Auth accounts.`);

    // 2. Loop through users and create accounts if they do not exist
    for (const user of usersToMigrate) {
      const emailLower = user.email.toLowerCase();
      
      if (existingEmails.has(emailLower)) {
        console.log(`[SKIP] Account already exists for: ${user.email}`);
        continue;
      }
      
      console.log(`[MIGRATING] Creating account for: ${user.email} (Role: ${user.role})`);
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          username: user.username,
          phone: user.phone,
          role: user.role
        }
      });

      if (error) {
        console.error(`[ERROR] Failed to create user ${user.email}:`, error.message);
      } else {
        console.log(`[SUCCESS] Created auth user: ${data.user?.id} for ${user.email}`);
      }
    }

    console.log('--- USER MIGRATION COMPLETE ---');
  } catch (err: any) {
    console.error('An unexpected error occurred during migration:', err.message || err);
  }
}

migrate();
