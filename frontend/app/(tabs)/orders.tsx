import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';

type TabType = 'active' | 'completed';

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  const mockOrders = [
    {
      id: '1',
      restaurant: 'Fresh Bites Cafe',
      item: 'Classic Grilled Ribeye',
      price: 10.9,
      pickupTime: '2:30 PM - 3:00 PM',
      status: 'Ready for Pickup',
      image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=400',
    },
  ];

  const completedOrders = [
    {
      id: '2',
      restaurant: 'Green Garden',
      item: 'Strawberry Bliss Pancake',
      price: 2.8,
      completedDate: 'Nov 25, 2024',
      image: 'https://images.unsplash.com/photo-1683771419434-e59b7f6c39d6?w=400',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.activeTabText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'active' ? (
          <>
            {mockOrders.length > 0 ? (
              mockOrders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Ionicons name="storefront" size={20} color={Colors.primary} />
                    <Text style={styles.restaurantName}>{order.restaurant}</Text>
                  </View>

                  <View style={styles.orderContent}>
                    <Image source={{ uri: order.image }} style={styles.orderImage} />
                    <View style={styles.orderDetails}>
                      <Text style={styles.orderItem}>{order.item}</Text>
                      <Text style={styles.orderPrice}>${order.price}</Text>
                      <View style={styles.pickupInfo}>
                        <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                        <Text style={styles.pickupTime}>{order.pickupTime}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>

                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="cart-outline" size={64} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Active Orders</Text>
                <Text style={styles.emptyText}>
                  Start browsing to find great deals!
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Ionicons name="storefront" size={20} color={Colors.primary} />
                    <Text style={styles.restaurantName}>{order.restaurant}</Text>
                  </View>

                  <View style={styles.orderContent}>
                    <Image source={{ uri: order.image }} style={styles.orderImage} />
                    <View style={styles.orderDetails}>
                      <Text style={styles.orderItem}>{order.item}</Text>
                      <Text style={styles.orderPrice}>${order.price}</Text>
                      <Text style={styles.completedDate}>
                        Completed on {order.completedDate}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.reorderButton}>
                    <Ionicons name="refresh" size={20} color={Colors.white} />
                    <Text style={styles.reorderButtonText}>Order Again</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={64} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Completed Orders</Text>
                <Text style={styles.emptyText}>
                  Your order history will appear here
                </Text>
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
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  restaurantName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  orderContent: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  orderItem: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginBottom: 4,
  },
  orderPrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
    marginBottom: 4,
  },
  pickupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pickupTime: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  completedDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  viewButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
  },
  reorderButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  reorderButtonText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
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
  },
});

