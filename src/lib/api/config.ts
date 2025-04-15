export const API_BASE_URL = process.env.NEST_API_URL || 'http://localhost:3002';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  // Add any authentication headers here
});

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}; 