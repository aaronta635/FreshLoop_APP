import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';
import { templatesApi, ProductTemplateCreate, productsApi, API_BASE_URL } from '../../services/api';

export default function CreateTemplateScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    templateName: '',
    productName: '',
    description: '',
    longDescription: '',
    price: '',
  });

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
      setUploadedImageUrl(null);
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
      'Add Photo',
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

  const handleCreateTemplate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let templateImageUrl: string | undefined = uploadedImageUrl || undefined;

      // Upload image if selected and not already uploaded
      if (imageUri && !uploadedImageUrl) {
        try {
          const uploadResult = await productsApi.uploadImage(imageUri);
          templateImageUrl = uploadResult.image_url;
          setUploadedImageUrl(templateImageUrl);
        } catch (error) {
          console.log('Image upload failed: ', error);
          Alert.alert('Warning', 'Image upload failed. Template will be created without image.');
        }
      }

      const templateData: ProductTemplateCreate = {
        template_name: formData.templateName.trim(),
        product_name: formData.productName.trim(),
        short_description: formData.description.trim(),
        long_description: formData.longDescription.trim() || formData.description.trim(),
        price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
        template_image: templateImageUrl,
        is_default: false,
      };

      await templatesApi.createTemplate(templateData);

      Alert.alert(
        'Success!',
        'Template created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Create template error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create template. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Create Template</Text>
        <Text style={styles.headerSubtitle}>Save reusable product info</Text>
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
                source={{ uri: imageUri || uploadedImageUrl || '' }} 
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

        {/* Tips */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 About Templates</Text>
          <Text style={styles.tipText}>
            • Templates save time when creating similar products{'\n'}
            • You can reuse name, description, price, and image{'\n'}
            • Stock quantity will be set each time you use a template{'\n'}
            • Edit or delete templates anytime from the Templates screen
          </Text>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.createButtonDisabled]}
          onPress={handleCreateTemplate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.createButtonText}>Save Template</Text>
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
  tipCard: {
    backgroundColor: 'rgba(217, 224, 33, 0.2)',
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  tipTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    lineHeight: 22,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  createButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 20,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});

