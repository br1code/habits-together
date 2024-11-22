'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
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

    // Forward props to the wrapped component
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
