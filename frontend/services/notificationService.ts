import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Notification service base URL
const NOTIFICATION_SERVICE_URL = 'https://noti-push-microservice-production.up.railway.app';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user
 * Required especially for iOS
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    console.log('[NotificationService] Requesting notification permissions...');
    
    if (!Device.isDevice) {
      console.warn('[NotificationService] ⚠️ Must use physical device for Push Notifications');
      console.warn('[NotificationService] Simulators/emulators do not support push notifications');
      return false;
    }

    const { status: existingStatus, canAskAgain } = await Notifications.getPermissionsAsync();
    console.log('[NotificationService] Existing permission status:', existingStatus);
    console.log('[NotificationService] Can ask again:', canAskAgain);
    
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      if (existingStatus === 'denied' && !canAskAgain) {
        console.error('[NotificationService] ❌ Permissions permanently denied');
        console.error('[NotificationService] Please enable notifications in device Settings > App Name > Notifications');
        return false;
      }
      
      console.log('[NotificationService] Requesting permissions...');
      const { status, canAskAgain: newCanAskAgain } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('[NotificationService] New permission status:', finalStatus);
      console.log('[NotificationService] Can ask again:', newCanAskAgain);
      
      if (finalStatus === 'denied' && !newCanAskAgain) {
        console.error('[NotificationService] ❌ Permissions denied and cannot ask again');
        console.error('[NotificationService] Please enable notifications in device Settings > App Name > Notifications');
        return false;
      }
    }
    
    if (finalStatus !== 'granted') {
      console.error('[NotificationService] ❌ Failed to get push token for push notification!');
      console.error('[NotificationService] Permission status:', finalStatus);
      if (finalStatus === 'denied') {
        console.error('[NotificationService] User denied permissions. Please grant permissions in device settings.');
      }
      return false;
    }

    // For Android, we need to configure the notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      console.log('[NotificationService] Android notification channel configured');
    }

    console.log('[NotificationService] Notification permissions granted');
    return true;
  } catch (error) {
    console.error('[NotificationService] Error requesting permissions:', error);
    return false;
  }
}

/**
 * Get the FCM device token
 * This token is used to send push notifications to this specific device
 */
export async function getDeviceToken(): Promise<string | null> {
  try {
    console.log('[NotificationService] Getting device token...');
    
    if (!Device.isDevice) {
      console.warn('[NotificationService] Must use physical device for Push Notifications');
      return null;
    }

    // Try multiple ways to get the project ID
    const projectId = 
      Constants.expoConfig?.extra?.eas?.projectId ?? 
      Constants.easConfig?.projectId ?? 
      Constants.expoConfig?.projectId;
    
    if (!projectId) {
      console.error('[NotificationService] Project ID not found in app config');
      console.error('[NotificationService] Available Constants:', {
        hasExpoConfig: !!Constants.expoConfig,
        hasEasConfig: !!Constants.easConfig,
        expoConfigKeys: Constants.expoConfig ? Object.keys(Constants.expoConfig) : [],
        easConfigKeys: Constants.easConfig ? Object.keys(Constants.easConfig) : [],
      });
      console.error('[NotificationService] To fix this:');
      console.error('[NotificationService] 1. Run: npx eas init (if using EAS)');
      console.error('[NotificationService] 2. Or add to app.json: "extra": { "eas": { "projectId": "your-project-id" } }');
      console.error('[NotificationService] 3. Or get project ID from: https://expo.dev/accounts/[your-account]/projects/[your-project]');
      return null;
    }

    console.log('[NotificationService] Using project ID:', projectId);

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });

    const token = tokenData.data;
    console.log('[NotificationService] Device token obtained:', token.substring(0, 20) + '...');
    
    return token;
  } catch (error) {
    console.error('[NotificationService] Error getting device token:', error);
    return null;
  }
}

/**
 * Register device token with the notification microservice
 */
export async function registerDeviceToken(
  userId: string,
  deviceToken: string
): Promise<boolean> {
  try {
    console.log('[NotificationService] Registering device token for user:', userId);
    
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    
    const response = await fetch(`${NOTIFICATION_SERVICE_URL}/register-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        device_token: deviceToken,
        platform: platform,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[NotificationService] Failed to register device:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log('[NotificationService] Device registered successfully:', result);
    return true;
  } catch (error) {
    console.error('[NotificationService] Error registering device:', error);
    return false;
  }
}

/**
 * Initialize notification service
 * Requests permissions and gets device token
 */
export async function initializeNotifications(): Promise<string | null> {
  try {
    console.log('[NotificationService] Initializing notifications...');
    
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.error('[NotificationService] No notification permissions');
      return null;
    }

    const token = await getDeviceToken();
    if (!token) {
      console.error('[NotificationService] Failed to get device token');
      return null;
    }

    console.log('[NotificationService] Notifications initialized successfully');
    return token;
  } catch (error) {
    console.error('[NotificationService] Error initializing notifications:', error);
    return null;
  }
}

/**
 * Setup notification listeners for foreground, background, and tap events
 */
export function setupNotificationListeners(
  onNotificationReceived: (notification: Notifications.Notification) => void,
  onNotificationTapped: (response: Notifications.NotificationResponse) => void
): () => void {
  console.log('[NotificationService] Setting up notification listeners...');

  // Listener for notifications received while app is in foreground
  const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
    console.log('[NotificationService] Notification received in foreground:', notification);
    onNotificationReceived(notification);
  });

  // Listener for when user taps on a notification
  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('[NotificationService] Notification tapped:', response);
    onNotificationTapped(response);
  });

  // Return cleanup function
  return () => {
    console.log('[NotificationService] Removing notification listeners');
    receivedListener.remove();
    responseListener.remove();
  };
}

/**
 * Get the last notification response (when app was opened from a notification)
 */
export async function getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
  try {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      console.log('[NotificationService] App opened from notification:', response);
    }
    return response;
  } catch (error) {
    console.error('[NotificationService] Error getting last notification:', error);
    return null;
  }
}

/**
 * Clear all notification badges
 */
export async function clearBadge(): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(0);
    console.log('[NotificationService] Badge cleared');
  } catch (error) {
    console.error('[NotificationService] Error clearing badge:', error);
  }
}

