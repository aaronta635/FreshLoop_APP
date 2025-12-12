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
import { dealsApi, Deal, API_BASE_URL } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function DealDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchDeal(id as string);
    }
  }, [id]);

  const fetchDeal = async (dealId: string) => {
    try {
      setIsLoading(true);
      const fetchedDeals = await dealsApi.getDeals();
      const foundDeal = fetchedDeals.find(d => d.id === dealId);
      
      if (foundDeal) {
        setDeal(foundDeal);
      } else {
        // Use mock data if deal not found
        setDeal({
          id: dealId,
          title: 'Classic Grilled Ribeye',
          restaurant_name: 'Fresh Bites Cafe',
          description: 'Perfectly grilled ribeye steak with roasted vegetables and garlic butter. A premium cut that would normally cost $25, now available at a great discount!',
          price: 10.9,
          quantity: 3,
          pickup_address: '123 Crown Street, Wollongong',
          image_url: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=800',
          is_active: true,
          ready_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: null,
        });
      }
    } catch (error) {
      console.error('Error fetching deal:', error);
      // Use mock data on error
      setDeal({
        id: dealId,
        title: 'Classic Grilled Ribeye',
        restaurant_name: 'Fresh Bites Cafe',
        description: 'Perfectly grilled ribeye steak with roasted vegetables and garlic butter.',
        price: 10.9,
        quantity: 3,
        pickup_address: '123 Crown Street, Wollongong',
        image_url: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=800',
        is_active: true,
        ready_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (): string => {
    if (!deal?.image_url) {
      return 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=800';
    }
    if (deal.image_url.startsWith('http')) {
      return deal.image_url;
    }
    return `${API_BASE_URL.replace('/api', '')}${deal.image_url}`;
  };

  const formatPickupTime = (): string => {
    if (!deal?.ready_time) return 'Today';
    
    const readyTime = new Date(deal.ready_time);
    const now = new Date();
    
    // If ready time is in the past, show "Available now"
    if (readyTime <= now) {
      return 'Available now';
    }
    
    // Format the pickup window
    const hours = readyTime.getHours();
    const minutes = readyTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes} ${ampm} - ${formattedHours}:30 ${ampm}`;
  };

  const handleAddToCart = async () => {
    if (!deal) return;

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

    if (quantity > deal.quantity) {
      Alert.alert('Error', `Only ${deal.quantity} items available`);
      return;
    }

    try {
      await addToCart(deal.id, quantity);
      Alert.alert(
        'Added to Cart',
        `${quantity}x ${deal.title} added to your cart!`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { 
            text: 'View Cart', 
            onPress: () => router.push('/(tabs)/orders')
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add to cart');
    }
  };

  const incrementQuantity = () => {
    if (deal && quantity < deal.quantity) {
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
        <Text style={styles.loadingText}>Loading deal...</Text>
      </View>
    );
  }

  if (!deal) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.loadingText}>Deal not found</Text>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const discount = Math.round(((deal.price * 2.5 - deal.price) / (deal.price * 2.5)) * 100);

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
        {/* Restaurant Name */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="storefront" size={20} color={Colors.primary} />
            <Text style={styles.restaurantName}>{deal.restaurant_name}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={Colors.star} />
            <Text style={styles.ratingText}>4.0</Text>
          </View>
        </View>

        {/* Item Name */}
        <Text style={styles.itemName}>{deal.title}</Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${(deal.price / 100).toFixed(2)}</Text>
          <Text style={styles.originalPrice}>${(deal.price / 100 * 2.5).toFixed(2)}</Text>
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
              <Text style={styles.detailValue}>{formatPickupTime()}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{deal.pickup_address}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="fast-food-outline" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Items Left</Text>
              <Text style={[styles.detailValue, styles.itemsLeftText]}>
                Only {deal.quantity} left!
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
              style={[styles.quantityButton, quantity >= deal.quantity && styles.quantityButtonDisabled]}
              onPress={incrementQuantity}
              disabled={quantity >= deal.quantity}
            >
              <Ionicons name="add" size={24} color={quantity >= deal.quantity ? Colors.textSecondary : Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Reserve Button */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Total</Text>
          <Text style={styles.footerPriceValue}>${(deal.price / 100 * quantity).toFixed(2)}</Text>
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
