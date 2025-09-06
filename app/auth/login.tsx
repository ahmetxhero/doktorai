import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, language } = useAuth();
  const router = useRouter();

  const translations = {
    tr: {
      title: 'Giriş Yap',
      email: 'E-posta',
      password: 'Şifre',
      login: 'Giriş Yap',
      forgotPassword: 'Şifremi Unuttum',
      noAccount: 'Hesabınız yok mu? Kayıt olun',
      error: 'Giriş hatası',
      emailRequired: 'E-posta adresi gereklidir',
      passwordRequired: 'Şifre gereklidir',
      invalidEmail: 'Geçerli bir e-posta adresi girin',
      loggingIn: 'Giriş yapılıyor...',
      showPassword: 'Şifreyi göster',
      hidePassword: 'Şifreyi gizle',
    },
    en: {
      title: 'Login',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      forgotPassword: 'Forgot Password',
      noAccount: "Don't have an account? Register",
      error: 'Login error',
      emailRequired: 'Email address is required',
      passwordRequired: 'Password is required',
      invalidEmail: 'Please enter a valid email address',
      loggingIn: 'Logging in...',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    }
  };

  const t = translations[language];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    console.log('Login: Attempting login with email:', email);

    // Validation
    if (!email.trim()) {
      Alert.alert(t.error, t.emailRequired);
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert(t.error, t.invalidEmail);
      return;
    }

    if (!password.trim()) {
      Alert.alert(t.error, t.passwordRequired);
      return;
    }

    setLoading(true);
    try {
      console.log('Login: Calling signIn...');
      const { error } = await signIn(email.trim().toLowerCase(), password);
      
      if (error) {
        console.error('Login: Sign in failed:', error);
        
        // Handle specific error messages
        let errorMessage = error.message;
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = language === 'tr' 
            ? 'E-posta veya şifre hatalı' 
            : 'Invalid email or password';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = language === 'tr' 
            ? 'E-posta adresinizi doğrulamanız gerekiyor' 
            : 'Please verify your email address';
        }
        
        Alert.alert(t.error, errorMessage);
      } else {
        console.log('Login: Sign in successful, redirecting...');
        // Navigation will be handled by the auth state change in index.tsx
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Login: Unexpected error:', error);
      Alert.alert(t.error, 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={loading}
      >
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Mail size={20} color="#6B7280" />
          </View>
          <TextInput
            style={styles.input}
            placeholder={t.email}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!loading}
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Lock size={20} color="#6B7280" />
          </View>
          <TextInput
            style={styles.input}
            placeholder={t.password}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
            editable={!loading}
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff size={20} color="#6B7280" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.loginButtonText}>{t.loggingIn}</Text>
            </View>
          ) : (
            <Text style={styles.loginButtonText}>{t.login}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.forgotPassword}
          disabled={loading}
        >
          <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.registerLink}
        onPress={() => router.push('/auth/register')}
        disabled={loading}
      >
        <Text style={styles.registerLinkText}>{t.noAccount}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
  },
  form: {
    gap: 20,
    marginBottom: 40,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    paddingVertical: 12,
  },
  passwordToggle: {
    padding: 4,
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  registerLink: {
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
  },
});