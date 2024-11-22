'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const authContext = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!authContext?.isAuthenticated) {
        router.replace('/login');
      }
    }, [authContext, router]);

    if (!authContext?.isAuthenticated) {
      return null; // Or a loading indicator
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
