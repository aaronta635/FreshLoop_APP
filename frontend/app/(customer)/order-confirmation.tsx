import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { orderId, total } = params;
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate checkmark
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatPrice = (cents: string) => {
    const num = parseInt(cents) || 0;
    return `$${(num / 100).toFixed(2)}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just saved food from waste with Fresh Loop! 🌱 Order #${orderId}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleViewOrder = () => {
    router.replace('/(tabs)/orders');
  };

  const handleBrowseMore = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Success Animation */}
      <View style={styles.successContainer}>
        <Animated.View 
          style={[
            styles.checkCircle,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Ionicons name="checkmark" size={64} color={Colors.white} />
        </Animated.View>
        
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Thank you for saving food 🌱
          </Text>
        </Animated.View>
      </View>

      {/* Order Details */}
      <Animated.View style={[styles.detailsCard, { opacity: fadeAnim }]}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Number</Text>
          <Text style={styles.detailValue}>#{orderId}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Paid</Text>
          <Text style={styles.detailValueLarge}>{formatPrice(total as string)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
        </View>
      </Animated.View>

      {/* Instructions */}
      <Animated.View style={[styles.instructionsCard, { opacity: fadeAnim }]}>
        <Text style={styles.instructionsTitle}>What's Next?</Text>
        
        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>1</Text>
          </View>
          <View style={styles.instructionContent}>
            <Text style={styles.instructionText}>
              Wait for pickup notification
            </Text>
            <Text style={styles.instructionSubtext}>
              We'll notify you when your order is ready
            </Text>
          </View>
        </View>

        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>2</Text>
          </View>
          <View style={styles.instructionContent}>
            <Text style={styles.instructionText}>
              Head to the pickup location
            </Text>
            <Text style={styles.instructionSubtext}>
              Show your order confirmation at pickup
            </Text>
          </View>
        </View>

        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>3</Text>
          </View>
          <View style={styles.instructionContent}>
            <Text style={styles.instructionText}>
              Enjoy your rescued food!
            </Text>
            <Text style={styles.instructionSubtext}>
              You just helped reduce food waste 🎉
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Impact Card */}
      <Animated.View style={[styles.impactCard, { opacity: fadeAnim }]}>
        <Ionicons name="leaf" size={24} color={Colors.white} />
        <Text style={styles.impactText}>
          You saved approximately 1.2kg of CO₂ emissions!
        </Text>
      </Animated.View>

      {/* Actions */}
      <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleViewOrder}>
          <Ionicons name="receipt-outline" size={20} color={Colors.white} />
          <Text style={styles.primaryButtonText}>View Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleBrowseMore}>
          <Text style={styles.secondaryButtonText}>Browse More Deals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color={Colors.accent} />
          <Text style={styles.shareButtonText}>Share Your Impact</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    paddingTop: 80,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  detailValueLarge: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: '#22C55E',
  },
  instructionsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  instructionSubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  impactCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  impactText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.white,
    marginLeft: 12,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
  },
  primaryButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
  },
  secondaryButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  shareButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent,
  },
});

