# Push Notification Setup Guide

This guide will help you set up push notifications for your React Native Expo app using Firebase Cloud Messaging (FCM) via Expo Notifications.

## Prerequisites

- Expo project (already set up)
- Physical device (push notifications don't work on simulators/emulators)
- Firebase project (for FCM)
- EAS account (for building with native code)

## Step 1: Install Required Packages

Run the following command in your `frontend` directory:

```bash
npx expo install expo-notifications expo-device expo-constants
```

These packages provide:
- `expo-notifications`: Handles push notifications
- `expo-device`: Detects if running on physical device
- `expo-constants`: Access to app configuration

## Step 2: Configure Firebase Cloud Messaging

### For Android:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select your Firebase project
3. Add Android app to your Firebase project:
   - Package name: Check your `app.json` for the Android package name
   - Download `google-services.json`
4. Place `google-services.json` in `frontend/android/app/` directory

### For iOS:

1. In Firebase Console, add iOS app to your project:
   - Bundle ID: Check your `app.json` for the iOS bundle identifier
   - Download `GoogleService-Info.plist`
2. Place `GoogleService-Info.plist` in `frontend/ios/` directory

**Note:** You'll need to create native builds (not Expo Go) for push notifications to work.

## Step 3: Configure EAS Build

Since push notifications require native code, you need to use EAS Build.

1. Install EAS CLI globally:
```bash
npm install -g eas-cli
```

2. Login to EAS:
```bash
eas login
```

3. Configure your project:
```bash
eas build:configure
```

4. Update `app.json` with your EAS project ID (if not already set):
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

## Step 4: Build Development Build

Build a development build for testing:

```bash
# For Android
eas build --profile development --platform android

# For iOS
eas build --profile development --platform ios
```

Or build locally:
```bash
npx expo prebuild
npx expo run:android  # or npx expo run:ios
```

## Step 5: Update Notification Service URL

The notification service URL is already configured in `services/notificationService.ts`:

```typescript
const NOTIFICATION_SERVICE_URL = 'https://my-noti-service.railway.app';
```

If your notification service URL is different, update it in that file.

## Step 6: Test Push Notifications

### Testing on Physical Device:

1. Install the development build on your physical device
2. Login to the app
3. The device token will be automatically registered with your notification service
4. Check the console logs for:
   - `[NotificationService] Device token obtained`
   - `[NotificationService] Device registered successfully`

### Sending Test Notification:

You can test by having your backend call the notification service endpoints:
- `POST /notify/hot-deal` - For hot deal notifications
- `POST /notify/order-confirm` - For order confirmation notifications

## How It Works

### Automatic Registration:

1. **On Login**: When a user logs in, the device token is automatically registered
2. **On App Start**: If user is already logged in, device is registered on app start
3. **On Registration**: New users get their device registered after signup

### Notification Handling:

1. **Foreground**: Notifications are shown automatically when app is open
2. **Background**: Notifications appear in system notification tray
3. **Tapped**: Tapping a notification navigates to the relevant screen:
   - Hot deals → Deal details page
   - Order confirmations → Order confirmation or orders page

### Notification Data Format:

Your backend should send notifications with this data structure:

```json
{
  "notification": {
    "title": "Hot Deal Available!",
    "body": "Check out this amazing deal"
  },
  "data": {
    "type": "hot-deal",
    "deal_id": "123"
  }
}
```

For order confirmations:
```json
{
  "notification": {
    "title": "Order Confirmed",
    "body": "Your order has been confirmed"
  },
  "data": {
    "type": "order-confirm",
    "order_id": "456"
  }
}
```

## Troubleshooting

### "Must use physical device for Push Notifications"
- Push notifications only work on physical devices, not simulators/emulators

### "Project ID not found"
- Make sure you've configured EAS and added the project ID to `app.json`

### "Failed to get push token"
- Check that you've built a development build (not using Expo Go)
- Verify Firebase configuration files are in place
- Check device has internet connection

### Notifications not appearing
- Check notification permissions are granted
- Verify device token is registered with your notification service
- Check console logs for errors

## Files Created/Modified

- `services/notificationService.ts` - Core notification service
- `services/notificationHandler.ts` - Navigation handling for notifications
- `context/AuthContext.tsx` - Integrated device registration
- `app/_layout.tsx` - Notification listener setup
- `app.json` - Notification plugin configuration

## Next Steps

1. Install the packages
2. Set up Firebase and download config files
3. Configure EAS Build
4. Build and test on physical device
5. Verify device registration in your notification service logs

