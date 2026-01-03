#!/bin/bash

# Push Notification Setup Script
# This script installs the required packages for push notifications

echo "Installing push notification dependencies..."

# Install required Expo packages
npx expo install expo-notifications expo-device

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Follow the setup guide in NOTIFICATION_SETUP.md"
echo "2. Configure Firebase Cloud Messaging"
echo "3. Build a development build (not Expo Go)"
echo "4. Test on a physical device"
echo ""

