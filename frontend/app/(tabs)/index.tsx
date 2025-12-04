import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface Deal {
  id: string;
  restaurant: string;
  category: string;
  rating: number;
  price: number;
  image: string;
}

const DEALS: Deal[] = [
  {
    id: '1',
    restaurant: 'Strawberry Bliss Pancake',
    category: 'Snacks',
    rating: 4.0,
    price: 2.8,
    image: 'https://images.unsplash.com/photo-1683771419434-e59b7f6c39d6?w=400',
  },
  {
    id: '2',
    restaurant: 'Classic Grilled Ribeye',
    category: 'Food',
    rating: 4.0,
    price: 10.9,
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=400',
  },
  {
    id: '3',
    restaurant: 'Garlic Butter Roast Chicken',
    category: 'Food',
    rating: 4.0,
    price: 12.8,
    image: 'https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?w=400',
  },
  {
    id: '4',
    restaurant: 'Healthy Premium Steak',
    category: 'Food',
    rating: 4.0,
    price: 2.8,
    image: 'https://images.unsplash.com/photo-1645292821217-fb77e7fa7269?w=400',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (dealId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dealId)) {
      newFavorites.delete(dealId);
    } else {
      newFavorites.add(dealId);
    }
    setFavorites(newFavorites);
  };

  const handleViewDeal = (dealId: string) => {
    // Navigate to deal details
    router.push(`/(customer)/deal-details?id=${dealId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Location & Search */}
      <View style={styles.header}>
        {/* Location */}
        <TouchableOpacity style={styles.locationButton}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={16} color={Colors.primary} />
          </View>
          <View style={styles.locationText}>
            <Text style={styles.locationLabel}>Location</Text>
            <Text style={styles.locationAddress}>123 Anywhere St., Any City</Text>
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/search')}
        >
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.searchPlaceholder}>Think your favourite food...</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=800' }}
            style={styles.promoImage}
            resizeMode="cover"
          />
          <View style={styles.promoOverlay} />
          <View style={styles.promoContent}>
            <Text style={styles.promoText}>20% PROMO{'\n'}CASHBACK</Text>
          </View>
        </View>

        {/* Category Icons */}
        <View style={styles.categorySection}>
          <View style={styles.categoryGrid}>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIconContainer}>
                <Ionicons name="restaurant" size={32} color={Colors.white} />
              </View>
              <Text style={styles.categoryLabel}>Food</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIconContainer}>
                <Ionicons name="cafe" size={32} color={Colors.white} />
              </View>
              <Text style={styles.categoryLabel}>Beverage</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIconContainer}>
                <Ionicons name="pricetag" size={32} color={Colors.white} />
              </View>
              <Text style={styles.categoryLabel}>Sale</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIconContainer}>
                <Ionicons name="grid" size={32} color={Colors.white} />
              </View>
              <Text style={styles.categoryLabel}>Others</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Food Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Premium Food</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.primary} />
          </View>

          <View style={styles.dealsGrid}>
            {DEALS.slice(0, 2).map((deal) => (
              <TouchableOpacity
                key={deal.id}
                style={styles.dealCard}
                onPress={() => handleViewDeal(deal.id)}
                activeOpacity={0.9}
              >
                <View style={styles.dealImageContainer}>
                  <Image source={{ uri: deal.image }} style={styles.dealImage} />
                  
                  {/* Rating Badge */}
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={Colors.star} />
                    <Text style={styles.ratingText}>{deal.rating}</Text>
                  </View>
                  
                  {/* Add Button */}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(deal.id);
                    }}
                  >
                    <Ionicons
                      name={favorites.has(deal.id) ? 'heart' : 'add'}
                      size={20}
                      color={favorites.has(deal.id) ? Colors.error : Colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.dealInfo}>
                  <Text style={styles.dealCategory}>{deal.category}</Text>
                  <Text style={styles.dealName} numberOfLines={2}>
                    {deal.restaurant}
                  </Text>
                  <Text style={styles.dealPrice}>${deal.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.primary} />
          </View>

          <View style={styles.dealsGrid}>
            {DEALS.slice(2, 4).map((deal) => (
              <TouchableOpacity
                key={deal.id}
                style={styles.dealCard}
                onPress={() => handleViewDeal(deal.id)}
                activeOpacity={0.9}
              >
                <View style={styles.dealImageContainer}>
                  <Image source={{ uri: deal.image }} style={styles.dealImage} />
                  
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={Colors.star} />
                    <Text style={styles.ratingText}>{deal.rating}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(deal.id);
                    }}
                  >
                    <Ionicons
                      name={favorites.has(deal.id) ? 'heart' : 'add'}
                      size={20}
                      color={favorites.has(deal.id) ? Colors.error : Colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.dealInfo}>
                  <Text style={styles.dealCategory}>{deal.category}</Text>
                  <Text style={styles.dealName} numberOfLines={2}>
                    {deal.restaurant}
                  </Text>
                  <Text style={styles.dealPrice}>${deal.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  locationIcon: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    fontSize: FontSize.xs,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  locationAddress: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.6)',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  promoBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: -24,
    height: 176,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  promoContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoText: {
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  categorySection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryIconContainer: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    aspectRatio: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  dealsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dealCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    padding: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dealInfo: {
    padding: Spacing.md,
  },
  dealCategory: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dealName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  dealPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});

