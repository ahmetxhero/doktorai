import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { MessageCircle, Calendar, Trash2 } from 'lucide-react-native';

export default function HistoryScreen() {
  const { language } = useAuth();
  const { sessions, selectSession, currentSession } = useChat();

  const translations = {
    tr: {
      title: 'Sohbet Geçmişi',
      noChats: 'Henüz sohbet yok',
      noChatsMessage: 'İlk sohbetinizi başlatmak için ana ekrana gidin.',
      messages: 'mesaj',
      today: 'Bugün',
      yesterday: 'Dün',
      thisWeek: 'Bu hafta',
      older: 'Daha eski',
    },
    en: {
      title: 'Chat History',
      noChats: 'No chats yet',
      noChatsMessage: 'Go to the main screen to start your first chat.',
      messages: 'messages',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      older: 'Older',
    }
  };

  const t = translations[language];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t.today;
    if (diffDays === 1) return t.yesterday;
    if (diffDays < 7) return t.thisWeek;
    return t.older;
  };

  const groupSessionsByDate = () => {
    const groups: { [key: string]: typeof sessions } = {};
    
    sessions.forEach(session => {
      const dateGroup = formatDate(session.updated_at);
      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
      }
      groups[dateGroup].push(session);
    });

    return groups;
  };

  const groupedSessions = groupSessionsByDate();

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MessageCircle size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>{t.noChats}</Text>
          <Text style={styles.emptyMessage}>{t.noChatsMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.title}</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {Object.entries(groupedSessions).map(([dateGroup, groupSessions]) => (
          <View key={dateGroup} style={styles.dateGroup}>
            <Text style={styles.dateGroupTitle}>{dateGroup}</Text>
            {groupSessions.map(session => (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.sessionItem,
                  currentSession?.id === session.id && styles.activeSession
                ]}
                onPress={() => selectSession(session)}
              >
                <View style={styles.sessionContent}>
                  <Text style={styles.sessionTitle} numberOfLines={1}>
                    {session.title}
                  </Text>
                  <Text style={styles.sessionMeta}>
                    {session.messages.length} {t.messages}
                  </Text>
                </View>
                <View style={styles.sessionActions}>
                  <Calendar size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateGroupTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sessionItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeSession: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  sessionMeta: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  sessionActions: {
    marginLeft: 12,
  },
});