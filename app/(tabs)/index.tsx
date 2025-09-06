import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Image,
  Alert,
  Platform
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Send, Mic, Camera, Globe, Volume2, Leaf, MicOff, CircleStop as StopCircle } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ChatScreen() {
  const { language, setLanguage, user } = useAuth();
  const { currentSession, sendMessage, loading, createNewSession } = useChat();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const scrollViewRef = useRef<ScrollView>(null);

  const translations = {
    tr: {
      welcome: 'DoktorAi\'ye hoş geldiniz!',
      welcomeMessage: 'Merhaba! Ben DoktorAi, doğal ve bitkisel tedaviler konusunda size yardımcı olmak için buradayım. Nasıl yardımcı olabilirim?',
      typeMessage: 'Mesajınızı yazın...',
      startRecording: 'Ses kaydı başlat',
      stopRecording: 'Ses kaydını durdur',
      takePhoto: 'Fotoğraf çek',
      send: 'Gönder',
      newChat: 'Yeni sohbet başlat',
      cameraPermission: 'Kamera İzni',
      cameraPermissionMessage: 'Fotoğraf çekmek için kamera iznine ihtiyacımız var.',
      grant: 'İzin Ver',
      cancel: 'İptal',
      thinking: 'Düşünüyor...',
      error: 'Hata',
      messageError: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
      authError: 'Mesaj göndermek için giriş yapmanız gerekiyor.',
    },
    en: {
      welcome: 'Welcome to DoktorAi!',
      welcomeMessage: 'Hello! I\'m DoktorAi, here to help you with natural and herbal treatments. How can I assist you?',
      typeMessage: 'Type your message...',
      startRecording: 'Start recording',
      stopRecording: 'Stop recording',
      takePhoto: 'Take photo',
      send: 'Send',
      newChat: 'Start new chat',
      cameraPermission: 'Camera Permission',
      cameraPermissionMessage: 'We need camera permission to take photos.',
      grant: 'Grant',
      cancel: 'Cancel',
      thinking: 'Thinking...',
      error: 'Error',
      messageError: 'Failed to send message. Please try again.',
      authError: 'You need to be logged in to send messages.',
    }
  };

  const t = translations[language];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (currentSession?.messages.length) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentSession?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || loading) {
      console.log('Cannot send message: empty message or loading');
      return;
    }

    if (!user) {
      console.log('Cannot send message: user not authenticated');
      Alert.alert(t.error, t.authError);
      return;
    }

    const messageToSend = message.trim();
    console.log('Preparing to send message:', messageToSend);
    
    // Clear input immediately for better UX
    setMessage('');

    try {
      await sendMessage(messageToSend, 'text');
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(t.error, t.messageError);
      // Restore the message if sending failed
      setMessage(messageToSend);
    }
  };

  const handleVoiceMessage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Info', 'Voice recording is not available on web');
      return;
    }

    if (!isRecording) {
      setIsRecording(true);
      // Implement voice recording logic
    } else {
      setIsRecording(false);
      // Stop recording and process
    }
  };

  const handleCameraCapture = async () => {
    if (!cameraPermission) {
      return;
    }

    if (!cameraPermission.granted) {
      Alert.alert(
        t.cameraPermission,
        t.cameraPermissionMessage,
        [
          { text: t.cancel, style: 'cancel' },
          { text: t.grant, onPress: requestCameraPermission }
        ]
      );
      return;
    }

    setShowCamera(true);
  };

  const takePicture = async () => {
    // Implement camera capture logic
    setShowCamera(false);
  };

  const playAudio = async (audioUrl: string) => {
    if (Platform.OS === 'web') {
      try {
        const audio = new Audio(audioUrl);
        await audio.play();
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLanguage);
  };

  // Debug info
  useEffect(() => {
    console.log('Chat Screen Debug Info:');
    console.log('- User authenticated:', !!user);
    console.log('- Current session:', currentSession?.id);
    console.log('- Messages count:', currentSession?.messages.length || 0);
    console.log('- Loading:', loading);
    console.log('- Language:', language);
  }, [user, currentSession, loading, language]);

  if (showCamera) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera}>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <Camera size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cancelButtonText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Leaf size={24} color="#22C55E" />
            <Text style={styles.logoText}>DoktorAi</Text>
          </View>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={toggleLanguage}
          >
            <Globe size={20} color="#6B7280" />
            <Text style={styles.languageText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {!currentSession?.messages.length ? (
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeIcon}>
              <Leaf size={48} color="#22C55E" />
            </View>
            <Text style={styles.welcomeTitle}>{t.welcome}</Text>
            <Text style={styles.welcomeMessage}>{t.welcomeMessage}</Text>
            
            {/* Debug info for development */}
            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugText}>Debug Info:</Text>
                <Text style={styles.debugText}>User: {user ? 'Authenticated' : 'Not authenticated'}</Text>
                <Text style={styles.debugText}>Session: {currentSession ? currentSession.id : 'None'}</Text>
                <Text style={styles.debugText}>API Key: {process.env.EXPO_PUBLIC_GEMINI_API_KEY ? 'Set' : 'Missing'}</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {currentSession.messages.map((msg, index) => (
              <View 
                key={msg.id || index} 
                style={[
                  styles.messageContainer,
                  msg.type === 'user' ? styles.userMessage : styles.assistantMessage
                ]}
              >
                <View style={[
                  styles.messageBubble,
                  msg.type === 'user' ? styles.userBubble : styles.assistantBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    msg.type === 'user' ? styles.userMessageText : styles.assistantMessageText
                  ]}>
                    {msg.content}
                  </Text>
                  {msg.type === 'assistant' && msg.audio_url && (
                    <TouchableOpacity 
                      style={styles.audioButton}
                      onPress={() => playAudio(msg.audio_url!)}
                    >
                      <Volume2 size={16} color="#22C55E" />
                    </TouchableOpacity>
                  )}
                  {msg.image_url && (
                    <Image source={{ uri: msg.image_url }} style={styles.messageImage} />
                  )}
                </View>
              </View>
            ))}
            {loading && (
              <View style={[styles.messageContainer, styles.assistantMessage]}>
                <View style={[styles.messageBubble, styles.assistantBubble, styles.loadingBubble]}>
                  <Text style={[styles.messageText, styles.assistantMessageText, styles.loadingText]}>
                    {t.thinking}
                  </Text>
                  <View style={styles.loadingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder={t.typeMessage}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
            editable={!loading}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleVoiceMessage}
              disabled={loading}
            >
              {isRecording ? (
                <StopCircle size={24} color="#EF4444" />
              ) : (
                <Mic size={24} color="#6B7280" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCameraCapture}
              disabled={loading}
            >
              <Camera size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sendButton, 
                (!message.trim() || loading) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!message.trim() || loading}
            >
              <Send size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
    marginLeft: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  languageText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22C55E',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  debugInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#22C55E',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loadingBubble: {
    opacity: 0.8,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  assistantMessageText: {
    color: '#374151',
  },
  loadingText: {
    fontStyle: 'italic',
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  audioButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    padding: 4,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    maxHeight: 100,
    paddingVertical: 8,
    textAlignVertical: 'center',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: '#22C55E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 60,
  },
  captureButton: {
    backgroundColor: '#22C55E',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  cancelButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});