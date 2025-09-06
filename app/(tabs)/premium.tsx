import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown, 
  Check, 
  Infinity, 
  Mic, 
  Camera, 
  Database, 
  Wifi,
  Star
} from 'lucide-react-native';

export default function PremiumScreen() {
  const { user, language } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const translations = {
    tr: {
      premium: 'Premium',
      currentPlan: 'Mevcut Planınız',
      freePlan: 'Ücretsiz Plan',
      premiumPlan: 'Premium Plan',
      upgradeToPremium: 'Premium\'a Geç',
      monthly: 'Aylık',
      yearly: 'Yıllık',
      save: '%25 tasarruf',
      features: 'Özellikler',
      freeFeatures: [
        'Günde 10 soru',
        'Sadece metin sorular',
        'Temel bitkisel öneriler',
        'Reklam destekli',
      ],
      premiumFeatures: [
        'Sınırsız soru',
        'Sesli mesaj desteği',
        'Fotoğraf analizi',
        'Gelişmiş bitkisel veritabanı',
        'Çevrimdışı erişim',
        'Reklamsız deneyim',
        'Öncelikli destek',
        'Kişiselleştirilmiş öneriler',
      ],
      pricing: 'Fiyatlandırma',
      monthlyPrice: '₺29.99/ay',
      yearlyPrice: '₺269.99/yıl',
      yearlyPriceMonth: '₺22.49/ay',
      startFreeTrial: '7 Gün Ücretsiz Deneme Başlat',
      subscribe: 'Abone Ol',
      alreadyPremium: 'Zaten Premium üyesiniz!',
      termsText: 'Abonelik koşullarını kabul ediyorum',
      restorePurchases: 'Satın Alımları Geri Yükle',
    },
    en: {
      premium: 'Premium',
      currentPlan: 'Current Plan',
      freePlan: 'Free Plan',
      premiumPlan: 'Premium Plan',
      upgradeToPremium: 'Upgrade to Premium',
      monthly: 'Monthly',
      yearly: 'Yearly',
      save: 'Save 25%',
      features: 'Features',
      freeFeatures: [
        '10 questions per day',
        'Text questions only',
        'Basic herbal suggestions',
        'Ad-supported',
      ],
      premiumFeatures: [
        'Unlimited questions',
        'Voice message support',
        'Photo analysis',
        'Advanced herbal database',
        'Offline access',
        'Ad-free experience',
        'Priority support',
        'Personalized recommendations',
      ],
      pricing: 'Pricing',
      monthlyPrice: '$9.99/month',
      yearlyPrice: '$89.99/year',
      yearlyPriceMonth: '$7.49/month',
      startFreeTrial: 'Start 7-Day Free Trial',
      subscribe: 'Subscribe',
      alreadyPremium: 'You are already a Premium member!',
      termsText: 'I accept the subscription terms',
      restorePurchases: 'Restore Purchases',
    }
  };

  const t = translations[language];

  const handleSubscribe = async () => {
    if (user?.is_premium) {
      Alert.alert('Premium', t.alreadyPremium);
      return;
    }

    Alert.alert(
      'Premium',
      'To integrate RevenueCat for in-app purchases, you need to export this project and open it locally (e.g., in Cursor or VS Code) to install the RevenueCat SDK. RevenueCat handles billing, entitlements, and analytics for mobile subscriptions.\n\nNote: RevenueCat requires native code and will not function in the browser preview. You\'ll need to create a development build using Expo Dev Client to test purchases.',
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const renderFeatureIcon = (index: number) => {
    const icons = [Infinity, Mic, Camera, Database, Wifi, Star, Check, Star];
    const Icon = icons[index] || Check;
    return <Icon size={16} color="#22C55E" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Crown size={24} color="#F59E0B" />
        <Text style={styles.title}>{t.premium}</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Current Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.currentPlan}</Text>
          <View style={[styles.planCard, user?.is_premium && styles.activePlan]}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>
                {user?.is_premium ? t.premiumPlan : t.freePlan}
              </Text>
              {user?.is_premium && (
                <View style={styles.activeBadge}>
                  <Crown size={16} color="#F59E0B" />
                </View>
              )}
            </View>
            <View style={styles.features}>
              {(user?.is_premium ? t.premiumFeatures : t.freeFeatures).map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  {user?.is_premium ? (
                    renderFeatureIcon(index)
                  ) : (
                    <Check size={16} color="#9CA3AF" />
                  )}
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Premium Features */}
        {!user?.is_premium && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.upgradeToPremium}</Text>
              <View style={styles.premiumCard}>
                <View style={styles.premiumHeader}>
                  <Crown size={32} color="#F59E0B" />
                  <Text style={styles.premiumTitle}>{t.premiumPlan}</Text>
                </View>
                <View style={styles.features}>
                  {t.premiumFeatures.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      {renderFeatureIcon(index)}
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Pricing */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.pricing}</Text>
              
              <View style={styles.planSelector}>
                <TouchableOpacity
                  style={[styles.planOption, selectedPlan === 'monthly' && styles.planOptionActive]}
                  onPress={() => setSelectedPlan('monthly')}
                >
                  <Text style={[styles.planOptionText, selectedPlan === 'monthly' && styles.planOptionTextActive]}>
                    {t.monthly}
                  </Text>
                  <Text style={[styles.planOptionPrice, selectedPlan === 'monthly' && styles.planOptionPriceActive]}>
                    {t.monthlyPrice}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.planOption, selectedPlan === 'yearly' && styles.planOptionActive]}
                  onPress={() => setSelectedPlan('yearly')}
                >
                  <View style={styles.planOptionHeader}>
                    <Text style={[styles.planOptionText, selectedPlan === 'yearly' && styles.planOptionTextActive]}>
                      {t.yearly}
                    </Text>
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveText}>{t.save}</Text>
                    </View>
                  </View>
                  <Text style={[styles.planOptionPrice, selectedPlan === 'yearly' && styles.planOptionPriceActive]}>
                    {t.yearlyPrice}
                  </Text>
                  <Text style={styles.planOptionSubtext}>{t.yearlyPriceMonth}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                <Text style={styles.subscribeButtonText}>{t.startFreeTrial}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.restoreButton}>
                <Text style={styles.restoreButtonText}>{t.restorePurchases}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
    marginLeft: 12,
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
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activePlan: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  activeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    marginBottom: 16,
  },
  premiumTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    marginLeft: 12,
  },
  features: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginLeft: 12,
  },
  planSelector: {
    gap: 12,
    marginBottom: 20,
  },
  planOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  planOptionActive: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  planOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  planOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  planOptionTextActive: {
    color: '#22C55E',
  },
  planOptionPrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
  },
  planOptionPriceActive: {
    color: '#22C55E',
  },
  planOptionSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  saveBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  subscribeButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  restoreButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});