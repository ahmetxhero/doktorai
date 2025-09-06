import { createClient } from '@supabase/supabase-js';
import { User, ChatMessage, ChatSession } from '../types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation redirect
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  verifyEmail: async (email: string, code: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup'
    });
    return { data, error };
  },

  resendVerification: async (email: string) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation redirect
      }
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },
};

export const database = {
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateUserProfile: async (userId: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    return { data, error };
  },

  getChatSessions: async (userId: string) => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        *,
        messages:chat_messages(*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  createChatSession: async (userId: string, title: string) => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title,
      })
      .select()
      .single();
    return { data, error };
  },

  getChatMessages: async (sessionId: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  addChatMessage: async (sessionId: string, message: Omit<ChatMessage, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        user_id: message.user_id,
        content: message.content,
        type: message.type,
        input_type: message.input_type,
        image_url: message.image_url,
        audio_url: message.audio_url,
      })
      .select()
      .single();
    return { data, error };
  },
};