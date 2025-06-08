'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-50">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-bold text-red-600">A critical error occurred</h2>
            <p className="mb-4 text-gray-700">{error.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 