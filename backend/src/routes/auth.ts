import { Router, Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';

const router = Router();


/**
 * POST /api/auth/login
 * Payload: { username?: string, email?: string, password?: string }
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Username/Email and password are required'
      });
      return;
    }

    let authData = null;
    let authError = null;

    if (identifier.includes('@')) {
      const resAuth = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      });
      authData = resAuth.data;
      authError = resAuth.error;
    } else {
      // Lookup email by username from custom users/profiles table if available
      const { data: userProfile } = await supabaseAdmin
        .from('users')
        .select('*')
        .or(`username.eq.${identifier},email.eq.${identifier}`)
        .maybeSingle();


      const userEmail = userProfile?.email || identifier;

      const resAuth = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });
      authData = resAuth.data;
      authError = resAuth.error;
    }

    if (authError) {
      res.status(401).json({
        status: 'error',
        message: authError.message || 'Invalid username or password'
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: authData.user,
        session: authData.session
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

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          phone,
          role: userRole
        }
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

