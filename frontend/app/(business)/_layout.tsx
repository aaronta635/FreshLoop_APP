import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BusinessLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Check if user is authenticated and is a shop (business)
  const isVendor = isAuthenticated && user?.role === 'shop';
  const currentScreen = segments[segments.length - 1];

  // If still loading auth state, show loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2D3B2D" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If not authenticated or not a vendor, show login prompt
  if (!isVendor && currentScreen !== 'login' && currentScreen !== 'setup') {
    return (
      <View style={styles.container}>
        <Ionicons name="storefront" size={64} color="#2D3B2D" />
        <Text style={styles.title}>Partner Dashboard</Text>
        <Text style={styles.subtitle}>
          {!isAuthenticated 
            ? 'Please login as a business partner to access the dashboard'
            : 'Your account is registered as a customer. Please login with a business account.'}
        </Text>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/(business)/login')}
        >
          <Text style={styles.loginButtonText}>Business Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFEF' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="setup" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="create-deal" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFEF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3B2D',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 999,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
