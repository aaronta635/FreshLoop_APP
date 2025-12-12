import React, { useState, useEffect } from 'react';
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
import { ordersApi, Order, API_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

type TabType = 'cart' | 'orders';

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, checkout, refreshCart, removeFromCart, isLoading: isCartLoading } = useCart();
  
  const [activeTab, setActiveTab] = useState<TabType>('cart');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const fetchedOrders = await ordersApi.getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      refreshCart().then(() => setIsRefreshing(false));
    }
  };

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
                    onPress: () => {
                      setActiveTab('orders');
                      fetchOrders();
                    },
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

  const getImageUrl = (imageUrl: string | null): string => {
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=400';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="log-in-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptyText}>Please login to view your cart and orders</Text>
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
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cart' && styles.activeTab]}
          onPress={() => setActiveTab('cart')}
        >
          <Text style={[styles.tabText, activeTab === 'cart' && styles.activeTabText]}>
            Cart {cart && cart.total_items_quantity > 0 ? `(${cart.total_items_quantity})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {activeTab === 'cart' ? (
          <>
            {isCartLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : cart && cart.cart_items && cart.cart_items.length > 0 ? (
              <>
                {cart.cart_items.map((item) => (
                  <View key={item.product_id} style={styles.cartCard}>
                    <Image
                      source={{ uri: item.product?.product_images?.[0]?.product_image || 'https://via.placeholder.com/70' }}
                      style={styles.cartImage}
                    />
                    <View style={styles.cartDetails}>
                      <Text style={styles.cartTitle} numberOfLines={1}>{item.product?.product_name || 'Product'}</Text>
                      <Text style={styles.cartQuantity}>Qty: {item.quantity}</Text>
                      <Text style={styles.cartPrice}>${((item.product?.price || 0) * item.quantity / 100).toFixed(2)}</Text>
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
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Items</Text>
                    <Text style={styles.summaryValue}>{cart.total_items_quantity}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total</Text>
                    <Text style={styles.summaryTotal}>${(cart.total_amount / 100).toFixed(2)}</Text>
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
                <Ionicons name="cart-outline" size={64} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
                <Text style={styles.emptyText}>Browse deals and add items to your cart</Text>
                <TouchableOpacity
                  style={styles.browseButton}
                  onPress={() => router.push('/(tabs)/')}
                >
                  <Text style={styles.browseButtonText}>Browse Deals</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderNumber}>Order #{order.id}</Text>
                      <Text style={styles.orderDate}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      order.status === 'confirmed' && styles.statusConfirmed,
                      order.status === 'pending' && styles.statusPending,
                    ]}>
                      <Text style={styles.statusText}>{order.status}</Text>
                    </View>
                  </View>

                  {order.items.map((item, index) => (
                    <View key={index} style={styles.orderItem}>
                      <Image
                        source={{ uri: getImageUrl(item.image_url) }}
                        style={styles.orderItemImage}
                      />
                      <View style={styles.orderItemDetails}>
                        <Text style={styles.orderItemTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.orderItemRestaurant}>{item.restaurant_name}</Text>
                        <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
                      </View>
                      <Text style={styles.orderItemPrice}>${item.total.toFixed(2)}</Text>
                    </View>
                  ))}

                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>Total: ${order.total_amount.toFixed(2)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={64} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Orders Yet</Text>
                <Text style={styles.emptyText}>Your order history will appear here</Text>
              </View>
            )}
          </>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
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
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cartImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.sm,
  },
  cartDetails: {
    flex: 1,
  },
  cartTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginBottom: 4,
  },
  cartQuantity: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  cartPrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  removeButton: {
    padding: Spacing.sm,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
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
  summaryTotal: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  checkoutButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  checkoutButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderNumber: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  orderDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.lightGray,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.sm,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  orderItemRestaurant: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  orderItemQuantity: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  orderItemPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.full,
  },
  browseButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  loginButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.full,
  },
  loginButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});
