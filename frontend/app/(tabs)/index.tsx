import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { productsApi, Product, API_BASE_URL } from '../../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const fetchedProducts = await productsApi.getProducts();
      // Filter only active products with available stock
      const activeProducts = fetchedProducts.filter(product => product.product_status && product.stock > 0);
      setProducts(activeProducts);
    } catch (err: any) {
      console.error('Error fetching deals:', err);
      // Don't show error for "No Products" - it's just empty
      if (err.message?.includes('No Products')) {
        setProducts([]);
      } else {
        setError('Could not load deals. Pull to retry.');
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProducts();
  };

  const toggleFavorite = (productId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/(customer)/deal-details?id=${productId}`);
  };

  const getImageUrl = (product: Product): string => {
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images[0].product_image;
    }
    return 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=400';
  };

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.dealCard}
      onPress={() => handleViewProduct(product.id)}
      activeOpacity={0.9}
    >
      <View style={styles.dealImageContainer}>
        <Image 
          source={{ uri: getImageUrl(product) }} 
          style={styles.dealImage}
          defaultSource={{ uri: 'https://via.placeholder.com/160' }}
        />
        
        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={Colors.star} />
          <Text style={styles.ratingText}>
            {product.reviews && product.reviews.length > 0 
              ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
              : '4.0'}
          </Text>
        </View>
        
        {/* Stock Badge */}
        {product.stock <= 5 && (
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>{product.stock} left</Text>
          </View>
        )}
        
        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
        >
          <Ionicons
            name={favorites.has(product.id) ? 'heart' : 'add'}
            size={20}
            color={favorites.has(product.id) ? Colors.error : Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dealInfo}>
        <Text style={styles.dealRestaurant} numberOfLines={1}>
          {product.category?.category_name || 'Food'}
        </Text>
        <Text style={styles.dealName} numberOfLines={2}>
          {product.product_name}
        </Text>
        <Text style={styles.dealPrice}>${(product.price / 100).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading deals...</Text>
      </View>
    );
  }

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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
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
            <Text style={styles.promoText}>SAVE FOOD{'\n'}SAVE MONEY</Text>
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

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline" size={24} color={Colors.textSecondary} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRefresh}>
              <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Available Deals Section */}
        {products.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Now</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.primary} />
            </View>

            <View style={styles.dealsGrid}>
              {products.slice(0, 2).map(renderProductCard)}
            </View>
          </View>
        )}

        {/* More Deals Section */}
        {products.length > 2 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>More Deals</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.primary} />
            </View>

            <View style={styles.dealsGrid}>
              {products.slice(2, 4).map(renderProductCard)}
            </View>
          </View>
        )}

        {/* Show more deals if available */}
        {products.length > 4 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore</Text>
            </View>

            <View style={styles.dealsGrid}>
              {products.slice(4).map(renderProductCard)}
            </View>
          </View>
        )}

        {/* Empty State */}
        {products.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Ionicons name="fast-food-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Deals Available</Text>
            <Text style={styles.emptyText}>Check back later for new deals!</Text>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
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
    paddingBottom: 100,
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
  errorContainer: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  retryText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.semiBold,
    marginTop: Spacing.sm,
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
    flexWrap: 'wrap',
  },
  dealCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: Spacing.md,
  },
  dealImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
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
  quantityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
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
  dealRestaurant: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dealName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  dealPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: Spacing.lg,
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
