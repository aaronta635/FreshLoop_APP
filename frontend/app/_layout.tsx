import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '../app/global.css';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import {
  setupNotificationListeners,
  getLastNotificationResponse,
  clearBadge,
} from '../services/notificationService';
import {
  handleForegroundNotification,
  handleNotificationTap,
} from '../services/notificationHandler';

// Component to handle notification setup
function NotificationSetup() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('[RootLayout] Setting up notification listeners...');

    // Setup notification listeners
    const cleanup = setupNotificationListeners(
      handleForegroundNotification,
      handleNotificationTap
    );

    // Check if app was opened from a notification
    getLastNotificationResponse().then((response) => {
      if (response) {
        console.log('[RootLayout] App opened from notification');
        handleNotificationTap(response);
      }
    });

    // Clear badge on app start
    clearBadge();

    // Cleanup listeners on unmount
    return cleanup;
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationSetup />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FFFFEF' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(business)" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
