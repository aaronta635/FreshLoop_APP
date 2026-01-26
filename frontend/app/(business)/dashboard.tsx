import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { Product, productsApi, API_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

type TabType = 'home' | 'analysis' | 'add' | 'live' | 'profile';

function formatCountdown(readyTime: string): string {
  const ready = new Date(readyTime);
  const now = new Date();
  const diffMs = ready.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Now';
  
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

function getImageUrl(product: Product): string {
  const imageUrl = product.product_images?.[0]?.product_image;
  if (!imageUrl) {
    return 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?w=400';
  }
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
}

export default function MerchantDashboardScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch products when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchMyProducts();
      }
    }, [isAuthenticated])
  );

  const fetchMyProducts = async () => {
    try {
      const products = await productsApi.getMyProducts();
      setMyProducts(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      
      // Check if vendor profile needs to be created
      if (error.message && error.message.includes('Complete your registration by creating your vendor account')) {
        // Redirect to setup screen to complete vendor profile
        // Pass a param to indicate this is profile completion, not new registration
        Alert.alert(
          'Complete Your Profile',
          'You need to complete your vendor profile before you can manage products.',
          [
            {
              text: 'Go to Setup',
              onPress: () => router.replace({
                pathname: '/(business)/setup' as any,
                params: { completeProfile: 'true' }
              }),
            },
          ]
        );
        return;
      }
      
      // If other error, just show empty
      setMyProducts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMyProducts();
  };

  const handleDeleteDeal = async (productId: number) => {
    Alert.alert(
      'Delete Deal',
      'Are you sure you want to delete this deal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // products use string ids; keep as string
              await productsApi.getProduct(productId); // quick existence check
              // Ideally a delete endpoint; use vendor flow when added
              // For now, no delete support in backend products for unauth vendor-less
              Alert.alert('Delete not supported in demo');
              fetchMyProducts();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete deal');
            }
          },
        },
      ]
    );
  };

  // Get active and inactive products
  const activeproducts = myProducts.filter(d => d.product_status && d.stock > 0);
  const inactiveproducts = myProducts.filter(d => !d.product_status || d.stock <= 0);

  const renderHome = () => (
    <ScrollView 
      style={styles.tabContent} 
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
      {/* Shop Info */}
      <View style={styles.shopInfo}>
        <View style={styles.shopAvatar}>
          <Text style={styles.shopAvatarText}>{user?.first_name?.charAt(0) || 'S'}</Text>
        </View>
        <View style={styles.shopDetails}>
          <Text style={styles.shopName}>{user?.first_name || 'Shop Name'}</Text>
          <Text style={styles.shopAddress}>{user?.email || 'shop@email.com'}</Text>
        </View>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1728376334750-27b1e9280aad?w=800' }}
          style={styles.heroBannerImage}
        />
        <View style={styles.heroBannerOverlay} />
        <View style={styles.heroBannerContent}>
          <Text style={styles.heroBannerTitle}>MANAGE</Text>
          <Text style={styles.heroBannerTitle}>
            YOUR <Text style={styles.heroBannerAccent}>products</Text>
          </Text>
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 12, color: Colors.textSecondary }}>Loading your products...</Text>
        </View>
      )}

      {/* Active products */}
      {!isLoading && activeproducts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active products ({activeproducts.length})</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsRow}
          >
            {activeproducts.map((product) => (
              <View key={product.id} style={styles.dealCardSmall}>
                <View style={styles.dealImageContainer}>
                  <Image source={{ uri: getImageUrl(product) }} style={styles.dealImage} />
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingBadgeText}>{product.stock} left</Text>
                  </View>
                </View>
                <View style={styles.dealContent}>
                  <Text style={styles.dealCategory}>{product.vendor?.username || 'Shop'}</Text>
                  <Text style={styles.dealTitle} numberOfLines={2}>{product.product_name}</Text>
                  <View style={styles.dealFooter}>
                    <Text style={styles.dealPrice}>${(product.price / 100).toFixed(2)}</Text>
                    <View style={styles.countdownBadge}>
                      <Ionicons name="time" size={10} color={Colors.secondary} />
                      <Text style={styles.countdownText}>{product.stock} in stock</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Empty State */}
      {!isLoading && myProducts.length === 0 && (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <Ionicons name="storefront-outline" size={64} color={Colors.textSecondary} />
          <Text style={{ marginTop: 12, fontSize: 18, fontWeight: '600', color: Colors.primary }}>
            No Products Yet
          </Text>
          <Text style={{ marginTop: 8, color: Colors.textSecondary, textAlign: 'center' }}>
            Create your first product to start{'\n'}selling surplus food
          </Text>
          <TouchableOpacity 
            style={{ marginTop: 16, backgroundColor: Colors.accent, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24 }}
            onPress={() => router.push('/(business)/create-deal' as any)}
          >
            <Text style={{ color: Colors.white, fontWeight: '600' }}>Create Product</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stats Summary */}
      {!isLoading && myProducts.length > 0 && (
        <View style={[styles.section, { paddingBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>

            <TouchableOpacity 
              style={{
                backgroundColor: Colors.primary,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 14,
                paddingHorizontal: 20,
                borderRadius: BorderRadius.full,
                marginTop: Spacing.md,
              }}
              onPress={() => router.push('/(business)/products-orders' as any)}
            >
              <Ionicons name="list" size={20} color={Colors.white} />
              <Text style={{ color: Colors.white, fontWeight: '600' }}>View All Orders</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredGrid}>
            <View style={[styles.featuredCard, { padding: 16 }]}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.primary }}>{activeproducts.length}</Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>Active Products</Text>
            </View>
            <View style={[styles.featuredCard, { padding: 16 }]}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.accent }}>
                {activeproducts.reduce((sum, p) => sum + p.stock, 0)}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginTop: 4 }}>Items Available</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderAnalysis = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}>
      <Text style={styles.pageTitle}>Analytics</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Revenue</Text>
          <Text style={styles.statValue}>$5,234</Text>
          <Text style={styles.statTrend}>↑ 12% vs last week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Items Saved</Text>
          <Text style={styles.statValue}>487</Text>
          <Text style={styles.statTrend}>↑ 8% vs last week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Waste Reduced</Text>
          <Text style={styles.statValue}>1,200kg</Text>
          <Text style={[styles.statTrend, { color: Colors.accent }]}>3,600kg CO₂</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Rating</Text>
          <Text style={styles.statValue}>4.8</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={12} color={Colors.star} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Last 7 Days</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>Chart visualization here</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderAddLoop = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}>
      <Text style={styles.pageTitle}>Add Loop</Text>

      <View style={styles.tabToggle}>
        <TouchableOpacity style={[styles.tabToggleBtn, styles.tabToggleBtnActive]}>
          <Text style={styles.tabToggleTextActive}>Create from Template</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabToggleBtn}>
          <Text style={styles.tabToggleText}>Create New</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.templateLibraryCard}
        onPress={() => router.push('/(business)/templates' as any)}
      >
        <Text style={styles.templateLibraryTitle}>📋 Template Library</Text>
        <Text style={styles.templateLibrarySubtitle}>Use pre-saved products to publish faster</Text>
      </TouchableOpacity>

      <View style={styles.createNewCard}>
        <Text style={styles.createNewTitle}>Or Create New Deal</Text>
        <Text style={styles.createNewSubtitle}>Start from scratch with a blank form</Text>
        <TouchableOpacity 
          style={styles.createNewButton}
          onPress={() => router.push('/(business)/create-deal' as any)}
        >
          <Text style={styles.createNewButtonText}>Start New Deal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderLiveproducts = () => (
    <ScrollView 
      style={styles.tabContent} 
      contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }
    >
      <Text style={styles.pageTitle}>My products</Text>

      <View style={styles.filterTabs}>
        <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
          <Text style={styles.filterTabTextActive}>Active ({activeproducts.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterTabText}>Ended ({inactiveproducts.length})</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : myProducts.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <Ionicons name="pricetag-outline" size={64} color={Colors.textSecondary} />
          <Text style={{ marginTop: 12, fontSize: 16, color: Colors.textSecondary }}>No products yet</Text>
          <TouchableOpacity 
            style={{ marginTop: 16, backgroundColor: Colors.accent, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24 }}
            onPress={() => router.push('/(business)/create-deal' as any)}
          >
            <Text style={{ color: Colors.white, fontWeight: '600' }}>Create Your First Product</Text>
          </TouchableOpacity>
        </View>
      ) : (
        myProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.liveDealCard}
            onPress={() => router.push({
              pathname: '/(business)/products-orders' as any,
              params: {
                productId: product.id.toString(),
                productName: product.product_name
              }
            })}
          >
            <Image source={{ uri: getImageUrl(product) }} style={styles.liveDealImage} />
            <View style={styles.liveDealContent}>
              <View style={styles.liveDealHeader}>
                <View style={styles.liveDealInfo}>
                  <Text style={styles.liveDealCategory}>{product.vendor?.username || 'Shop'}</Text>
                  <Text style={styles.liveDealTitle} numberOfLines={1}>{product.product_name}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteDeal(product.id)}>
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
              <View style={styles.liveDealFooter}>
                <Text style={styles.liveDealPrice}>${(product.price / 100).toFixed(2)}</Text>
                <View style={styles.liveDealTime}>
                  <Ionicons name="cube-outline" size={12} color={Colors.primary} />
                  <Text style={styles.liveDealTimeText}>{product.stock} available</Text>
                </View>
              </View>
              <View style={styles.liveproductstatus}>
                {product.product_status && product.stock > 0 ? (
                  <View style={styles.liveTag}>
                    <Text style={styles.liveTagText}>🟢 ACTIVE</Text>
                  </View>
                ) : (
                  <View style={[styles.liveTag, { backgroundColor: Colors.lightGray }]}>
                    <Text style={[styles.liveTagText, { color: Colors.textSecondary }]}>⏸ ENDED</Text>
                  </View>
                )}
                <Text style={styles.soldToday}>{product.stock} in stock</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>🍃</Text>
        </View>
        <Text style={styles.profileName}>Harbor Kitchen</Text>
        <Text style={styles.profileAddress}>123 Anywhere St., Any City</Text>
      </View>

      <View style={styles.profileMenuList}>
        <TouchableOpacity style={styles.profileMenuItem}>
          <Text style={styles.profileMenuText}>Business Info</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileMenuItem}>
          <Text style={styles.profileMenuText}>Banking Details</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileMenuItem}>
          <Text style={styles.profileMenuText}>Staff Management</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileMenuItem}>
          <Text style={styles.profileMenuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.profileMenuItem}
          onPress={async () => {
            router.replace('/' as any);
            await logout();
          }}
        >
          <Text style={[styles.profileMenuText, { color: Colors.error }]}>Log Out</Text>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'analysis' && renderAnalysis()}
      {activeTab === 'add' && renderAddLoop()}
      {activeTab === 'live' && renderLiveproducts()}
      {activeTab === 'profile' && renderProfile()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons
            name="home"
            size={24}
            color={activeTab === 'home' ? Colors.secondary : 'rgba(255,255,255,0.6)'}
          />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('analysis')}
        >
          <Ionicons
            name="bar-chart"
            size={24}
            color={activeTab === 'analysis' ? Colors.secondary : 'rgba(255,255,255,0.6)'}
          />
          <Text style={[styles.navLabel, activeTab === 'analysis' && styles.navLabelActive]}>
            Analysis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('add')}
        >
          <Ionicons
            name="add-circle"
            size={24}
            color={activeTab === 'add' ? Colors.secondary : 'rgba(255,255,255,0.6)'}
          />
          <Text style={[styles.navLabel, activeTab === 'add' && styles.navLabelActive]}>
            Add Loop
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('live')}
        >
          <Ionicons
            name="radio"
            size={24}
            color={activeTab === 'live' ? Colors.secondary : 'rgba(255,255,255,0.6)'}
          />
          <Text style={[styles.navLabel, activeTab === 'live' && styles.navLabelActive]}>
            Live products
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons
            name="person"
            size={24}
            color={activeTab === 'profile' ? Colors.secondary : 'rgba(255,255,255,0.6)'}
          />
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>
            Profile
          </Text>
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
  tabContent: {
    flex: 1,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 56,
    paddingBottom: Spacing.md,
    gap: 12,
  },
  shopAvatar: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopAvatarText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  shopDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  shopAddress: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  heroBanner: {
    marginHorizontal: Spacing.lg,
    height: 160,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroBannerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  heroBannerTitle: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  heroBannerAccent: {
    color: Colors.accent,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  productsRow: {
    gap: 12,
    paddingRight: Spacing.lg,
  },
  dealCardSmall: {
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  dealImageContainer: {
    height: 128,
    position: 'relative',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  thumbsUpBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.accent,
    padding: 6,
    borderRadius: BorderRadius.full,
  },
  dealContent: {
    backgroundColor: Colors.primary,
    padding: 12,
  },
  dealCategory: {
    fontSize: 9,
    fontWeight: FontWeight.semiBold,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dealTitle: {
    fontSize: 13,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: 8,
    lineHeight: 17,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countdownText: {
    fontSize: 10,
    fontWeight: FontWeight.semiBold,
    color: Colors.secondary,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featuredCard: {
    width: (width - Spacing.lg * 2 - 12) / 2,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  pageTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.lg,
    marginTop: 48,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: 20,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  statTrend: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.secondary,
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  chartTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  chartPlaceholder: {
    height: 192,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tabToggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  tabToggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabToggleText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  tabToggleTextActive: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
  },
  templateLibraryCard: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  templateLibraryTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  templateLibrarySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    opacity: 0.8,
  },
  createNewCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  createNewTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  createNewSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  createNewButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  createNewButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  filterTabTextActive: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
  },
  liveDealCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: 12,
  },
  liveDealImage: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.md,
  },
  liveDealContent: {
    flex: 1,
  },
  liveDealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  liveDealInfo: {
    flex: 1,
  },
  liveDealCategory: {
    fontSize: 10,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  liveDealTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  liveDealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDealPrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  liveDealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(217, 224, 33, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  liveDealTimeText: {
    fontSize: 11,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  liveproductstatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveTag: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  liveTagText: {
    fontSize: 11,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  soldToday: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: Spacing.xl,
  },
  profileAvatar: {
    width: 96,
    height: 96,
    backgroundColor: Colors.primary,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  profileAvatarText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  profileAddress: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  profileMenuList: {
    gap: 12,
  },
  profileMenuItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileMenuText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  navLabelActive: {
    color: Colors.secondary,
    fontWeight: FontWeight.semiBold,
  },
});
