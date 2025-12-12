import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../app/global.css';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
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
