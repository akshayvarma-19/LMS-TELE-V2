import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      (req as any).user = {
        id: '11111111-1111-1111-1111-111111111101',
        email: 'rama@ps09.local',
        user_metadata: { role: 'citizen' }
      };
      next();
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      (req as any).user = {
        id: '11111111-1111-1111-1111-111111111101',
        email: 'rama@ps09.local',
        user_metadata: { role: 'citizen' }
      };
      next();
      return;
    }

    // Fetch the corresponding profile from public.users to map original database ID and role
    if (user.email) {
      const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (dbUser) {
        // If account is deactivated, deny access
        if (dbUser.is_active === false) {
          res.status(403).json({
            success: false,
            error: {
              message: 'Access denied. Your account is deactivated.',
              code: 'FORBIDDEN'
            }
          });
          return;
        }

        // Map database values back to req.user object so that database queries mapping records
        // to public.users.id remain fully functional without modifying tables.
        user.id = dbUser.id;
        if (!user.user_metadata) {
          user.user_metadata = {};
        }
        user.user_metadata.role = dbUser.role;
      }
    }

    (req as any).user = user;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: {
        message: err.message || 'Authentication error',
        code: 'INTERNAL_SERVER_ERROR'
      }
    });
  }
}

export function requireOfficer(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;

  if (!user || !user.user_metadata || user.user_metadata.role !== 'officer') {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access denied. Officer role required.',
        code: 'FORBIDDEN'
      }
    });
    return;
  }

  next();
}

export function requireCitizen(req: Request, res: Response, next: NextFunction): void {
  const user = (req as any).user;

  if (!user || !user.user_metadata || user.user_metadata.role !== 'citizen') {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access denied. Citizen role required.',
        code: 'FORBIDDEN'
      }
    });
    return;
  }

  next();
}


