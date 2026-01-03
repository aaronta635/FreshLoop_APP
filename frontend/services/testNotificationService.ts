/**
 * Test script for notification service integration
 * Run this to verify the notification service is working correctly
 */

import { 
  initializeNotifications, 
  registerDeviceToken,
  requestNotificationPermissions,
  getDeviceToken 
} from './notificationService';

const NOTIFICATION_SERVICE_URL = 'https://noti-push-microservice-production.up.railway.app';

/**
 * Test device registration
 */
export async function testDeviceRegistration(userId: string): Promise<boolean> {
  try {
    console.log('[Test] Starting device registration test...');
    
    // Request permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.error('[Test] ❌ Failed: No notification permissions');
      return false;
    }
    console.log('[Test] ✅ Permissions granted');

    // Get device token
    const deviceToken = await getDeviceToken();
    if (!deviceToken) {
      console.error('[Test] ❌ Failed: Could not get device token');
      return false;
    }
    console.log('[Test] ✅ Device token obtained:', deviceToken.substring(0, 30) + '...');

    // Register with notification service
    const success = await registerDeviceToken(userId, deviceToken);
    if (success) {
      console.log('[Test] ✅ Device registered successfully with notification service');
      return true;
    } else {
      console.error('[Test] ❌ Failed: Could not register device with notification service');
      return false;
    }
  } catch (error) {
    console.error('[Test] ❌ Error during device registration test:', error);
    return false;
  }
}

/**
 * Test notification service API endpoints
 */
export async function testNotificationEndpoints(userId: string): Promise<void> {
  try {
    console.log('[Test] Testing notification service endpoints...');

    // Test hot deal notification
    console.log('[Test] Testing /notify/hot-deal endpoint...');
    const hotDealResponse = await fetch(`${NOTIFICATION_SERVICE_URL}/notify/hot-deal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        title: 'Hot Deal Available!',
        body: 'Check out this amazing deal',
        data: {
          type: 'hot-deal',
          deal_id: '123',
        },
      }),
    });

    if (hotDealResponse.ok) {
      const hotDealResult = await hotDealResponse.json();
      console.log('[Test] ✅ Hot deal notification sent:', hotDealResult);
    } else {
      const errorText = await hotDealResponse.text();
      console.error('[Test] ❌ Hot deal notification failed:', hotDealResponse.status, errorText);
    }

    // Test order confirmation notification
    console.log('[Test] Testing /notify/order-confirm endpoint...');
    const orderConfirmResponse = await fetch(`${NOTIFICATION_SERVICE_URL}/notify/order-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        title: 'Order Confirmed',
        body: 'Your order has been confirmed',
        data: {
          type: 'order-confirm',
          order_id: '456',
        },
      }),
    });

    if (orderConfirmResponse.ok) {
      const orderConfirmResult = await orderConfirmResponse.json();
      console.log('[Test] ✅ Order confirmation notification sent:', orderConfirmResult);
    } else {
      const errorText = await orderConfirmResponse.text();
      console.error('[Test] ❌ Order confirmation notification failed:', orderConfirmResponse.status, errorText);
    }
  } catch (error) {
    console.error('[Test] ❌ Error testing notification endpoints:', error);
  }
}

/**
 * Run all tests
 */
export async function runAllTests(userId: string): Promise<void> {
  console.log('========================================');
  console.log('Notification Service Integration Tests');
  console.log('========================================');
  console.log('');

  // Test device registration
  const registrationSuccess = await testDeviceRegistration(userId);
  console.log('');

  if (registrationSuccess) {
    // Test notification endpoints (only if device is registered)
    await testNotificationEndpoints(userId);
  } else {
    console.log('[Test] Skipping notification endpoint tests (device not registered)');
  }

  console.log('');
  console.log('========================================');
  console.log('Tests completed');
  console.log('========================================');
}

