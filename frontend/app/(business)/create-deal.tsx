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
import { productsApi, ProductCreate, ProductUpdate, ProductCategoryEnum } from '../../services/api';

export default function CreateDealScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    pickupAddress: '',
    readyTime: '14:00', // Default pickup time
  });

  // Get shop name from user or use default
  const shopName = 'Your Restaurant'; // This should come from user/vendor profile

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
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a deal title');
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
    if (!formData.quantity || isNaN(parseInt(formData.quantity))) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return false;
    }
    if (!formData.pickupAddress.trim()) {
      Alert.alert('Error', 'Please enter a pickup address');
      return false;
    }
    return true;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let imageUrls: string[] = [];

      // Upload image if selected

      if (imageUri) {
        try {
          const uploadResult = await productsApi.uploadImage(imageUri);
          imageUrls = [uploadResult.image_url];
        } catch (error) {
          console.log('Image upload failed: ', error);
        }
      }

      // Calculate ready time (today at the specified time)
      const [hours, minutes] = formData.readyTime.split(':').map(Number);
      const readyTime = new Date();
      readyTime.setHours(hours, minutes, 0, 0);
      
      // If the time has passed today, set it for tomorrow
      if (readyTime < new Date()) {
        readyTime.setDate(readyTime.getDate() + 1);
      }
      const productData: ProductCreate = {
        product_name: formData.title.trim(),
        short_description: formData.description.trim(),
        long_description: formData.description.trim(),
        product_images: imageUrls,
        category: 'food' as ProductCategoryEnum,  // or let user select
        stock: parseInt(formData.quantity),
        price: Math.round(parseFloat(formData.price) * 100),
        pickup_time: formData.readyTime,  // store the time string directly
      };

      await productsApi.createProduct(productData);

      Alert.alert(
        'Success!',
        'Your deal has been created and is now live.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Create deal error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create deal. Please try again.'
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
        <Text style={styles.headerTitle}>Create New Deal</Text>
        <Text style={styles.headerSubtitle}>List your surplus food</Text>
      </View>

      {/* Form */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DEAL PHOTO</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={showImageOptions}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera" size={48} color={Colors.textSecondary} />
                <Text style={styles.uploadText}>Add Photo</Text>
                <Text style={styles.uploadSubtext}>Tap to upload or take a photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DEAL TITLE</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Fresh Pasta & Salad Combo"
            placeholderTextColor={Colors.textSecondary}
            value={formData.title}
            onChangeText={(title) => setFormData({ ...formData, title })}
            editable={!isLoading}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what's included in this deal..."
            placeholderTextColor={Colors.textSecondary}
            value={formData.description}
            onChangeText={(description) => setFormData({ ...formData, description })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>

        {/* Price & Quantity */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>PRICE ($)</Text>
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

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>QUANTITY</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              placeholderTextColor={Colors.textSecondary}
              value={formData.quantity}
              onChangeText={(quantity) => setFormData({ ...formData, quantity })}
              keyboardType="number-pad"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Pickup Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PICKUP ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="123 Crown Street, Wollongong"
            placeholderTextColor={Colors.textSecondary}
            value={formData.pickupAddress}
            onChangeText={(pickupAddress) => setFormData({ ...formData, pickupAddress })}
            editable={!isLoading}
          />
        </View>

        {/* Ready Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PICKUP TIME</Text>
          <View style={styles.timeSelector}>
            {['12:00', '14:00', '16:00', '18:00', '20:00'].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeChip,
                  formData.readyTime === time && styles.timeChipActive,
                ]}
                onPress={() => setFormData({ ...formData, readyTime: time })}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.timeChipText,
                    formData.readyTime === time && styles.timeChipTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Tips for Great Deals</Text>
          <Text style={styles.tipText}>
            • Use clear photos of your food{'\n'}
            • Set competitive prices (50-70% off retail){'\n'}
            • List accurate quantities{'\n'}
            • Update deals regularly
          </Text>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.createButtonDisabled]}
          onPress={handleCreateProduct}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.createButtonText}>Create Deal</Text>
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
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
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
  timeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
  },
  timeChipActive: {
    backgroundColor: Colors.primary,
  },
  timeChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  timeChipTextActive: {
    color: Colors.white,
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

