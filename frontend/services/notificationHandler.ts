import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

/**
 * Handle notification data and navigate to appropriate screen
 */
export function handleNotificationNavigation(
  notification: Notifications.Notification | Notifications.NotificationResponse
): void {
  try {
    const data = notification.request.content.data;
    console.log('[NotificationHandler] Handling notification navigation with data:', data);

    if (!data) {
      console.log('[NotificationHandler] No data in notification, ignoring');
      return;
    }

    // Handle hot deal notifications
    if (data.type === 'hot-deal' || data.deal_id) {
      const dealId = data.deal_id || data.id;
      if (dealId) {
        console.log('[NotificationHandler] Navigating to deal details:', dealId);
        router.push(`/(customer)/deal-details?id=${dealId}`);
        return;
      }
    }

    // Handle order confirmation notifications
    if (data.type === 'order-confirm' || data.order_id) {
      const orderId = data.order_id || data.id;
      if (orderId) {
        console.log('[NotificationHandler] Navigating to order confirmation:', orderId);
        router.push(`/(customer)/order-confirmation?orderId=${orderId}`);
        return;
      }
      // If no specific order ID, go to orders tab
      console.log('[NotificationHandler] Navigating to orders tab');
      router.push('/(tabs)/orders');
      return;
    }

    // Default: navigate to home if no specific route
    console.log('[NotificationHandler] No specific route, navigating to home');
    router.push('/(tabs)');
  } catch (error) {
    console.error('[NotificationHandler] Error handling notification navigation:', error);
    // Fallback to home on error
    router.push('/(tabs)');
  }
}

/**
 * Handle notification received while app is in foreground
 */
export function handleForegroundNotification(
  notification: Notifications.Notification
): void {
  try {
    console.log('[NotificationHandler] Handling foreground notification');
    const data = notification.request.content.data;
    
    // You can show a custom in-app notification here
    // For now, we'll just log it
    if (data) {
      console.log('[NotificationHandler] Notification data:', data);
    }
    
    // The notification will be shown automatically by expo-notifications
    // based on the handler we set in notificationService.ts
  } catch (error) {
    console.error('[NotificationHandler] Error handling foreground notification:', error);
  }
}

/**
 * Handle notification tapped (when user taps on notification)
 */
export function handleNotificationTap(
  response: Notifications.NotificationResponse
): void {
  try {
    console.log('[NotificationHandler] Handling notification tap');
    handleNotificationNavigation(response);
  } catch (error) {
    console.error('[NotificationHandler] Error handling notification tap:', error);
  }
}

