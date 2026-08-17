export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 503) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export async function request<T>(
  _endpoint: string,
  _options: RequestInit = {}
): Promise<T> {
  throw new ApiError(
    'Backend API connection required. This feature will load real data once the backend service is active.',
    503
  );
}
