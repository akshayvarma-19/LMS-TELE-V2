import { Router, Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';

const router = Router();


/**
 * POST /api/auth/login
 * Payload: { username?: string, email?: string, password?: string }
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;
    let identifier = email || username;

    if (!identifier || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Email/Username and password are required'
      });
      return;
    }

    // 1. If username was provided, look up the email from public.users table
    if (!identifier.includes('@')) {
      const { data: userProfile } = await supabaseAdmin
        .from('users')
        .select('email')
        .ilike('username', identifier)
        .maybeSingle();
      if (userProfile && userProfile.email) {
        identifier = userProfile.email;
      }
    }

    // 2. Authenticate using Supabase Auth.
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password: password,
    });

    if (authError || !authData?.user) {
      res.status(401).json({
        status: 'error',
        message: authError?.message || 'Invalid email/username or password'
      });
      return;
    }

    // 3. Obtain the authenticated user's email/ID.
    const authEmail = authData.user.email;

    // 4. Find the corresponding existing record in public.users using the email.
    const { data: appUser, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', authEmail)
      .maybeSingle();

    if (dbError || !appUser) {
      res.status(401).json({
        status: 'error',
        message: 'No corresponding user profile found in the database.'
      });
      return;
    }

    // 9. If public.users.is_active is false, deny application access.
    if (appUser.is_active === false) {
      res.status(403).json({
        status: 'error',
        message: 'Your account is deactivated'
      });
      return;
    }

    // 5. Read username, role, phone and is_active from public.users.
    // 6. Return the authenticated user and application role to the frontend.
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          ...authData.user,
          // Merge database profile properties
          id: appUser.id, // Keep the original database ID for application context
          username: appUser.username,
          phone: appUser.phone,
          role: appUser.role,
          is_active: appUser.is_active !== false,
          name: appUser.name
        },
        session: authData.session,
        role: appUser.role
      }
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'An unexpected server error occurred during login',
      error: err?.message || String(err)
    });
  }
});

/**
 * POST /api/auth/register
 * Payload: { name: string, username: string, email: string, password: string, phone: string, role?: string }
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password, phone, role } = req.body;

    if (!name || !username || !email || !password || !phone) {
      res.status(400).json({
        status: 'error',
        message: 'Name, Username, Email, Password, and Phone are required.'
      });
      return;
    }

    const userRole = role === 'officer' ? 'officer' : 'citizen';

    // 1. Sign up user in Supabase Auth using admin client to bypass signup rate limits and email confirmation
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        username,
        phone,
        role: userRole
      }
    });

    if (authError) {
      res.status(400).json({
        status: 'error',
        message: authError.message || 'Failed to create account in Supabase Auth'
      });
      return;
    }

    const userId = authData.user?.id;

    // 2. Save complete user profile details into Supabase `users` table
    if (userId) {
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .upsert([
          {
            id: userId,
            name,
            username,
            email,
            phone,
            role: userRole,
            created_at: new Date().toISOString()
          }
        ], { onConflict: 'id' });

      if (dbError) {
        console.warn('Warning inserting into users table:', dbError.message);
        // Note: Even if custom users table triggers error (e.g. table schema difference), auth user is created
      }
    }

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully! You can now log in.',
      data: {
        user: authData.user
      }
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'An unexpected server error occurred during registration',
      error: err?.message || String(err)
    });
  }
});

export default router;

