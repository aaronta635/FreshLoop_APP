import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { cartApi, API_BASE_URL } from '../../services/api';

interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

// Mock payment methods (will be replaced with real Stripe integration)
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
  { id: '2', type: 'apple_pay', isDefault: false },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { cart, refreshCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('1');
  const [paymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to checkout', [
        { text: 'Cancel', onPress: () => router.back() },
        { text: 'Login', onPress: () => router.push('/(onboarding)/login') },
      ]);
    }
  }, [isAuthenticated]);

  const getImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleCheckout = async () => {
    if (!selectedPayment) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Call checkout API
      const result = await cartApi.checkout();
      
      // Clear cart and navigate to confirmation
      await clearCart();
      
      router.replace({
        pathname: '/(customer)/order-confirmation',
        params: { 
          orderId: result.order_id || 'ORD-' + Date.now(),
          total: cart?.total_amount?.toString() || '0',
        },
      });
    } catch (error: any) {
      Alert.alert('Checkout Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'apple_pay':
        return <Ionicons name="logo-apple" size={24} color={Colors.primary} />;
      case 'google_pay':
        return <Ionicons name="logo-google" size={24} color={Colors.primary} />;
      default:
        return <Ionicons name="card" size={24} color={Colors.primary} />;
    }
  };

  const getPaymentLabel = (method: PaymentMethod) => {
    switch (method.type) {
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return `${method.brand} •••• ${method.last4}`;
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add some deals to checkout</Text>
        <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.browseButtonText}>Browse Deals</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.card}>
            {cart.items.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.orderItem,
                  index < cart.items.length - 1 && styles.orderItemBorder
                ]}
              >
                <Image 
                  source={{ uri: getImageUrl(item.image_url) }} 
                  style={styles.itemImage} 
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{item.title || 'Deal'}</Text>
                  <Text style={styles.itemRestaurant}>{item.restaurant_name}</Text>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  {formatPrice((item.price || 0) * item.quantity)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pickup Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          <View style={styles.card}>
            <View style={styles.pickupRow}>
              <Ionicons name="location" size={20} color={Colors.accent} />
              <View style={styles.pickupInfo}>
                <Text style={styles.pickupLabel}>Pickup Address</Text>
                <Text style={styles.pickupValue}>
                  {cart.items[0]?.deal?.pickup_address || 'Address will be provided'}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.pickupRow}>
              <Ionicons name="time" size={20} color={Colors.accent} />
              <View style={styles.pickupInfo}>
                <Text style={styles.pickupLabel}>Pickup Time</Text>
                <Text style={styles.pickupValue}>
                  {cart.items[0]?.deal?.ready_time 
                    ? new Date(cart.items[0].deal.ready_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : 'Ready soon'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/payment-methods')}>
              <Text style={styles.addText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  selectedPayment === method.id && styles.paymentOptionSelected
                ]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <View style={styles.paymentLeft}>
                  {getPaymentIcon(method)}
                  <Text style={styles.paymentLabel}>{getPaymentLabel(method)}</Text>
                </View>
                <View style={[
                  styles.radioOuter,
                  selectedPayment === method.id && styles.radioOuterSelected
                ]}>
                  {selectedPayment === method.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.card}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>{formatPrice(cart.total_amount)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee</Text>
              <Text style={styles.priceValue}>$0.00</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>You Save</Text>
              <Text style={[styles.priceValue, styles.savings]}>
                -{formatPrice(Math.round(cart.total_amount * 0.4))}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(cart.total_amount)}</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By placing this order, you agree to our Terms of Service and confirm that you will pick up your order at the specified time.
        </Text>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalValue}>{formatPrice(cart.total_amount)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, isProcessing && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={20} color={Colors.white} />
              <Text style={styles.checkoutButtonText}>Pay {formatPrice(cart.total_amount)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  addText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  orderItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  itemRestaurant: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  itemQuantity: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  pickupInfo: {
    marginLeft: 12,
    flex: 1,
  },
  pickupLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  pickupValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
    backgroundColor: Colors.lightGray,
  },
  paymentOptionSelected: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  savings: {
    color: '#22C55E',
    fontWeight: FontWeight.semiBold,
  },
  totalLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  totalValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  terms: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerTotal: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  footerTotalValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.full,
  },
  checkoutButtonDisabled: {
    opacity: 0.7,
  },
  checkoutButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  browseButton: {
    marginTop: 24,
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.full,
  },
  browseButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});

