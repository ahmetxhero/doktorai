import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react-native';

export default function Register() {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, verifyEmail, resendVerification, language } = useAuth();
  const router = useRouter();

  const translations = {
    tr: {
      title: 'Kayıt Ol',
      verifyTitle: 'E-posta Doğrulama',
      email: 'E-posta',
      password: 'Şifre',
      confirmPassword: 'Şifreyi Onayla',
      verificationCode: 'Doğrulama Kodu',
      register: 'Kayıt Ol',
      verify: 'Doğrula',
      resendCode: 'Kodu Tekrar Gönder',
      haveAccount: 'Hesabınız var mı? Giriş yapın',
      backToLogin: 'Giriş sayfasına dön',
      error: 'Kayıt hatası',
      verificationError: 'Doğrulama hatası',
      emailRequired: 'E-posta adresi gereklidir',
      passwordRequired: 'Şifre gereklidir',
      passwordMismatch: 'Şifreler eşleşmiyor',
      passwordTooShort: 'Şifre en az 6 karakter olmalıdır',
      invalidEmail: 'Geçerli bir e-posta adresi girin',
      codeRequired: 'Doğrulama kodu gereklidir',
      invalidCode: 'Doğrulama kodu 6 haneli olmalıdır',
      success: 'Başarılı!',
      registrationSuccess: 'Kayıt başarılı! E-postanıza gönderilen 6 haneli doğrulama kodunu girin.',
      verificationSuccess: 'E-posta doğrulandı! Artık giriş yapabilirsiniz.',
      resendSuccess: 'Doğrulama kodu tekrar gönderildi.',
      registering: 'Kayıt olunuyor...',
      verifying: 'Doğrulanıyor...',
      resending: 'Kod gönderiliyor...',
      showPassword: 'Şifreyi göster',
      hidePassword: 'Şifreyi gizle',
      verificationMessage: 'E-posta adresinize 6 haneli bir doğrulama kodu gönderdik. Lütfen aşağıya girin:',
      codeNotReceived: 'Kodu almadınız mı?',
    },
    en: {
      title: 'Register',
      verifyTitle: 'Email Verification',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      verificationCode: 'Verification Code',
      register: 'Register',
      verify: 'Verify',
      resendCode: 'Resend Code',
      haveAccount: 'Have an account? Login',
      backToLogin: 'Back to login',
      error: 'Registration error',
      verificationError: 'Verification error',
      emailRequired: 'Email address is required',
      passwordRequired: 'Password is required',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      invalidEmail: 'Please enter a valid email address',
      codeRequired: 'Verification code is required',
      invalidCode: 'Verification code must be 6 digits',
      success: 'Success!',
      registrationSuccess: 'Registration successful! Enter the 6-digit verification code sent to your email.',
      verificationSuccess: 'Email verified! You can now login.',
      resendSuccess: 'Verification code resent.',
      registering: 'Registering...',
      verifying: 'Verifying...',
      resending: 'Sending code...',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      verificationMessage: 'We sent a 6-digit verification code to your email address. Please enter it below:',
      codeNotReceived: "Didn't receive the code?",
    }
  };

  const t = translations[language];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    console.log('Register: Attempting registration with email:', email);

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

    if (password.length < 6) {
      Alert.alert(t.error, t.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t.error, t.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      console.log('Register: Calling signUp...');
      const { error } = await signUp(email.trim().toLowerCase(), password);
      
      if (error) {
        console.error('Register: Sign up failed:', error);
        
        // Handle specific error messages
        let errorMessage = error.message;
        if (error.message?.includes('User already registered')) {
          errorMessage = language === 'tr' 
            ? 'Bu e-posta adresi zaten kayıtlı' 
            : 'This email address is already registered';
        } else if (error.message?.includes('Password should be at least 6 characters')) {
          errorMessage = language === 'tr' 
            ? 'Şifre en az 6 karakter olmalıdır' 
            : 'Password should be at least 6 characters';
        }
        
        Alert.alert(t.error, errorMessage);
      } else {
        console.log('Register: Sign up successful, moving to verification step');
        Alert.alert(t.success, t.registrationSuccess);
        setStep('verify');
      }
    } catch (error) {
      console.error('Register: Unexpected error:', error);
      Alert.alert(t.error, 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    console.log('Verify: Attempting email verification with code:', verificationCode);

    // Validation
    if (!verificationCode.trim()) {
      Alert.alert(t.verificationError, t.codeRequired);
      return;
    }

    if (verificationCode.trim().length !== 6 || !/^\d{6}$/.test(verificationCode.trim())) {
      Alert.alert(t.verificationError, t.invalidCode);
      return;
    }

    setLoading(true);
    try {
      console.log('Verify: Calling verifyEmail...');
      const { error } = await verifyEmail(email.trim().toLowerCase(), verificationCode.trim());
      
      if (error) {
        console.error('Verify: Email verification failed:', error);
        
        // Handle specific error messages
        let errorMessage = error.message;
        if (error.message?.includes('Invalid verification code')) {
          errorMessage = language === 'tr' 
            ? 'Geçersiz doğrulama kodu' 
            : 'Invalid verification code';
        } else if (error.message?.includes('Verification code expired')) {
          errorMessage = language === 'tr' 
            ? 'Doğrulama kodu süresi dolmuş' 
            : 'Verification code expired';
        }
        
        Alert.alert(t.verificationError, errorMessage);
      } else {
        console.log('Verify: Email verification successful');
        Alert.alert(
          t.success, 
          t.verificationSuccess,
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Clear form
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setVerificationCode('');
                setStep('register');
                // Navigate to login
                router.push('/auth/login');
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Verify: Unexpected error:', error);
      Alert.alert(t.verificationError, 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    console.log('Resend: Attempting to resend verification code');

    setLoading(true);
    try {
      console.log('Resend: Calling resendVerification...');
      const { error } = await resendVerification(email.trim().toLowerCase());
      
      if (error) {
        console.error('Resend: Failed to resend verification code:', error);
        Alert.alert(t.verificationError, error.message);
      } else {
        console.log('Resend: Verification code resent successfully');
        Alert.alert(t.success, t.resendSuccess);
      }
    } catch (error) {
      console.error('Resend: Unexpected error:', error);
      Alert.alert(t.verificationError, 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('register');
      setVerificationCode('');
    } else {
      router.back();
    }
  };

  if (step === 'verify') {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          disabled={loading}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.verificationIcon}>
            <Shield size={32} color="#22C55E" />
          </View>
          <Text style={styles.title}>{t.verifyTitle}</Text>
          <Text style={styles.subtitle}>{t.verificationMessage}</Text>
          <Text style={styles.emailDisplay}>{email}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.codeInputContainer}>
            <TextInput
              style={styles.codeInput}
              placeholder={t.verificationCode}
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
              maxLength={6}
              editable={!loading}
              autoCorrect={false}
              textAlign="center"
            />
          </View>

          <TouchableOpacity 
            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
            onPress={handleVerifyEmail}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.verifyButtonText}>{t.verifying}</Text>
              </View>
            ) : (
              <Text style={styles.verifyButtonText}>{t.verify}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>{t.codeNotReceived}</Text>
            <TouchableOpacity 
              style={styles.resendButton}
              onPress={handleResendCode}
              disabled={loading}
            >
              <Text style={styles.resendButtonText}>
                {loading ? t.resending : t.resendCode}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => router.push('/auth/login')}
          disabled={loading}
        >
          <Text style={styles.loginLinkText}>{t.backToLogin}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBack}
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

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Lock size={20} color="#6B7280" />
          </View>
          <TextInput
            style={styles.input}
            placeholder={t.confirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoComplete="password"
            editable={!loading}
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color="#6B7280" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.registerButton, loading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.registerButtonText}>{t.registering}</Text>
            </View>
          ) : (
            <Text style={styles.registerButtonText}>{t.register}</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.loginLink}
        onPress={() => router.push('/auth/login')}
        disabled={loading}
      >
        <Text style={styles.loginLinkText}>{t.haveAccount}</Text>
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
    alignItems: 'center',
  },
  verificationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emailDisplay: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
    textAlign: 'center',
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
  codeInputContainer: {
    alignItems: 'center',
  },
  codeInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#22C55E',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    letterSpacing: 8,
    width: 200,
  },
  registerButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  verifyButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#22C55E',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#22C55E',
  },
});