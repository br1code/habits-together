'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  username: string;
  sub: string; // This is the user ID
  iat: number;
  exp: number;
}

interface User {
  username: string;
  userId: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
  children?: ReactNode | undefined;
}

// TODO: since we now have the information about the current user, we should stop depending on `isOwner` fields. Remove them from all endpoints
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
    setUser({
      username: decoded.username,
      userId: decoded.sub,
    }); // Store user details
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null); // Clear user details
  };

  const isTokenExpired = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isTokenExpired(token)) {
      const decoded: DecodedToken = jwtDecode(token);
      setIsAuthenticated(true);
      setUser({
        username: decoded.username,
        userId: decoded.sub,
      }); // Set user details on page load
    } else {
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const contextValue: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Attempted to use AuthContext outside of its provider.');
  }

  return context;
};

export { AuthContextProvider, useAuthContext };
