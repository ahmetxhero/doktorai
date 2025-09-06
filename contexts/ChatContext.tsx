import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatSession, ChatMessage } from '../types';
import { database } from '../lib/supabase';
import { GeminiService } from '../lib/gemini';
import { ElevenLabsService } from '../lib/elevenlabs';
import { useAuth } from './AuthContext';

interface ChatContextType {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  loading: boolean;
  sendMessage: (content: string, type: 'text' | 'voice' | 'image', imageUrl?: string) => Promise<void>;
  createNewSession: (title: string) => Promise<void>;
  selectSession: (session: ChatSession) => void;
  playAudio: (audioUrl: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, language } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);

  const geminiService = new GeminiService();
  const elevenLabsService = new ElevenLabsService();

  useEffect(() => {
    if (user) {
      loadChatSessions();
    }
  }, [user]);

  const loadChatSessions = async () => {
    if (!user) return;

    try {
      console.log('Loading chat sessions for user:', user.id);
      const { data, error } = await database.getChatSessions(user.id);
      if (error) {
        console.error('Error loading chat sessions:', error);
        return;
      }
      
      console.log('Loaded sessions:', data);
      
      // Transform the data to match our ChatSession interface
      const transformedSessions = (data || []).map(session => ({
        ...session,
        messages: session.messages || []
      }));
      
      setSessions(transformedSessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const createNewSession = async (title: string) => {
    if (!user) {
      console.error('Cannot create session: user not authenticated');
      return;
    }

    try {
      console.log('Creating new chat session:', title);
      const { data, error } = await database.createChatSession(user.id, title);
      if (error) {
        console.error('Error creating chat session:', error);
        throw error;
      }
      
      console.log('Created session:', data);
      
      const newSession: ChatSession = {
        ...data,
        messages: [],
      };
      
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      
      return newSession;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  };

  const selectSession = async (session: ChatSession) => {
    if (!user) return;

    try {
      console.log('Selecting session:', session.id);
      // Load messages for the selected session
      const { data, error } = await database.getChatMessages(session.id);
      if (error) {
        console.error('Error loading chat messages:', error);
        return;
      }

      console.log('Loaded messages for session:', data);

      const sessionWithMessages: ChatSession = {
        ...session,
        messages: data || []
      };

      setCurrentSession(sessionWithMessages);
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };

  const sendMessage = async (content: string, inputType: 'text' | 'voice' | 'image', imageUrl?: string) => {
    if (!user) {
      console.error('Cannot send message: user not authenticated');
      return;
    }

    if (!currentSession) {
      console.log('No current session, creating new one...');
      const newSession = await createNewSession('New Chat');
      if (!newSession) {
        console.error('Failed to create new session');
        return;
      }
    }

    const sessionToUse = currentSession || sessions[0];
    if (!sessionToUse) {
      console.error('No session available to send message');
      return;
    }

    setLoading(true);
    console.log('Sending message:', { content, inputType, sessionId: sessionToUse.id });

    try {
      // Add user message to database
      const userMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
        session_id: sessionToUse.id,
        user_id: user.id,
        content,
        type: 'user',
        input_type: inputType,
        image_url: imageUrl,
      };

      console.log('Adding user message to database:', userMessage);

      const { data: userMessageData, error: userMessageError } = await database.addChatMessage(
        sessionToUse.id,
        userMessage
      );

      if (userMessageError) {
        console.error('Error adding user message:', userMessageError);
        throw userMessageError;
      }

      console.log('User message added:', userMessageData);

      // Update current session with user message
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, userMessageData]
      } : null);

      // Generate AI response
      console.log('Generating AI response...');
      let aiResponse: string;
      try {
        if (inputType === 'image' && imageUrl) {
          // For image analysis, we need to convert image to base64
          console.log('Processing image for analysis...');
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          aiResponse = await geminiService.analyzeImage(base64.split(',')[1], content, language);
        } else {
          aiResponse = await geminiService.generateResponse(content, language);
        }
        console.log('AI response generated:', aiResponse);
      } catch (error) {
        console.error('Error generating AI response:', error);
        aiResponse = language === 'tr' 
          ? 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin. ÖNEMLI UYARI: Bu öneriler yalnızca genel bilgi amaçlıdır ve profesyonel tıbbi tavsiyenin yerini tutmaz.'
          : 'Sorry, I cannot respond right now. Please try again later. IMPORTANT DISCLAIMER: These suggestions are for general information only and do not replace professional medical advice.';
      }

      // Generate audio response
      console.log('Generating audio response...');
      let audioUrl: string | undefined;
      try {
        audioUrl = await elevenLabsService.textToSpeech(aiResponse, language);
        if (audioUrl) {
          console.log('Audio generated successfully');
        } else {
          console.log('Audio generation skipped (no API key or error)');
        }
      } catch (error) {
        console.error('Error generating audio:', error);
        // Continue without audio if TTS fails
      }

      // Add AI message to database
      const aiMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
        session_id: sessionToUse.id,
        user_id: user.id,
        content: aiResponse,
        type: 'assistant',
        input_type: 'text',
        audio_url: audioUrl,
      };

      console.log('Adding AI message to database:', aiMessage);

      const { data: aiMessageData, error: aiMessageError } = await database.addChatMessage(
        sessionToUse.id,
        aiMessage
      );

      if (aiMessageError) {
        console.error('Error adding AI message:', aiMessageError);
        throw aiMessageError;
      }

      console.log('AI message added:', aiMessageData);

      // Update current session with AI message
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiMessageData]
      } : null);

      // Auto-play audio response if available
      if (audioUrl) {
        try {
          console.log('Playing audio response...');
          await playAudio(audioUrl);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }

    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (audioUrl: string) => {
    try {
      // Web audio playback
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const value = {
    sessions,
    currentSession,
    loading,
    sendMessage,
    createNewSession,
    selectSession,
    playAudio,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}