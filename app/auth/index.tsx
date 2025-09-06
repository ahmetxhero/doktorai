import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, Shield, Globe } from 'lucide-react-native';

export default function AuthIndex() {
  const router = useRouter();
  const { language } = useAuth();

  const translations = {
    tr: {
      welcome: 'DoktorAi\'ye Hoş Geldiniz',
      subtitle: 'Doğal ve bitkisel tedavi önerileri için AI asistanınız',
      features: [
        'Kişiselleştirilmiş bitkisel tedavi önerileri',
        'Güvenli ve sağlık odaklı yaklaşım',
        'Çoklu dil desteği'
      ],
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      disclaimer: 'Bu uygulama tıbbi tavsiye sağlamaz. Sağlık sorunlarınız için mutlaka doktorunuza danışın.'
    },
    en: {
      welcome: 'Welcome to DoktorAi',
      subtitle: 'Your AI assistant for natural and herbal treatment suggestions',
      features: [
        'Personalized herbal treatment recommendations',
        'Safe and health-focused approach',
        'Multi-language support'
      ],
      login: 'Login',
      register: 'Register',
      disclaimer: 'This app does not provide medical advice. Always consult your doctor for health issues.'
    }
  };

  const t = translations[language];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Leaf size={48} color="#22C55E" />
          <Text style={styles.logo}>DoktorAi</Text>
        </View>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      <View style={styles.features}>
        {t.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              {index === 0 && <Leaf size={24} color="#22C55E" />}
              {index === 1 && <Shield size={24} color="#22C55E" />}
              {index === 2 && <Globe size={24} color="#22C55E" />}
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.primaryButtonText}>{t.login}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/auth/register')}
        >
          <Text style={styles.secondaryButtonText}>{t.register}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>{t.disclaimer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginBottom: 60,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    flex: 1,
  },
  buttons: {
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});