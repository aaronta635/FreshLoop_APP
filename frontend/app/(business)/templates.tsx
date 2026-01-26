// Create frontend/app/(business)/templates.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { templatesApi, ProductTemplate, API_BASE_URL } from '../../services/api';

export default function TemplatesScreen() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const fetchedTemplates = await templatesApi.getMyTemplates();
      setTemplates(fetchedTemplates);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      Alert.alert('Error', 'Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = (template: ProductTemplate) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${template.template_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await templatesApi.deleteTemplate(template.id);
              setTemplates(prev => prev.filter(t => t.id !== template.id));
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete template');
            }
          },
        },
      ]
    );
  };

  const handleUseTemplate = (template: ProductTemplate) => {
    Alert.alert(
      'Use Template',
      `Create a new product using "${template.template_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Template',
          onPress: () => {
            router.push({
              pathname: '/(business)/create-deal',
              params: { templateId: template.id.toString() },
            });
          },
        },
      ]
    );
  };

  const renderTemplate = ({ item }: { item: ProductTemplate }) => (
    <View style={styles.templateCard}>
      <Image
        source={{ 
          uri: item.template_image 
            ? `${API_BASE_URL.replace('/api', '')}${item.template_image}`
            : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
        }}
        style={styles.templateImage}
      />
      
      <View style={styles.templateContent}>
        <View style={styles.templateHeader}>
          <Text style={styles.templateName}>{item.template_name}</Text>
          {item.is_default && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.productName}>{item.product_name}</Text>
        <Text style={styles.templateDescription} numberOfLines={2}>
          {item.short_description}
        </Text>
        <Text style={styles.templatePrice}>
          ${(item.price / 100).toFixed(2)}
        </Text>
        
        <View style={styles.templateActions}>
          <TouchableOpacity
            style={styles.useButton}
            onPress={() => handleUseTemplate(item)}
          >
            <Ionicons name="add-circle" size={16} color={Colors.white} />
            <Text style={styles.useButtonText}>Use Template</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/(business)/edit-template?templateId=${item.id}` as any)}
          >
            <Ionicons name="pencil" size={16} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTemplate(item)}
          >
            <Ionicons name="trash" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Templates</Text>
        <TouchableOpacity onPress={() => router.push('/(business)/create-template' as any)}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading templates...</Text>
        </View>
      ) : templates.length > 0 ? (
        <FlatList
          data={templates}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTemplate}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Templates Yet</Text>
          <Text style={styles.emptyText}>
            Create templates to quickly reuse product information
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/(business)/create-template' as any)}
          >
            <Text style={styles.createButtonText}>Create First Template</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 48,
    paddingBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
  },
  listContent: {
    padding: Spacing.lg,
  },
  templateCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateImage: {
    width: '100%',
    height: 120,
  },
  templateContent: {
    padding: Spacing.md,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  templateName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  productName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  templateDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  templatePrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.accent,
    marginBottom: Spacing.md,
  },
  templateActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  useButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  useButtonText: {
    color: Colors.white,
    fontWeight: FontWeight.semiBold,
    fontSize: FontSize.sm,
  },
  editButton: {
    padding: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(45, 59, 45, 0.1)',
  },
  deleteButton: {
    padding: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  createButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.full,
  },
  createButtonText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
});