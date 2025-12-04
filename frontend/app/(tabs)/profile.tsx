import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants/Colors';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={Colors.primary} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userEmail}>alex.johnson@email.com</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Loops</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>$168</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>30kg</Text>
              <Text style={styles.statLabel}>CO₂</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemWithBorder]}
              onPress={() => router.push('/(customer)/edit-profile')}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name="person-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemWithBorder]}
              onPress={() => router.push('/(customer)/payment-methods')}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name="card-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemText}>Payment Methods</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <View style={styles.switchContainer}>
                <View style={styles.switchTrack}>
                  <View style={styles.switchThumb} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Business Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(business)/dashboard')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, styles.businessIcon]}>
                  <Ionicons name="storefront" size={20} color={Colors.white} />
                </View>
                <View>
                  <Text style={styles.menuItemText}>Partner Dashboard</Text>
                  <Text style={styles.menuItemSubtext}>Manage your restaurant</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemWithBorder]}
              onPress={() => router.push('/(customer)/help-centre')}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name="help-circle-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemText}>Help Centre</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemWithBorder]}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name="settings-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, styles.logoutIcon]}>
                  <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                </View>
                <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Impact Card */}
        <View style={styles.impactCard}>
          <Ionicons name="trophy" size={48} color={Colors.secondary} />
          <Text style={styles.impactTitle}>Eco Warrior</Text>
          <Text style={styles.impactText}>You've saved 12 meals from waste!</Text>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Fresh Loop v1.0.0</Text>
          <Text style={styles.appInfoText}>make every bite count 🌱</Text>
        </View>
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
    paddingBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  userCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
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
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  menuItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
  },
  businessIcon: {
    backgroundColor: Colors.accent,
  },
  logoutIcon: {
    backgroundColor: '#FEE2E2',
  },
  menuItemText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
  menuItemSubtext: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutText: {
    color: Colors.error,
  },
  switchContainer: {
    padding: 4,
  },
  switchTrack: {
    width: 48,
    height: 28,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchThumb: {
    width: 20,
    height: 20,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  impactCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  impactTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginTop: 12,
    marginBottom: Spacing.sm,
  },
  impactText: {
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  appInfoText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});

