'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute roles={["ADMIN"]} redirectTo="/auth">
      {children}
    </ProtectedRoute>
  );
} 