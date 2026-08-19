import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Access token is required',
          code: 'UNAUTHORIZED'
        }
      });
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        error: {
          message: error?.message || 'Invalid or expired token',
          code: 'UNAUTHORIZED'
        }
      });
      return;
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


