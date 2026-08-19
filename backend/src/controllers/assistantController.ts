import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { assistantService } from '../services/assistantService.js';

// In-memory rate limiting map
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per hour

export const assistantController = {
  /**
   * POST /api/assistant/message
   * Receives user message, checks rate limits, gathers context, and asks Grok.
   */
  async handleMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.user_metadata?.role || 'citizen';

      if (!userId) {
        res.status(401).json({
          success: false,
          error: { message: 'User authentication failed', code: 'UNAUTHORIZED' }
        });
        return;
      }

      const { message, land_id } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        res.status(400).json({
          success: false,
          error: { message: 'Message field is required and cannot be empty.', code: 'BAD_REQUEST' }
        });
        return;
      }

      // --- In-Memory Rate Limiter ---
      const now = Date.now();
      const userLimit = rateLimits.get(userId);

      if (!userLimit) {
        // First request from this user
        rateLimits.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      } else if (now > userLimit.resetTime) {
        // Rate limit window expired, reset
        rateLimits.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
      } else {
        // Within window, increment count and check limits
        userLimit.count++;
        if (userLimit.count > MAX_REQUESTS_PER_WINDOW) {
          res.status(429).json({
            success: false,
            error: {
              message: `Too many requests. You have reached the hourly limit of ${MAX_REQUESTS_PER_WINDOW} assistant questions.`,
              code: 'TOO_MANY_REQUESTS'
            }
          });
          return;
        }
      }

      // Generate Grok response
      const responseText = await assistantService.generateResponse(
        message.trim(),
        userId,
        userRole,
        land_id
      );

      res.status(200).json({
        success: true,
        data: {
          message: responseText
        }
      });
    } catch (err: any) {
      console.error('AI Assistant controller error:', err);
      const isConfigError = err.message.includes('not configured');
      res.status(isConfigError ? 503 : 500).json({
        success: false,
        error: {
          message: err.message || 'AI Assistant is currently unavailable.',
          code: isConfigError ? 'SERVICE_UNCONFIGURED' : 'INTERNAL_SERVER_ERROR'
        }
      });
    }
  }
};
