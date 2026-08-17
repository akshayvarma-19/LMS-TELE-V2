import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './lib/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/db-test', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to communicate with Supabase',
        error: error.message
      });
      return;
    }

    res.json({
      status: 'ok',
      message: 'Supabase connection successful',
      sessionData: data
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'Unexpected error testing Supabase connection',
      error: err?.message || String(err)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
