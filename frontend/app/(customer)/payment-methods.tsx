import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';

interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
}

// Mock payment methods (will be replaced with Stripe)
const INITIAL_METHODS: PaymentMethod[] = [
  { id: '1', type: 'card', last4: '4242', brand: 'Visa', expiryMonth: '12', expiryYear: '25', isDefault: true },
  { id: '2', type: 'apple_pay', isDefault: false },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_METHODS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'apple_pay':
        return <Ionicons name="logo-apple" size={28} color={Colors.primary} />;
      case 'google_pay':
        return <Ionicons name="logo-google" size={28} color={Colors.primary} />;
      default:
        return <Text style={{ fontSize: 28 }}>{getCardIcon(method.brand)}</Text>;
    }
  };

  const getPaymentTitle = (method: PaymentMethod) => {
    switch (method.type) {
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return `${method.brand} •••• ${method.last4}`;
    }
  };

  const getPaymentSubtitle = (method: PaymentMethod) => {
    if (method.type === 'card' && method.expiryMonth && method.expiryYear) {
      return `Expires ${method.expiryMonth}/${method.expiryYear}`;
    }
    return method.isDefault ? 'Default payment method' : '';
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleAddCard = () => {
    // Validate
    if (!newCard.number || !newCard.expiry || !newCard.cvc) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    const cardNum = newCard.number.replace(/\s/g, '');
    if (cardNum.length < 16) {
      Alert.alert('Error', 'Please enter a valid card number');
      return;
    }

    // Add mock card
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      last4: cardNum.slice(-4),
      brand: cardNum.startsWith('4') ? 'Visa' : cardNum.startsWith('5') ? 'Mastercard' : 'Card',
      expiryMonth: newCard.expiry.split('/')[0],
      expiryYear: newCard.expiry.split('/')[1],
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddModal(false);
    setNewCard({ number: '', expiry: '', cvc: '', name: '' });
    Alert.alert('Success', 'Card added successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Methods List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Payment Methods</Text>
          
          {paymentMethods.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="card-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>No payment methods added</Text>
              <Text style={styles.emptySubtext}>Add a card to start ordering</Text>
            </View>
          ) : (
            paymentMethods.map((method) => (
              <View key={method.id} style={styles.methodCard}>
                <View style={styles.methodLeft}>
                  <View style={styles.methodIcon}>
                    {getPaymentIcon(method)}
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodTitle}>{getPaymentTitle(method)}</Text>
                    <Text style={styles.methodSubtitle}>{getPaymentSubtitle(method)}</Text>
                  </View>
                </View>
                
                <View style={styles.methodActions}>
                  {method.isDefault ? (
                    <View style={styles.defaultBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.setDefaultButton}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Text style={styles.setDefaultText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  
                  {method.type === 'card' && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(method.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Add New Card */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={24} color={Colors.accent} />
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>

        {/* Digital Wallets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Digital Wallets</Text>
          <View style={styles.walletsCard}>
            <TouchableOpacity style={styles.walletOption}>
              <Ionicons name="logo-apple" size={32} color={Colors.primary} />
              <Text style={styles.walletText}>Apple Pay</Text>
              {paymentMethods.some(m => m.type === 'apple_pay') ? (
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
              ) : (
                <Text style={styles.walletSetup}>Set Up</Text>
              )}
            </TouchableOpacity>
            <View style={styles.walletDivider} />
            <TouchableOpacity style={styles.walletOption}>
              <Ionicons name="logo-google" size={32} color={Colors.primary} />
              <Text style={styles.walletText}>Google Pay</Text>
              <Text style={styles.walletSetup}>Set Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.textSecondary} />
          <Text style={styles.securityText}>
            Your payment information is encrypted and securely stored. 
            We never store your full card number.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Card</Text>
            <TouchableOpacity onPress={handleAddCard}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.cardPreview}>
              <View style={styles.cardPreviewTop}>
                <Ionicons name="card" size={32} color={Colors.white} />
                <Text style={styles.cardPreviewBrand}>
                  {newCard.number.startsWith('4') ? 'VISA' : 
                   newCard.number.startsWith('5') ? 'MASTERCARD' : 'CARD'}
                </Text>
              </View>
              <Text style={styles.cardPreviewNumber}>
                {newCard.number || '•••• •••• •••• ••••'}
              </Text>
              <View style={styles.cardPreviewBottom}>
                <Text style={styles.cardPreviewName}>
                  {newCard.name || 'CARDHOLDER NAME'}
                </Text>
                <Text style={styles.cardPreviewExpiry}>
                  {newCard.expiry || 'MM/YY'}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.textSecondary}
                value={newCard.number}
                onChangeText={(text) => setNewCard({ ...newCard, number: formatCardNumber(text) })}
                keyboardType="number-pad"
                maxLength={19}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.textSecondary}
                  value={newCard.expiry}
                  onChangeText={(text) => setNewCard({ ...newCard, expiry: formatExpiry(text) })}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={{ width: 16 }} />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVC</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={Colors.textSecondary}
                  value={newCard.cvc}
                  onChangeText={(text) => setNewCard({ ...newCard, cvc: text.replace(/\D/g, '').substring(0, 4) })}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={Colors.textSecondary}
                value={newCard.name}
                onChangeText={(text) => setNewCard({ ...newCard, name: text.toUpperCase() })}
                autoCapitalize="characters"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    marginLeft: 12,
    flex: 1,
  },
  methodTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  methodSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  defaultText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: '#22C55E',
  },
  setDefaultButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  setDefaultText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.semiBold,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent,
  },
  walletsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  walletText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginLeft: 12,
  },
  walletSetup: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: FontWeight.semiBold,
  },
  walletDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: Spacing.md,
  },
  securityText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalCancel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  modalSave: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.accent,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  cardPreview: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: 20,
    marginBottom: 24,
    aspectRatio: 1.586,
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPreviewBrand: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  cardPreviewNumber: {
    fontSize: 22,
    fontWeight: FontWeight.semiBold,
    color: Colors.white,
    letterSpacing: 2,
    marginTop: 32,
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  cardPreviewName: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  cardPreviewExpiry: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputRow: {
    flexDirection: 'row',
  },
});
