import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { productsApi, Product, API_BASE_URL } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function DealDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct(id as string);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const foundProduct = await productsApi.getProduct(parseInt(productId));
      console.log('Fetched product:', JSON.stringify(foundProduct, null, 2));
      setProduct(foundProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (): string => {
    if (!product?.product_images || product.product_images.length === 0) {
      return 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=800';
    }
    const imageUrl = product.product_images[0].product_image;
    if (!imageUrl) {
      return 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=800';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
  };

  const getPickupTime = (): string => {
    if (product?.pickup_time) {
      return product.pickup_time;
    }
    return 'Contact vendor for pickup time';
  };

  const getPickupAddress = (): string => {
    if (product?.vendor) {
      return `${product.vendor.address}, ${product.vendor.state}, ${product.vendor.country}`;
    }
    return 'Contact vendor for pickup location';
  };

  const getVendorName = (): string => {
    if (product?.vendor) {
      return product.vendor.username;
    }
    return product?.category?.category_name || 'Vendor';
  };

  const getAverageRating = (): string => {
    if (product?.reviews && product.reviews.length > 0) {
      const avg = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
      return avg.toFixed(1);
    }
    return '4.0';
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to add items to your cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => router.push('/(onboarding)/login')
          },
        ]
      );
      return;
    }

    if (quantity > product.stock) {
      Alert.alert('Error', `Only ${product.stock} items available`);
      return;
    }

    try {
      await addToCart(product.id, quantity);
      Alert.alert(
        'Added to Cart',
        `${quantity}x ${product.product_name} added to your cart!`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { 
            text: 'View Cart', 
            onPress: () => router.push('/(tabs)/cart')
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add to cart');
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.loadingText}>Product not found</Text>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const discount = Math.round(((product.price * 2.5 - product.price) / (product.price * 2.5)) * 100);

  return (
    <View style={styles.container}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: getImageUrl() }} style={styles.image} />
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        {/* Discount Badge */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}% OFF</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Vendor Name */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="storefront" size={20} color={Colors.primary} />
            <Text style={styles.restaurantName}>{getVendorName()}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={Colors.star} />
            <Text style={styles.ratingText}>{getAverageRating()}</Text>
          </View>
        </View>

        {/* Product Name */}
        <Text style={styles.itemName}>{product.product_name}</Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${(product.price / 100).toFixed(2)}</Text>
          <Text style={styles.originalPrice}>${(product.price / 100 * 2.5).toFixed(2)}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.long_description || product.short_description}</Text>
        </View>

        {/* Pickup Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Time</Text>
              <Text style={styles.detailValue}>{getPickupTime()}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{getPickupAddress()}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="fast-food-outline" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Items Left</Text>
              <Text style={[styles.detailValue, styles.itemsLeftText]}>
                Only {product.stock} left!
              </Text>
            </View>
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity 
              style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
              onPress={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Ionicons name="remove" size={24} color={quantity <= 1 ? Colors.textSecondary : Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity 
              style={[styles.quantityButton, quantity >= product.stock && styles.quantityButtonDisabled]}
              onPress={incrementQuantity}
              disabled={quantity >= product.stock}
            >
              <Ionicons name="add" size={24} color={quantity >= product.stock ? Colors.textSecondary : Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Reserve Button */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Total</Text>
          <Text style={styles.footerPriceValue}>${(product.price / 100 * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.reserveButton, isCartLoading && styles.reserveButtonDisabled]} 
          onPress={handleAddToCart}
          disabled={isCartLoading}
        >
          {isCartLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.reserveButtonText}>Add to Cart</Text>
              <Ionicons name="cart" size={20} color={Colors.white} />
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  backLink: {
    marginTop: Spacing.lg,
  },
  backLinkText: {
    fontSize: FontSize.md,
    color: Colors.accent,
    fontWeight: FontWeight.semiBold,
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
    paddingBottom: 120,
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
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  quantityButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    padding: Spacing.md,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    minWidth: 40,
    textAlign: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  footerPrice: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  footerPriceValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  reserveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  reserveButtonDisabled: {
    opacity: 0.7,
  },
  reserveButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});
