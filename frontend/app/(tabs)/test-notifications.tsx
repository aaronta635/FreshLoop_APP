import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {
  requestNotificationPermissions,
  getDeviceToken,
  registerDeviceToken,
  initializeNotifications,
} from '../../services/notificationService';
import {
  testDeviceRegistration,
  testNotificationEndpoints,
  runAllTests,
} from '../../services/testNotificationService';

import * as Device from 'expo-device';

export default function TestNotificationsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [testUserId, setTestUserId] = useState(user?.id?.toString() || '');
  const [isPhysicalDevice, setIsPhysicalDevice] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if running on physical device
    setIsPhysicalDevice(Device.isDevice);
    if (!Device.isDevice) {
      logStatus('⚠️ Running on simulator/emulator');
      logStatus('Push notifications require a physical device');
    }
  }, []);

  const logStatus = (message: string) => {
    console.log('[TestNotifications]', message);
    setStatus((prev) => prev + '\n' + message);
  };

  const testPermissions = async () => {
    setLoading(true);
    logStatus('Testing notification permissions...');
    try {
      if (!Device.isDevice) {
        logStatus('⚠️ Running on simulator/emulator');
        logStatus('❌ Push notifications require a physical device');
        Alert.alert(
          'Simulator Detected',
          'Push notifications only work on physical devices, not simulators or emulators.\n\nPlease test on a real device.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        logStatus('✅ Permissions granted!');
        Alert.alert('Success', 'Notification permissions granted');
      } else {
        logStatus('❌ Permissions denied');
        Alert.alert(
          'Permissions Denied',
          'Notification permissions were denied.\n\nTo fix:\n1. Go to device Settings\n2. Find this app\n3. Enable Notifications\n\nThen try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      logStatus(`❌ Error: ${error}`);
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const testGetToken = async () => {
    setLoading(true);
    logStatus('Getting device token...');
    try {
      const token = await getDeviceToken();
      if (token) {
        setDeviceToken(token);
        logStatus(`✅ Token obtained: ${token.substring(0, 30)}...`);
        Alert.alert('Success', 'Device token obtained!');
      } else {
        logStatus('❌ Failed to get device token');
        Alert.alert('Error', 'Failed to get device token');
      }
    } catch (error) {
      logStatus(`❌ Error: ${error}`);
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const testRegisterDevice = async () => {
    if (!testUserId) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }
    if (!deviceToken) {
      Alert.alert('Error', 'Please get device token first');
      return;
    }

    setLoading(true);
    logStatus(`Registering device for user: ${testUserId}...`);
    try {
      const success = await registerDeviceToken(testUserId, deviceToken);
      if (success) {
        logStatus('✅ Device registered successfully!');
        Alert.alert('Success', 'Device registered with notification service');
      } else {
        logStatus('❌ Failed to register device');
        Alert.alert('Error', 'Failed to register device');
      }
    } catch (error) {
      logStatus(`❌ Error: ${error}`);
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const testInitialize = async () => {
    setLoading(true);
    logStatus('Initializing notifications...');
    try {
      const token = await initializeNotifications();
      if (token) {
        setDeviceToken(token);
        logStatus(`✅ Initialized! Token: ${token.substring(0, 30)}...`);
        Alert.alert('Success', 'Notifications initialized!');
      } else {
        logStatus('❌ Failed to initialize');
        Alert.alert('Error', 'Failed to initialize notifications');
      }
    } catch (error) {
      logStatus(`❌ Error: ${error}`);
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const testSendHotDeal = async () => {
    if (!testUserId) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    setLoading(true);
    logStatus('Sending hot deal test notification...');
    try {
      await testNotificationEndpoints(testUserId);
      logStatus('✅ Test notification sent!');
      Alert.alert('Success', 'Test notification sent! Check your device.');
    } catch (error) {
      logStatus(`❌ Error: ${error}`);
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const runFullTest = async () => {
    if (!testUserId) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    setLoading(true);
    setStatus('Starting full test suite...\n');
    try {
      await runAllTests(testUserId);
      logStatus('\n✅ All tests completed!');
      Alert.alert('Success', 'All tests completed! Check console for details.');
    } catch (error) {
      logStatus(`\n❌ Error: ${error}`);
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Notification Service Test</Text>
        <Text style={styles.subtitle}>Test push notification functionality</Text>

        {/* Device Warning */}
        {isPhysicalDevice === false && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              ⚠️ Push notifications only work on physical devices, not simulators/emulators
            </Text>
          </View>
        )}

        {/* User ID Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>User ID:</Text>
          <TextInput
            style={styles.input}
            value={testUserId}
            onChangeText={setTestUserId}
            placeholder="Enter user ID"
            placeholderTextColor="#999"
          />
        </View>

        {/* Device Token Display */}
        {deviceToken && (
          <View style={styles.tokenContainer}>
            <Text style={styles.label}>Device Token:</Text>
            <Text style={styles.tokenText} selectable>
              {deviceToken.substring(0, 50)}...
            </Text>
          </View>
        )}

        {/* Test Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={testPermissions}
            disabled={loading}
          >
            <Text style={styles.buttonText}>1. Test Permissions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={testGetToken}
            disabled={loading}
          >
            <Text style={styles.buttonText}>2. Get Device Token</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={testRegisterDevice}
            disabled={loading || !deviceToken}
          >
            <Text style={styles.buttonText}>3. Register Device</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={testInitialize}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Initialize All (1-3)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSuccess]}
            onPress={testSendHotDeal}
            disabled={loading}
          >
            <Text style={styles.buttonText}>4. Send Test Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={runFullTest}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Run Full Test Suite</Text>
          </TouchableOpacity>
        </View>

        {/* Status Log */}
        {status && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status Log:</Text>
            <ScrollView style={styles.statusScroll}>
              <Text style={styles.statusText}>{status}</Text>
            </ScrollView>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFEF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  tokenContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  tokenText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#5856D6',
  },
  buttonSuccess: {
    backgroundColor: '#34C759',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  statusScroll: {
    maxHeight: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFC107',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    lineHeight: 20,
  },
});

