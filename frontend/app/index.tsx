import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../constants/Colors';

export default function ContinueAsScreen() {
  const router = useRouter();

  const handleSelectCustomer = () => {
    router.push('/(onboarding)/intro' as any);
  };

  const handleSelectBusiness = () => {
    router.push('/(business)/login' as any);
  };

  return (
    <View style={styles.container}>
      {/* Top Section - Logo & Tagline */}
      <View style={styles.topSection}>
        {/* Logo */}
        
          <Image 
            source={require('../assets/images/freshloop-logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />

        {/* Tagline */}
        <Text style={styles.tagline}>
          make every <Text style={styles.taglineAccent}>bite</Text> count
        </Text>
      </View>

      {/* Bottom Section - Lavender Background */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Continue as</Text>

        <View style={styles.buttonContainer}>
          {/* Customer Button - Filled */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSelectCustomer}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Customer</Text>
          </TouchableOpacity>

          {/* Business Button - Outline */}
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleSelectBusiness}
            activeOpacity={0.8}
          >
            <Text style={styles.outlineButtonText}>Business</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 800,
    height: 280,
  },
  logoText: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  tagline: {
    fontSize: FontSize.lg,
    color: Colors.white,
    textAlign: 'center',
  },
  taglineAccent: {
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  bottomSection: {
    backgroundColor: Colors.lavender,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingHorizontal: Spacing.xl,
    paddingTop: 48,
    paddingBottom: 64,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    gap: Spacing.md,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: Colors.primary,
    paddingVertical: 20,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  outlineButtonText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});
