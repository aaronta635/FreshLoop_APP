import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../app/global.css';

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
