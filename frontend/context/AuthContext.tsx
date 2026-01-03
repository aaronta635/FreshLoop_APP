import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthUser, RegisterResponse, Tokens, UserRole } from '../services/api';
import {
  initializeNotifications,
  registerDeviceToken,
} from '../services/notificationService';

// ============================================
// TEMPORARY AUTH BYPASS (DEVELOPMENT ONLY)
// ============================================
// Set to true to bypass authentication and access main pages
// WARNING: Set this back to false before committing to production!
const BYPASS_AUTH = false;

// Mock user for bypass mode
const MOCK_USER: AuthUser = {
  id: 1,
  email: 'dev@example.com',
  first_name: 'Dev',
  last_name: 'User',
  phone_number: '+1234567890',
  email_verified: true,
  phone_verified: true,
  default_role: 'customer', // Change to 'vendor' if you need vendor access
  is_superuser: false,
  created_timestamp: new Date().toISOString(),
  updated_timestamp: new Date().toISOString(),
};

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
      
      // TEMPORARY BYPASS: Skip auth check if bypass is enabled
      if (BYPASS_AUTH) {
        console.warn('[AuthContext] ⚠️ AUTH BYPASS ENABLED - Using mock user');
        setUser(MOCK_USER);
        setIsLoading(false);
        return;
      }
      
      const storedAuthUser = await authApi.getStoredUser();
      const isLoggedIn = await authApi.isLoggedIn();
      
      if (isLoggedIn && storedAuthUser) {
        // Optionally verify token is still valid
        try {
          const currentAuthUser = await authApi.getCurrentUser();
          setUser(currentAuthUser);
          
          // Register device for push notifications if user is logged in
          await registerDeviceForNotifications(currentAuthUser.id.toString());
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

  const login = async (email: string, password: string): Promise<Tokens> => {
    // TEMPORARY BYPASS: Return mock tokens if bypass is enabled
    if (BYPASS_AUTH) {
      console.warn('[AuthContext] ⚠️ AUTH BYPASS ENABLED - Skipping login API call');
      const mockTokens: Tokens = {
        access_token: 'bypass_token',
        refresh_token: 'bypass_refresh_token',
        default_role: MOCK_USER.default_role,
      };
      setUser(MOCK_USER);
      return mockTokens;
    }
    
    const response = await authApi.login({ email, password });
    const currentUser = await authApi.getStoredUser();
    setUser(currentUser);
    
    // Register device for push notifications after login
    if (currentUser) {
      await registerDeviceForNotifications(currentUser.id.toString());
    }
    
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
      default_role: role
    });
    setUser(response.auth_user);
    
    // Register device for push notifications after registration
    if (response.auth_user) {
      await registerDeviceForNotifications(response.auth_user.id.toString());
    }
    
    return response;
  };

  const logout = async () => {
    // TEMPORARY BYPASS: Skip logout API call if bypass is enabled
    if (BYPASS_AUTH) {
      console.warn('[AuthContext] ⚠️ AUTH BYPASS ENABLED - Skipping logout API call');
      setUser(null);
      return;
    }
    
    await authApi.logout();
    setUser(null);
  };

  const refreshAuthUser = async () => {
    // TEMPORARY BYPASS: Return mock user if bypass is enabled
    if (BYPASS_AUTH) {
      console.warn('[AuthContext] ⚠️ AUTH BYPASS ENABLED - Using mock user');
      setUser(MOCK_USER);
      return;
    }
    
    try {
      const currentAuthUser = await authApi.getCurrentUser();
      setUser(currentAuthUser);
    } catch (error) {
      console.error('Error refreshing AuthUser:', error);
    }
  };

  // Helper function to register device for push notifications
  const registerDeviceForNotifications = async (userId: string): Promise<void> => {
    try {
      console.log('[AuthContext] Registering device for notifications, userId:', userId);
      const deviceToken = await initializeNotifications();
      if (deviceToken) {
        const success = await registerDeviceToken(userId, deviceToken);
        if (success) {
          console.log('[AuthContext] Device registered successfully for notifications');
        } else {
          console.error('[AuthContext] Failed to register device with notification service');
        }
      } else {
        console.warn('[AuthContext] Could not get device token for notifications');
      }
    } catch (error) {
      console.error('[AuthContext] Error registering device for notifications:', error);
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

