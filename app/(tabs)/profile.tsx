import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { 
  User, 
  Mail, 
  Globe, 
  Settings, 
  LogOut, 
  Crown, 
  Shield,
  Bell,
  Volume2,
  Palette
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut, language, setLanguage } = useAuth();
  const router = useRouter();
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const translations = {
    tr: {
      profile: 'Profil',
      account: 'Hesap',
      email: 'E-posta',
      language: 'Dil',
      turkish: 'Türkçe',
      english: 'İngilizce',
      preferences: 'Tercihler',
      autoPlay: 'Sesli yanıtları otomatik oynat',
      notifications: 'Bildirimler',
      premium: 'Premium',
      upgradePremium: 'Premium\'a geç',
      premiumFeatures: 'Premium özellikler',
      settings: 'Ayarlar',
      about: 'Hakkında',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Koşulları',
      logout: 'Çıkış Yap',
      logoutConfirm: 'Çıkış yapmak istediğinizden emin misiniz?',
      cancel: 'İptal',
      confirm: 'Onayla',
    },
    en: {
      profile: 'Profile',
      account: 'Account',
      email: 'Email',
      language: 'Language',
      turkish: 'Turkish',
      english: 'English',
      preferences: 'Preferences',
      autoPlay: 'Auto-play audio responses',
      notifications: 'Notifications',
      premium: 'Premium',
      upgradePremium: 'Upgrade to Premium',
      premiumFeatures: 'Premium features',
      settings: 'Settings',
      about: 'About',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      logout: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?',
      cancel: 'Cancel',
      confirm: 'Confirm',
    }
  };

  const t = translations[language];

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      t.logoutConfirm,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.confirm, onPress: signOut }
      ]
    );
  };

  const handleLanguageChange = (newLanguage: 'tr' | 'en') => {
    setLanguage(newLanguage);
  };

  const navigateToPremium = () => {
    router.push('/(tabs)/premium');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.profile}</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.account}</Text>
          
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <User size={32} color="#22C55E" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.profileStatus}>
                {user?.is_premium ? (
                  <View style={styles.premiumBadge}>
                    <Crown size={16} color="#F59E0B" />
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                ) : (
                  <Text style={styles.freeText}>Free</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.language}</Text>
          <View style={styles.languageOptions}>
            <TouchableOpacity
              style={[styles.languageOption, language === 'tr' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('tr')}
            >
              <Text style={[styles.languageOptionText, language === 'tr' && styles.languageOptionTextActive]}>
                {t.turkish}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageOption, language === 'en' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[styles.languageOptionText, language === 'en' && styles.languageOptionTextActive]}>
                {t.english}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.preferences}</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Volume2 size={20} color="#6B7280" />
              <Text style={styles.preferenceText}>{t.autoPlay}</Text>
            </View>
            <Switch
              value={autoPlayAudio}
              onValueChange={setAutoPlayAudio}
              trackColor={{ false: '#E5E7EB', true: '#22C55E' }}
              thumbColor={autoPlayAudio ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Bell size={20} color="#6B7280" />
              <Text style={styles.preferenceText}>{t.notifications}</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: '#22C55E' }}
              thumbColor={notifications ? '#FFFFFF' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Premium Section */}
        {!user?.is_premium && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.premiumCard} onPress={navigateToPremium}>
              <View style={styles.premiumHeader}>
                <Crown size={24} color="#F59E0B" />
                <Text style={styles.premiumTitle}>{t.upgradePremium}</Text>
              </View>
              <Text style={styles.premiumSubtitle}>{t.premiumFeatures}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.settings}</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Shield size={20} color="#6B7280" />
            <Text style={styles.settingText}>{t.privacy}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.settingText}>{t.terms}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Palette size={20} color="#6B7280" />
            <Text style={styles.settingText}>{t.about}</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>{t.logout}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  profileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  freeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  languageOption: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  languageOptionActive: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  languageOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  languageOptionTextActive: {
    color: 'white',
  },
  preferenceItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginLeft: 12,
  },
  premiumCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  premiumTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    marginLeft: 8,
  },
  premiumSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginLeft: 12,
  },
});