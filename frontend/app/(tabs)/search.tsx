import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { dealsApi, Deal, API_BASE_URL } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

const POPULAR_TAGS = ['Mystery Bag', 'Sushi', 'Pizza', 'Bakery', 'Salad', 'Coffee', 'Lunch', 'Dinner'];

const CATEGORIES = [
  { name: 'All', icon: 'grid', filter: '' },
  { name: 'Bakery', icon: 'pizza', filter: 'bakery' },
  { name: 'Asian', icon: 'restaurant', filter: 'sushi,noodle,curry' },
  { name: 'Fast Food', icon: 'fast-food', filter: 'pizza,burger,bbq' },
  { name: 'Healthy', icon: 'leaf', filter: 'salad,veggie,smoothie' },
  { name: 'Desserts', icon: 'ice-cream', filter: 'dessert,sweet' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Deal[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearching, setIsSearching] = useState(false);

  // Load products and recent searches on mount
  useEffect(() => {
    loadProducts();
    loadRecentSearches();
  }, []);

  // Filter products when search query or category changes
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const fetchedDeals = await dealsApi.getDeals();
      setProducts(fetchedDeals.filter(p => p.is_active && p.quantity > 0));
    } catch (error: any) {
      console.error('Error loading products:', error);
      // Don't show error for empty products
      if (!error.message?.includes('No Products')) {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.restaurant_name?.toLowerCase().includes(query) ||
        product.pickup_address?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      const category = CATEGORIES.find(c => c.name === selectedCategory);
      if (category && category.filter) {
        const keywords = category.filter.split(',');
        filtered = filtered.filter(product =>
          keywords.some(kw =>
            product.title?.toLowerCase().includes(kw) ||
            product.description?.toLowerCase().includes(kw) ||
            product.restaurant_name?.toLowerCase().includes(kw)
          )
        );
      }
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
    }
  };

  const handleTagPress = (tag: string) => {
    setSearchQuery(tag);
    setIsSearching(true);
    saveRecentSearch(tag);
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
  };

  const handleProductPress = (product: Deal) => {
    router.push({
      pathname: '/(customer)/deal-details',
      params: { id: product.id.toString() },
    });
  };

  const getImageUrl = (product: Deal): string => {
    if (product.image_url) {
      if (product.image_url.startsWith('http')) return product.image_url;
      return `${API_BASE_URL.replace('/api', '')}${product.image_url}`;
    }
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const renderSearchResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsCount}>
        {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
      </Text>
      
      {filteredProducts.length === 0 ? (
        <View style={styles.noResults}>
          <Ionicons name="search-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.noResultsTitle}>No products found</Text>
          <Text style={styles.noResultsText}>
            Try a different search term or browse categories
          </Text>
        </View>
      ) : (
        filteredProducts.map(product => (
          <TouchableOpacity
            key={product.id}
            style={styles.dealCard}
            onPress={() => handleProductPress(product)}
          >
            <Image
              source={{ uri: getImageUrl(product) }}
              style={styles.dealImage}
            />
            <View style={styles.dealInfo}>
              <Text style={styles.dealRestaurant}>{product.restaurant_name || 'Food'}</Text>
              <Text style={styles.dealTitle} numberOfLines={2}>{product.title}</Text>
              <View style={styles.dealMeta}>
                <Text style={styles.dealPrice}>{formatPrice(product.price)}</Text>
                <View style={styles.dealQuantity}>
                  <Ionicons name="cube-outline" size={14} color={Colors.textSecondary} />
                  <Text style={styles.dealQuantityText}>{product.quantity} left</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderExplore = () => (
    <>
      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryChip,
                selectedCategory === category.name && styles.categoryChipActive
              ]}
              onPress={() => {
                setSelectedCategory(category.name);
                if (category.name !== 'All') {
                  setIsSearching(true);
                }
              }}
            >
              <Ionicons
                name={category.icon as any}
                size={18}
                color={selectedCategory === category.name ? Colors.white : Colors.primary}
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.name && styles.categoryChipTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Searches */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Searches</Text>
        <View style={styles.tagContainer}>
          {POPULAR_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.tag}
              onPress={() => handleTagPress(tag)}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentList}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => handleRecentSearchPress(search)}
              >
                <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
                <Text style={styles.recentText}>{search}</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Featured Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {products.slice(0, 5).map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.featuredCard}
                onPress={() => handleProductPress(product)}
              >
                <Image
                  source={{ uri: getImageUrl(product) }}
                  style={styles.featuredImage}
                />
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredRestaurant} numberOfLines={1}>
                    {product.restaurant_name || 'Food'}
                  </Text>
                  <Text style={styles.featuredTitle} numberOfLines={1}>
                    {product.title}
                  </Text>
                  <Text style={styles.featuredPrice}>{formatPrice(product.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search deals, restaurants..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setIsSearching(false);
              setSelectedCategory('All');
            }}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isSearching || selectedCategory !== 'All' ? renderSearchResults() : renderExplore()}
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
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.semiBold,
  },
  categoriesScroll: {
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  recentList: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  featuredScroll: {
    gap: 12,
  },
  featuredCard: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredImage: {
    width: '100%',
    height: 100,
  },
  featuredInfo: {
    padding: 12,
  },
  featuredRestaurant: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  featuredTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginTop: 2,
  },
  featuredPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
    marginTop: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noResultsTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: 16,
  },
  noResultsText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  dealCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dealImage: {
    width: 100,
    height: 100,
  },
  dealInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  dealRestaurant: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  dealTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginTop: 2,
  },
  dealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dealPrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
  },
  dealQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dealQuantityText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
