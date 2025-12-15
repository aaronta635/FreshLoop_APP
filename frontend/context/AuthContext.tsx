import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthUser, RegisterResponse, Tokens, UserRole } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Tokens>;
  register: (email: string, password: string, role?: UserRole) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshAuthUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [User, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored AuthUser on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const storedAuthUser = await authApi.getStoredUser();
      const isLoggedIn = await authApi.isLoggedIn();
      
      if (isLoggedIn && storedAuthUser) {
        // Optionally verify token is still valid
        try {
          const currentAuthUser = await authApi.getCurrentUser();
          setUser(currentAuthUser);
        } catch (error) {
          // Token expired, clear stored data
          await authApi.logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: UserRole = 'customer'): Promise<Tokens> => {
    const response = await authApi.login({ email, password, role });
    const currentUser = await authApi.getStoredUser();
    setUser(currentUser);
    return response;
  }

  const register = async (
    email: string,
    password: string,
    role: UserRole = 'customer'
  ): Promise<RegisterResponse> => {
    const response = await authApi.register({
      email, 
      password,
      role
    });
    setUser(response.auth_user)
    return response;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const refreshAuthUser = async () => {
    try {
      const currentAuthUser = await authApi.getCurrentUser();
      setUser(currentAuthUser);
    } catch (error) {
      console.error('Error refreshing AuthUser:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: User,
        isLoading,
        isAuthenticated: !!User,
        login,
        register,
        logout,
        refreshAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

