import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { vendorApi } from '../../services/api';

interface Step {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STEPS: Step[] = [
  { id: 'account', label: 'Account', icon: 'person' },
  { id: 'info', label: 'Business Info', icon: 'storefront' },
  { id: 'location', label: 'Location', icon: 'location' },
  { id: 'hours', label: 'Hours', icon: 'time' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function BusinessSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { register, user, isAuthenticated, logout } = useAuth();
  // Check if this is profile completion (from dashboard) or new registration
  const isCompletingProfile = params.completeProfile === 'true';
  // Start at step 0 for new registrations, step 1 if completing profile as authenticated vendor
  const [currentStep, setCurrentStep] = useState(
    isCompletingProfile && isAuthenticated && user?.role === 'shop' ? 1 : 0
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Account info
    email: '',
    password: '',
    confirmPassword: '',
    // Business info
    businessName: '',
    category: 'cafe',
    phone: '',
    address: '',
    suburb: 'Wollongong',
    postcode: '',
  });
  const [dayHours, setDayHours] = useState(
    DAYS.map((day) => ({
      day,
      enabled: day !== 'Sunday',
      start: '09:00',
      end: '17:00',
    }))
  );

  // Check if user is already logged in (but not as vendor) - they should logout first
  // Only show this alert if NOT completing profile (i.e., new registration)
  useEffect(() => {
    if (!isCompletingProfile && isAuthenticated && user?.role !== 'shop') {
      Alert.alert(
        'Already Logged In',
        'You are currently logged in as a customer. Please logout first to register a business account.',
        [
          { text: 'Cancel', onPress: () => router.back() },
          { text: 'Logout', onPress: async () => {
            await logout();
            setCurrentStep(0);
          }},
        ]
      );
    }
  }, [isAuthenticated, user, isCompletingProfile]);

  const validateStep = (): boolean => {
    if (currentStep === 0) {
      // Validate account step
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters');
        return false;
      }
      if (!/[A-Z]/.test(formData.password)) {
        Alert.alert('Error', 'Password must include an uppercase letter');
        return false;
      }
      if (!/\d/.test(formData.password)) {
        Alert.alert('Error', 'Password must include a number');
        return false;
      }
    }
    if (currentStep === 1) {
      if (!formData.businessName || formData.businessName.trim().length < 3) {
        Alert.alert('Error', 'Please enter a business name (at least 3 characters)');
        return false;
      }
    }
    if (currentStep === 2) {
      // Location step - validate address
      if (!formData.address || formData.address.trim().length === 0) {
        Alert.alert('Error', 'Please enter your business address');
        return false;
      }
      if (!formData.phone || formData.phone.trim().length === 0) {
        Alert.alert('Error', 'Please enter your phone number');
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - register (if needed) and create vendor profile
      setIsLoading(true);
      try {
        // Step 1: Register as vendor only if not already authenticated
        if (!isAuthenticated || user?.default_role !== 'vendor') {
          console.log('Registering vendor account...');
          await register(formData.email, formData.password, 'shop');
          console.log('Registration successful, tokens stored');
        }
        
        // Small delay to ensure tokens are fully stored
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Step 2: Create vendor profile with business details
        console.log('Creating vendor profile...');
        
        // Ensure all fields meet API requirements (minLength: 3 for name fields)
        const firstName = formData.businessName.split(' ')[0] || formData.businessName;
        const lastName = formData.businessName.split(' ').slice(1).join(' ') || 'Business';
        
        // Ensure minimum length requirements
        const safeFirstName = firstName.length >= 3 ? firstName : firstName.padEnd(3, 'X');
        const safeLastName = lastName.length >= 3 ? lastName : lastName.padEnd(3, 'X');
        
        // Generate username (must be at least 3 chars)
        let username = formData.businessName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        if (username.length < 3) {
          username = username.padEnd(3, 'x');
        }
        
        // Ensure phone number is provided
        if (!formData.phone || formData.phone.trim() === '') {
          throw new Error('Phone number is required');
        }
        
        // Ensure address is provided
        if (!formData.address || formData.address.trim() === '') {
          throw new Error('Address is required');
        }
        
        const profileData = {
          first_name: safeFirstName,
          last_name: safeLastName,
          username: username,
          phone_number: formData.phone.trim(),
          country: 'Australia',
          state: formData.suburb || 'NSW',
          address: formData.address.trim(),
          bio: `${formData.businessName} - ${formData.category}`,
          ratings: 0,
        };
        console.log('Profile data:', profileData);
        
        try {
          const vendorProfile = await vendorApi.createProfile(profileData);
          console.log('Vendor profile created:', vendorProfile);
          
          // Navigate to dashboard
          Alert.alert('Success!', 'Your business profile has been created.', [
            { text: 'OK', onPress: () => router.replace('/(business)/dashboard' as any) }
          ]);
        } catch (profileError: any) {
          // Check if vendor profile already exists
          if (profileError.message && profileError.message.includes('Vendor exists')) {
            console.log('Vendor profile already exists, proceeding to dashboard');
            // Profile already exists, just proceed to dashboard
            Alert.alert('Profile Complete', 'Your business profile is already set up.', [
              { text: 'OK', onPress: () => router.replace('/(business)/dashboard' as any) }
            ]);
          } else {
            // Re-throw other errors
            throw profileError;
          }
        }
      } catch (error: any) {
        console.error('Setup error details:', error);
        const errorMessage = error.message || error.toString() || 'Unknown error occurred';
        Alert.alert(
          'Setup Failed', 
          `Failed to complete setup: ${errorMessage}\n\nPlease check your connection and try again.`,
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderAccount = () => (
    <View style={styles.stepContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>BUSINESS EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="your.business@email.com"
          placeholderTextColor={Colors.textSecondary}
          value={formData.email}
          onChangeText={(email) => setFormData({ ...formData, email })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          placeholderTextColor={Colors.textSecondary}
          value={formData.password}
          onChangeText={(password) => setFormData({ ...formData, password })}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CONFIRM PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter your password"
          placeholderTextColor={Colors.textSecondary}
          value={formData.confirmPassword}
          onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  const renderBusinessInfo = () => (
    <View style={styles.stepContent}>
      {/* Logo Upload */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>BUSINESS LOGO</Text>
        <TouchableOpacity style={styles.uploadContainer}>
          <Ionicons name="cloud-upload-outline" size={48} color={Colors.textSecondary} />
          <Text style={styles.uploadTitle}>Upload Logo</Text>
          <Text style={styles.uploadSubtitle}>PNG or JPG, max 2MB</Text>
        </TouchableOpacity>
      </View>

      {/* Business Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>BUSINESS NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Harbor Kitchen"
          placeholderTextColor={Colors.textSecondary}
          value={formData.businessName}
          onChangeText={(businessName) => setFormData({ ...formData, businessName })}
        />
      </View>

      {/* Category */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {['Cafe', 'Restaurant', 'Bakery', 'Grocery', 'Other'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                formData.category === cat.toLowerCase() && styles.categoryChipActive,
              ]}
              onPress={() => setFormData({ ...formData, category: cat.toLowerCase() })}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  formData.category === cat.toLowerCase() && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Phone */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>PHONE NUMBER</Text>
        <TextInput
          style={styles.input}
          placeholder="0400 000 000"
          placeholderTextColor={Colors.textSecondary}
          value={formData.phone}
          onChangeText={(phone) => setFormData({ ...formData, phone })}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderLocation = () => (
    <View style={styles.stepContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>STREET ADDRESS</Text>
        <TextInput
          style={styles.input}
          placeholder="123 Crown Street"
          placeholderTextColor={Colors.textSecondary}
          value={formData.address}
          onChangeText={(address) => setFormData({ ...formData, address })}
        />
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>SUBURB</Text>
          <View style={styles.selectContainer}>
            <Text style={styles.selectText}>{formData.suburb}</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
          </View>
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>POSTCODE</Text>
          <TextInput
            style={styles.input}
            placeholder="2500"
            placeholderTextColor={Colors.textSecondary}
            value={formData.postcode}
            onChangeText={(postcode) => setFormData({ ...formData, postcode })}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipText}>
          💡 Make sure this matches your business's physical pickup location
        </Text>
      </View>
    </View>
  );

  const renderHours = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Business Hours</Text>
      <Text style={styles.stepSubtitle}>Set your typical pickup windows</Text>

      <View style={styles.hoursList}>
        {dayHours.map((item, index) => (
          <View key={item.day} style={styles.hourRow}>
            <TouchableOpacity
              style={styles.dayCheckbox}
              onPress={() => {
                const newHours = [...dayHours];
                newHours[index].enabled = !newHours[index].enabled;
                setDayHours(newHours);
              }}
            >
              <Ionicons
                name={item.enabled ? 'checkbox' : 'square-outline'}
                size={24}
                color={item.enabled ? Colors.primary : Colors.textSecondary}
              />
            </TouchableOpacity>
            <Text style={[styles.dayLabel, !item.enabled && styles.dayLabelDisabled]}>
              {item.day}
            </Text>
            <View style={styles.timeInputs}>
              <View style={styles.timeInput}>
                <Text style={styles.timeText}>{item.start}</Text>
              </View>
              <Text style={styles.timeSeparator}>-</Text>
              <View style={styles.timeInput}>
                <Text style={styles.timeText}>{item.end}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'account':
        return renderAccount();
      case 'info':
        return renderBusinessInfo();
      case 'location':
        return renderLocation();
      case 'hours':
        return renderHours();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Setup Your Business</Text>

        {/* Progress Steps */}
        <View style={styles.progressSteps}>
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <View key={step.id} style={styles.progressStep}>
                <View
                  style={[
                    styles.progressIcon,
                    isCompleted && styles.progressIconCompleted,
                    isCurrent && styles.progressIconCurrent,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={24} color={Colors.primary} />
                  ) : (
                    <Ionicons
                      name={step.icon}
                      size={24}
                      color={isCurrent ? Colors.white : 'rgba(255,255,255,0.6)'}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.progressLabel,
                    isCurrent && styles.progressLabelCurrent,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Form */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.continueButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.continueButtonText}>
                {currentStep === STEPS.length - 1 ? 'Create Account' : 'Continue'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.white} />
            </>
          )}
        </TouchableOpacity>

        {currentStep > 0 && !isLoading && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
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
    paddingTop: 48,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressIconCompleted: {
    backgroundColor: Colors.secondary,
  },
  progressIconCurrent: {
    backgroundColor: Colors.accent,
  },
  progressLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  progressLabelCurrent: {
    color: Colors.white,
    fontWeight: FontWeight.semiBold,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  stepContent: {
    gap: Spacing.lg,
  },
  stepTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  stepSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 16,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  selectContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  uploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  uploadTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  uploadSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  tipCard: {
    backgroundColor: 'rgba(217, 224, 33, 0.2)',
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  tipText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    lineHeight: 22,
  },
  hoursList: {
    gap: 12,
  },
  hourRow: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayCheckbox: {
    padding: 4,
  },
  dayLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    flex: 1,
  },
  dayLabelDisabled: {
    color: Colors.textSecondary,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  timeSeparator: {
    color: Colors.textSecondary,
  },
  securityNote: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  securityNoteText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: 12,
  },
  continueButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 20,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
  },
});

