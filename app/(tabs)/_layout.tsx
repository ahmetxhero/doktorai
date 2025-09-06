import React from 'react';
import { Tabs } from 'expo-router';
import { MessageCircle, History, Settings, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { language } = useAuth();

  const translations = {
    tr: {
      chat: 'Sohbet',
      history: 'Geçmiş',
      profile: 'Profil',
      premium: 'Premium',
    },
    en: {
      chat: 'Chat',
      history: 'History',
      profile: 'Profile',
      premium: 'Premium',
    }
  };

  const t = translations[language];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F5F5DC',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 85 : 70, // Increased height for better spacing
          paddingBottom: Platform.OS === 'ios' ? 25 : 12, // More bottom padding
          paddingTop: 12, // Increased top padding
          marginBottom: Platform.OS === 'ios' ? -10 : 0, // Move up on iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.chat,
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t.history,
          tabBarIcon: ({ size, color }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile,
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: t.premium,
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}