'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

const withoutAuth = (WrappedComponent: React.ComponentType) => {
  const WithoutAuthComponent: React.FC = (props) => {
    const authContext = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (authContext?.isAuthenticated) {
        router.replace('/');
      }
    }, [authContext, router]);

    if (authContext?.isAuthenticated) {
      return null; // Or a loading indicator
    }

    return <WrappedComponent {...props} />;
  };

  return WithoutAuthComponent;
};

export default withoutAuth;
