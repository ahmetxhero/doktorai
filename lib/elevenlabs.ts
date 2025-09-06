export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY || '';
  }

  async textToSpeech(text: string, language: 'tr' | 'en'): Promise<string | undefined> {
    // If no API key is provided, return undefined (no audio)
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not provided, skipping audio generation');
      return undefined;
    }

    try {
      // Use different voice IDs for different languages
      const voiceId = language === 'tr' ? 'IgiCa6883ksPGir0tfNK' : 'pBZVCk298iJlHAcHQwLr';
      
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        console.error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
        return undefined;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      return undefined;
    }
  }
}