import React, { useState, useEffect, useCallback, use } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';

import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { ordersApi, VendorOrderItem } from '../../services/api';

export default function ProductOrdersScreen() {
  const router = useRouter();
  const { productId, productName } = useLocalSearchParams<{ 
    productId?: string; 
    productName?: string;
  }>();

  const [orders, setOrders] = useState<VendorOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);


  const fetchOrders = async () => {
    try {
        const allOrders = await ordersApi.getVendorOrders();

        if (productId) {
            const filtered = allOrders.filter(
                (order) => order.product_id === parseInt(productId)
            );
            setOrders(filtered);
        } else {
            setOrders(allOrders);
        }
    } catch (error: any) {
        console.log('Error: ', error);
        setOrders([]);
    } finally {
        setIsLoading(false);
        setIsRefreshing(false);
    }
  } 

  useFocusEffect(
    useCallback(() => {
        fetchOrders();
    }, [productId])
  );


  const handleMarkAsPickedUp = async (orderItem: VendorOrderItem) => {
    Alert.alert(
        'Confirm Pickup',
        `Mark order ${orderItem.order.pickup_code} as picked up?`,
        [
            {text: 'Cancel', style: 'cancel'},
            {
                text: 'Confirm',
                onPress: async () => {
                    try {
                        setUpdatingId(orderItem.id);
                        await ordersApi.updateOrderStatus(orderItem.id, 'shipped');

                        setOrders((prev) => 
                            prev.map((o) => 
                                o.id === orderItem.id ? { ... o, status: 'shipped'}: o
                            )
                        );
                        Alert.alert('Success', 'Order marked as picked up!');
                    } catch (error: any) {
                        Alert.alert('Error', error.message || 'Failed to update order');
                    } finally {
                        setUpdatingId(null);
                    }
                }
            }
        ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return Colors.accent;
      case 'shipped':
        return Colors.secondary;
      case 'refunded':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Awaiting Pickup';
      case 'shipped':
        return 'Picked Up';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };


  const renderOrderItem = ({ item }: { item: VendorOrderItem }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.pickupCodeContainer}>
          <Ionicons name="ticket-outline" size={20} color={Colors.primary} />
          <Text style={styles.pickupCode}>{item.order.pickup_code}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={styles.detailValue}>{item.quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.detailValue}>${(item.price / 100).toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total:</Text>
          <Text style={styles.detailValueBold}>
            ${((item.price * item.quantity) / 100).toFixed(2)}
          </Text>
        </View>
        {item.order.customer && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer:</Text>
            <Text style={styles.detailValue}>
              {item.order.customer.first_name} {item.order.customer.last_name}
            </Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Date:</Text>
          <Text style={styles.detailValue}>
            {item.order.order_date 
              ? new Date(item.order.order_date).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>
      </View>

      {item.status === 'processing' && (
        <TouchableOpacity
          style={styles.pickupButton}
          onPress={() => handleMarkAsPickedUp(item)}
          disabled={updatingId === item.id}
        >
          {updatingId === item.id ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              <Text style={styles.pickupButtonText}>Mark as Picked Up</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {item.status === 'shipped' && (
        <View style={styles.completedBanner}>
          <Ionicons name="checkmark-done" size={20} color={Colors.secondary} />
          <Text style={styles.completedText}>Order Completed</Text>
        </View>
      )}
    </View>
  );

  // Separate orders by status
  const pendingOrders = orders.filter((o) => o.status === 'processing');
  const completedOrders = orders.filter((o) => o.status !== 'processing');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {productName ? productName : 'All Orders'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {pendingOrders.length} pending · {completedOrders.length} completed
          </Text>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>
            Orders for this product will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                fetchOrders();
              }}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
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
    paddingTop: 56,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  pickupCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickupCode: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  orderDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  detailValueBold: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  pickupButton: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
  },
  pickupButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(217, 224, 33, 0.2)',
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  completedText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
});
