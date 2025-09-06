import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, auth } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  verifyEmail: (email: string, code: string) => Promise<{ error?: any }>;
  resendVerification: (email: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  language: 'tr' | 'en';
  setLanguage: (lang: 'tr' | 'en') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthProvider: Initial session check', { session: !!session, error });
      
      if (error) {
        console.error('AuthProvider: Error getting session:', error);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log('AuthProvider: Found existing session for user:', session.user.id);
        fetchUserProfile(session.user.id);
      } else {
        console.log('AuthProvider: No existing session found');
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed', { event, session: !!session });
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('AuthProvider: User signed in:', session.user.id);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthProvider: User signed out');
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('AuthProvider: Token refreshed for user:', session.user.id);
          await fetchUserProfile(session.user.id);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthProvider: Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthProvider: Error fetching user profile:', error);
        
        // If user doesn't exist in our users table, this might be a new user
        // The trigger should have created the profile, but let's check auth.users
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          console.log('AuthProvider: User exists in auth but not in users table, creating profile...');
          
          // Create user profile manually
          const newUserProfile = {
            id: authUser.user.id,
            email: authUser.user.email!,
            language_preference: 'tr',
            is_premium: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert(newUserProfile)
            .select()
            .single();

          if (createError) {
            console.error('AuthProvider: Error creating user profile:', createError);
            setLoading(false);
            return;
          }

          console.log('AuthProvider: Created user profile:', createdUser);
          setUser(createdUser);
          setLanguage(createdUser.language_preference || 'tr');
        }
        
        setLoading(false);
        return;
      }

      console.log('AuthProvider: User profile fetched successfully:', data);
      setUser(data);
      setLanguage(data.language_preference || 'tr');
    } catch (error) {
      console.error('AuthProvider: Unexpected error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting sign in for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        console.error('AuthProvider: Sign in error:', error);
        setLoading(false);
        return { error };
      }

      console.log('AuthProvider: Sign in successful:', data);
      // Don't set loading to false here, let the auth state change handler do it
      return {};
    } catch (error) {
      console.error('AuthProvider: Unexpected sign in error:', error);
      setLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting sign up for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await auth.signUp(email, password);
      
      if (error) {
        console.error('AuthProvider: Sign up error:', error);
        setLoading(false);
        return { error };
      }

      console.log('AuthProvider: Sign up successful:', data);
      setLoading(false);
      return {};
    } catch (error) {
      console.error('AuthProvider: Unexpected sign up error:', error);
      setLoading(false);
      return { error };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    console.log('AuthProvider: Attempting email verification for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await auth.verifyEmail(email, code);
      
      if (error) {
        console.error('AuthProvider: Email verification error:', error);
        setLoading(false);
        return { error };
      }

      console.log('AuthProvider: Email verification successful:', data);
      setLoading(false);
      return {};
    } catch (error) {
      console.error('AuthProvider: Unexpected email verification error:', error);
      setLoading(false);
      return { error };
    }
  };

  const resendVerification = async (email: string) => {
    console.log('AuthProvider: Attempting to resend verification for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await auth.resendVerification(email);
      
      if (error) {
        console.error('AuthProvider: Resend verification error:', error);
        setLoading(false);
        return { error };
      }

      console.log('AuthProvider: Resend verification successful:', data);
      setLoading(false);
      return {};
    } catch (error) {
      console.error('AuthProvider: Unexpected resend verification error:', error);
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Attempting sign out');
    setLoading(true);
    
    try {
      const { error } = await auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      } else {
        console.log('AuthProvider: Sign out successful');
      }
    } catch (error) {
      console.error('AuthProvider: Unexpected sign out error:', error);
    }
    
    // Always clean up state on sign out attempt
    setUser(null);
    setLoading(false);
  };

  const updateLanguage = async (lang: 'tr' | 'en') => {
    console.log('AuthProvider: Updating language to:', lang);
    setLanguage(lang);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ language_preference: lang, updated_at: new Date().toISOString() })
          .eq('id', user.id);

        if (error) {
          console.error('AuthProvider: Error updating language preference:', error);
        } else {
          console.log('AuthProvider: Language preference updated successfully');
          // Update local user state
          setUser(prev => prev ? { ...prev, language_preference: lang } : null);
        }
      } catch (error) {
        console.error('AuthProvider: Unexpected error updating language:', error);
      }
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    verifyEmail,
    resendVerification,
    signOut,
    language,
    setLanguage: updateLanguage,
  };

  console.log('AuthProvider: Current state', { 
    user: !!user, 
    loading, 
    language,
    userId: user?.id 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}