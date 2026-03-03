import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { API_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
};

export default function CartScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, checkout, refreshCart, removeFromCart, isLoading } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);

  const handleCheckout = async () => {
    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
      Alert.alert('Empty Cart', 'Add some items to your cart first!');
      return;
    }

    Alert.alert(
      'Confirm Checkout',
      `Total: $${(cart.total_amount / 100).toFixed(2)}\n\nProceed with checkout?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Checkout',
          onPress: async () => {
            try {
              const result = await checkout();
              Alert.alert(
                'Order Placed!',
                result.message || 'Your order has been confirmed.',
                [
                  {
                    text: 'View Orders',
                    onPress: () => router.push('/(tabs)/orders'),
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert('Checkout Failed', error.message || 'Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeFromCart(productId);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to remove item');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="log-in-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptyText}>Please login to view your cart</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(onboarding)/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        {cart && cart.total_items_quantity > 0 && (
          <Text style={styles.headerSubtitle}>{cart.total_items_quantity} items</Text>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refreshCart}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : cart && cart.cart_items && cart.cart_items.length > 0 ? (
          <>
            {cart.cart_items.map((item) => (
              <View key={item.product_id} style={styles.cartCard}>
                <Image
                  source={{ uri: getImageUrl(item.product?.product_images?.[0]?.product_image) }}
                  style={styles.cartImage}
                />
                <View style={styles.cartDetails}>
                  <Text style={styles.cartTitle} numberOfLines={1}>
                    {item.product?.product_name || 'Product'}
                  </Text>
                  <Text style={styles.cartVendor} numberOfLines={1}>
                    {item.product?.vendor?.username || 'Vendor'}
                  </Text>
                  <View style={styles.cartPriceRow}>
                    <Text style={styles.cartQuantity}>Qty: {item.quantity}</Text>
                    <Text style={styles.cartPrice}>
                      ${((item.product?.price || 0) * item.quantity / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.product_id)}
                >
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Cart Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items ({cart.total_items_quantity})</Text>
                <Text style={styles.summaryValue}>${(cart.total_amount / 100).toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Fee</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${(cart.total_amount / 100).toFixed(2)}</Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={80} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyText}>
              Discover great deals and add items to your cart
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Ionicons name="compass-outline" size={20} color={Colors.white} />
              <Text style={styles.browseButtonText}>Browse Deals</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 48,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  loadingContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  cartCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  cartDetails: {
    flex: 1,
  },
  cartTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 2,
  },
  cartVendor: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cartPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartQuantity: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  cartPrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  removeButton: {
    padding: Spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BorderRadius.full,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  totalValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  checkoutButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 18,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  browseButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  loginButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.full,
  },
  loginButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});

