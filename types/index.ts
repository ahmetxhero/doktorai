export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  language_preference: 'tr' | 'en';
  is_premium: boolean;
  premium_expires_at?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  type: 'user' | 'assistant';
  input_type: 'text' | 'voice' | 'image';
  image_url?: string;
  audio_url?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
}