import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';

export default function DealDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock deal data
  const deal = {
    id: id as string,
    restaurant: 'Fresh Bites Cafe',
    item: 'Classic Grilled Ribeye',
    category: 'Food',
    rating: 4.0,
    price: 10.9,
    originalPrice: 25.0,
    discount: 56,
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=800',
    description:
      'Perfectly grilled ribeye steak with roasted vegetables and garlic butter. A premium cut that would normally cost $25, now available at a great discount!',
    pickupTime: '2:30 PM - 3:00 PM',
    location: '123 Crown Street, Wollongong',
    itemsLeft: 3,
  };

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: deal.image }} style={styles.image} />
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        {/* Discount Badge */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{deal.discount}% OFF</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Restaurant Name */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="storefront" size={20} color={Colors.primary} />
            <Text style={styles.restaurantName}>{deal.restaurant}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={Colors.star} />
            <Text style={styles.ratingText}>{deal.rating}</Text>
          </View>
        </View>

        {/* Item Name & Category */}
        <Text style={styles.itemName}>{deal.item}</Text>
        <Text style={styles.category}>{deal.category}</Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${deal.price}</Text>
          <Text style={styles.originalPrice}>${deal.originalPrice}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{deal.description}</Text>
        </View>

        {/* Pickup Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Time</Text>
              <Text style={styles.detailValue}>{deal.pickupTime}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{deal.location}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="fast-food-outline" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Items Left</Text>
              <Text style={[styles.detailValue, styles.itemsLeftText]}>
                Only {deal.itemsLeft} left!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Reserve Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.reserveButton}>
          <Text style={styles.reserveButtonText}>Reserve Now</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
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
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: Spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BorderRadius.full,
    padding: 8,
  },
  discountBadge: {
    position: 'absolute',
    top: 48,
    right: Spacing.lg,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  discountText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  restaurantName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  ratingText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  itemName: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  category: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  price: {
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  originalPrice: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  itemsLeftText: {
    color: Colors.accent,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  reserveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  reserveButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});

