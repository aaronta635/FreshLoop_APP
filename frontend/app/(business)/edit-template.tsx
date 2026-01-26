import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { templatesApi, ProductTemplateCreate, productsApi, ProductTemplate, API_BASE_URL } from '../../services/api';

export default function EditTemplateScreen() {
  const router = useRouter();
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [originalTemplate, setOriginalTemplate] = useState<ProductTemplate | null>(null);
  const [formData, setFormData] = useState({
    templateName: '',
    productName: '',
    description: '',
    longDescription: '',
    price: '',
  });

  useEffect(() => {
    if (templateId) {
      loadTemplate(parseInt(templateId));
    }
  }, [templateId]);

  const loadTemplate = async (id: number) => {
    try {
      setIsLoadingTemplate(true);
      const templates = await templatesApi.getMyTemplates();
      const template = templates.find(t => t.id === id);
      if (template) {
        setOriginalTemplate(template);
        setFormData({
          templateName: template.template_name,
          productName: template.product_name,
          description: template.short_description,
          longDescription: template.long_description || '',
          price: (template.price / 100).toFixed(2),
        });
        if (template.template_image) {
          const imageUrl = template.template_image.startsWith('http')
            ? template.template_image
            : `${API_BASE_URL.replace('/api', '')}${template.template_image}`;
          setUploadedImageUrl(template.template_image);
          setImageUri(imageUrl);
        }
      } else {
        Alert.alert('Error', 'Template not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading template:', error);
      Alert.alert('Error', 'Failed to load template');
      router.back();
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setUploadedImageUrl(null); // Clear old URL to trigger re-upload
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setUploadedImageUrl(null);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validateForm = (): boolean => {
    if (!formData.templateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return false;
    }
    if (!formData.productName.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    return true;
  };

  const handleUpdateTemplate = async () => {
    if (!validateForm() || !templateId) return;

    setIsLoading(true);
    try {
      let templateImageUrl: string | undefined = uploadedImageUrl || undefined;

      // Upload new image if selected and different from original
      if (imageUri && !uploadedImageUrl) {
        try {
          const uploadResult = await productsApi.uploadImage(imageUri);
          templateImageUrl = uploadResult.image_url;
          setUploadedImageUrl(templateImageUrl);
        } catch (error) {
          console.log('Image upload failed: ', error);
          Alert.alert('Warning', 'Image upload failed. Template will be updated without new image.');
          // Keep original image URL if upload fails
          if (originalTemplate?.template_image) {
            templateImageUrl = originalTemplate.template_image;
          }
        }
      } else if (!imageUri && originalTemplate?.template_image) {
        // Keep original image if no new image selected
        templateImageUrl = originalTemplate.template_image;
      }

      const templateData: Partial<ProductTemplateCreate> = {
        template_name: formData.templateName.trim(),
        product_name: formData.productName.trim(),
        short_description: formData.description.trim(),
        long_description: formData.longDescription.trim() || formData.description.trim(),
        price: Math.round(parseFloat(formData.price) * 100),
        template_image: templateImageUrl,
      };

      await templatesApi.updateTemplate(parseInt(templateId), templateData);

      Alert.alert(
        'Success!',
        'Template updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Update template error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update template. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingTemplate) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading template...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Template</Text>
        <Text style={styles.headerSubtitle}>Update template information</Text>
      </View>

      {/* Form */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>TEMPLATE IMAGE</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={showImageOptions}>
            {imageUri || uploadedImageUrl ? (
              <Image 
                source={{ uri: imageUri || (uploadedImageUrl?.startsWith('http') ? uploadedImageUrl : `${API_BASE_URL.replace('/api', '')}${uploadedImageUrl}`) || '' }} 
                style={styles.uploadedImage} 
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera" size={48} color={Colors.textSecondary} />
                <Text style={styles.uploadText}>Add Photo</Text>
                <Text style={styles.uploadSubtext}>Tap to upload or take a photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Template Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>TEMPLATE NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Weekly Pasta Special"
            placeholderTextColor={Colors.textSecondary}
            value={formData.templateName}
            onChangeText={(templateName) => setFormData({ ...formData, templateName })}
            editable={!isLoading}
          />
        </View>

        {/* Product Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PRODUCT NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Fresh Pasta & Salad Combo"
            placeholderTextColor={Colors.textSecondary}
            value={formData.productName}
            onChangeText={(productName) => setFormData({ ...formData, productName })}
            editable={!isLoading}
          />
        </View>

        {/* Short Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>SHORT DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Brief description (shown in lists)..."
            placeholderTextColor={Colors.textSecondary}
            value={formData.description}
            onChangeText={(description) => setFormData({ ...formData, description })}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>

        {/* Long Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DETAILED DESCRIPTION (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Full description with details..."
            placeholderTextColor={Colors.textSecondary}
            value={formData.longDescription}
            onChangeText={(longDescription) => setFormData({ ...formData, longDescription })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>

        {/* Price */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>BASE PRICE ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="5.99"
            placeholderTextColor={Colors.textSecondary}
            value={formData.price}
            onChangeText={(price) => setFormData({ ...formData, price })}
            keyboardType="decimal-pad"
            editable={!isLoading}
          />
        </View>
      </ScrollView>

      {/* Update Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
          onPress={handleUpdateTemplate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.updateButtonText}>Update Template</Text>
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: 48,
    paddingBottom: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 16,
    fontSize: FontSize.md,
    color: Colors.primary,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  imageUpload: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  uploadedImage: {
    width: '100%',
    height: 180,
  },
  uploadText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  uploadSubtext: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  updateButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 20,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  updateButtonDisabled: {
    opacity: 0.7,
  },
  updateButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});

