import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { ordersApi, Order, API_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

type OrderFilterType = 'all' | 'active' | 'completed';

const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
};

export default function OrdersScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderFilter, setOrderFilter] = useState<OrderFilterType>('all');

  // Fetch orders when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchOrders();
      }
    }, [isAuthenticated])
  );

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const fetchedOrders = await ordersApi.getAllOrders();
      setOrders(fetchedOrders);
    } catch (error: any) {
      console.error('fetchOrders: Error:', error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  // Filter orders based on selection
  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'active') {
      return order.status === 'processing' || order.status === 'pending';
    }
    if (orderFilter === 'completed') {
      return order.status === 'shipped' || order.status === 'refunded';
    }
    return true;
  });

  // Sort: active orders first, then completed
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aIsActive = a.status === 'processing' || a.status === 'pending';
    const bIsActive = b.status === 'processing' || b.status === 'pending';
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;
    return 0;
  });

  // Count for filter badges
  const activeCount = orders.filter(o => o.status === 'processing' || o.status === 'pending').length;
  const completedCount = orders.filter(o => o.status === 'shipped' || o.status === 'refunded').length;

  const isOrderCompleted = (status: string) => status === 'shipped' || status === 'refunded';

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return 'Awaiting Pickup';
      case 'pending': return 'Pending';
      case 'shipped': return '✓ Picked Up';
      case 'refunded': return 'Refunded';
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'processing': return styles.statusProcessing;
      case 'pending': return styles.statusPending;
      case 'shipped': return styles.statusShipped;
      case 'refunded': return styles.statusRefunded;
      default: return {};
    }
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
          <Text style={styles.emptyText}>Please login to view your orders</Text>
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

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, orderFilter === 'all' && styles.filterChipActive]}
          onPress={() => setOrderFilter('all')}
        >
          <Text style={[styles.filterChipText, orderFilter === 'all' && styles.filterChipTextActive]}>
            All ({orders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, orderFilter === 'active' && styles.filterChipActive]}
          onPress={() => setOrderFilter('active')}
        >
          <Text style={[styles.filterChipText, orderFilter === 'active' && styles.filterChipTextActive]}>
            Active ({activeCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, orderFilter === 'completed' && styles.filterChipActive]}
          onPress={() => setOrderFilter('completed')}
        >
          <Text style={[styles.filterChipText, orderFilter === 'completed' && styles.filterChipTextActive]}>
            Completed ({completedCount})
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : sortedOrders.length > 0 ? (
          sortedOrders.map((order) => {
            const completed = isOrderCompleted(order.status);
            return (
              <View 
                key={order.id} 
                style={[
                  styles.orderCard,
                  completed && styles.orderCardCompleted
                ]}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={[styles.orderNumber, completed && styles.textMuted]}>
                      Order #{order.customer_order_number || order.id}
                    </Text>
                    <Text style={styles.orderDate}>
                      {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}
                    </Text>
                    {order.pickup_code && !completed && (
                      <View style={styles.pickupCodeContainer}>
                        <Ionicons name="ticket-outline" size={14} color={Colors.accent} />
                        <Text style={styles.pickupCode}>{order.pickup_code}</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                    <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
                  </View>
                </View>

                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item, index) => (
                    <View key={item.id || index} style={styles.orderItem}>
                      <View style={styles.orderItemImageContainer}>
                        <Image
                          source={{ uri: getImageUrl(item.product?.product_images?.[0]?.product_image) }}
                          style={[styles.orderItemImage, completed && styles.orderItemImageCompleted]}
                        />
                        {completed && (
                          <View style={styles.completedOverlay}>
                            <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
                          </View>
                        )}
                      </View>
                      <View style={styles.orderItemDetails}>
                        <Text style={[styles.orderItemTitle, completed && styles.textMuted]} numberOfLines={1}>
                          {item.product?.product_name || `Product #${item.product_id}`}
                        </Text>
                        <Text style={styles.orderItemVendor}>
                          📍 {item.vendor?.address || 'Pickup location TBD'}
                        </Text>
                        <Text style={styles.orderItemMeta}>
                          Qty: {item.quantity}
                        </Text>
                      </View>
                      <Text style={[styles.orderItemPrice, completed && styles.textMuted]}>
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noItemsText}>No items in this order</Text>
                )}

                <View style={styles.orderFooter}>
                  <Text style={[styles.orderTotal, completed && styles.textMuted]}>
                    Total: ${(order.total_amount / 100).toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name={orderFilter === 'completed' ? 'checkmark-done-outline' : 'receipt-outline'} 
              size={64} 
              color={Colors.textSecondary} 
            />
            <Text style={styles.emptyTitle}>
              {orderFilter === 'all' && 'No Orders Yet'}
              {orderFilter === 'active' && 'No Active Orders'}
              {orderFilter === 'completed' && 'No Completed Orders'}
            </Text>
            <Text style={styles.emptyText}>
              {orderFilter === 'all' && 'Your order history will appear here'}
              {orderFilter === 'active' && 'Orders awaiting pickup will appear here'}
              {orderFilter === 'completed' && 'Picked up orders will appear here'}
            </Text>
            {orderFilter === 'all' && (
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => router.push('/(tabs)')}
              >
                <Text style={styles.browseButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            )}
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingTop: 0,
    paddingBottom: 100,
  },
  loadingContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderCardCompleted: {
    opacity: 0.7,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
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
  orderInfo: {
    flex: 1,
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
  pickupCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  pickupCode: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.bold,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.lightGray,
  },
  statusProcessing: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusShipped: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  statusRefunded: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  orderItemImageContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
  },
  orderItemImageCompleted: {
    opacity: 0.6,
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(34, 197, 94, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  orderItemVendor: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  orderItemMeta: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  noItemsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: Spacing.md,
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
  textMuted: {
    opacity: 0.6,
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
