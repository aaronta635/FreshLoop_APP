import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { customerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    country: 'Australia',
    state: '',
    address: '',
  });

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please enter your first and last name');
      return false;
    }

    if (!formData.username) {
      Alert.alert('Error', 'Please choose a username');
      return false;
    }

    if (formData.username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return false;
    }

    if (!formData.phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (!formData.state || !formData.address) {
      Alert.alert('Error', 'Please enter your state and address');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await customerApi.createProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        phone_number: formData.phoneNumber,
        country: formData.country,
        state: formData.state,
        address: formData.address,
      });

      Alert.alert('Welcome!', 'Your profile has been created successfully!', [
        {
          text: 'Start Exploring',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Could not create profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip for now?',
      'You can complete your profile later from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => router.replace('/(tabs)') },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipButton}>Skip</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Help us personalize your experience
        </Text>
        
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotComplete]} />
          <View style={styles.progressLine} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>
      </View>

      {/* Form */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>FIRST NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor={Colors.textSecondary}
                value={formData.firstName}
                onChangeText={(firstName) => setFormData({ ...formData, firstName })}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>LAST NAME</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor={Colors.textSecondary}
                value={formData.lastName}
                onChangeText={(lastName) => setFormData({ ...formData, lastName })}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          </View>
        </View>

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>USERNAME</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="at"
              size={20}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="johndoe"
              placeholderTextColor={Colors.textSecondary}
              value={formData.username}
              onChangeText={(username) => setFormData({ ...formData, username: username.toLowerCase() })}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color={Colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="+61 400 000 000"
              placeholderTextColor={Colors.textSecondary}
              value={formData.phoneNumber}
              onChangeText={(phoneNumber) => setFormData({ ...formData, phoneNumber })}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Country & State Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>COUNTRY</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Australia"
                placeholderTextColor={Colors.textSecondary}
                value={formData.country}
                onChangeText={(country) => setFormData({ ...formData, country })}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>STATE</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="NSW"
                placeholderTextColor={Colors.textSecondary}
                value={formData.state}
                onChangeText={(state) => setFormData({ ...formData, state })}
                autoCapitalize="characters"
                editable={!isLoading}
              />
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>ADDRESS</Text>
          <View style={[styles.inputContainer, styles.addressInput]}>
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.textSecondary}
              style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 16 }]}
            />
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder="123 Main Street, Sydney"
              placeholderTextColor={Colors.textSecondary}
              value={formData.address}
              onChangeText={(address) => setFormData({ ...formData, address })}
              multiline
              numberOfLines={3}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.accent} />
          <Text style={styles.infoText}>
            Your information is secure and will only be used to improve your FreshLoop experience.
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Complete Profile</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  skipButton: {
    fontSize: FontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: FontWeight.semiBold,
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotComplete: {
    backgroundColor: Colors.accent,
  },
  progressDotActive: {
    backgroundColor: Colors.white,
    transform: [{ scale: 1.2 }],
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: 16,
  },
  addressInput: {
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.primary,
    paddingVertical: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.accent}15`,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});

