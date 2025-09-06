import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf } from 'lucide-react-native';

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('IndexScreen: Auth state changed', { user: !!user, loading });
    
    if (!loading) {
      if (user) {
        console.log('IndexScreen: User authenticated, redirecting to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('IndexScreen: User not authenticated, redirecting to auth');
        router.replace('/auth');
      }
    }
  }, [user, loading, router]);

  // Show loading screen while checking authentication
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Leaf size={48} color="#22C55E" />
        <Text style={styles.logoText}>DoktorAi</Text>
      </View>
      <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
      <Text style={styles.loadingText}>Yükleniyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
    marginLeft: 12,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});