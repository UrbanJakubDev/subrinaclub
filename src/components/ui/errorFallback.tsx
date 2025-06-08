'use client';

import React from 'react';

export default function ErrorFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Něco se pokazilo</h2>
        <p className="text-gray-700 mb-6">
          Omlouváme se, při načítání aplikace došlo k chybě. Prosím, obnovte stránku nebo zkuste později.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
        >
          Obnovit stránku
        </button>
      </div>
    </div>
  );
} 