import { Stack } from 'expo-router';

export default function CustomerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFEF' },
      }}
    >
      <Stack.Screen name="deal-details" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="help-centre" />
    </Stack>
  );
}

