export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private visionUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY!;
    if (!this.apiKey) {
      console.error('EXPO_PUBLIC_GEMINI_API_KEY is not set in environment variables');
    }
  }

  private createHealthSafePrompt(userInput: string, language: 'tr' | 'en'): string {
    const disclaimer = language === 'tr' 
      ? "ÖNEMLI UYARI: Bu öneriler yalnızca genel bilgi amaçlıdır ve profesyonel tıbbi tavsiyenin yerini tutmaz. Herhangi bir sağlık sorunu için mutlaka nitelikli bir sağlık uzmanına danışın."
      : "IMPORTANT DISCLAIMER: These suggestions are for general information only and do not replace professional medical advice. Always consult with a qualified healthcare professional for any health concerns.";

    const systemPrompt = language === 'tr'
      ? `Sen DoktorAi'sin, doğal ve bitkisel tedavi önerilerinde bulunan bir asistan. Kullanıcının sorularına sadece genel bilgi ve geleneksel bitki kullanımı hakkında bilgi ver. Kesinlikle teşhis koymayacaksın ve tıbbi tavsiye vermeyeceksin. Her cevabının sonunda şu uyarıyı ekle: "${disclaimer}"`
      : `You are DoktorAi, an assistant that provides natural and herbal treatment suggestions. Only provide general information about traditional plant uses. Never diagnose or give medical advice. Always end your response with: "${disclaimer}"`;

    return `${systemPrompt}\n\nKullanıcı sorusu: ${userInput}`;
  }

  async generateResponse(userInput: string, language: 'tr' | 'en'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    try {
      console.log('Sending request to Gemini API...');
      const prompt = this.createHealthSafePrompt(userInput, language);
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', JSON.stringify(data, null, 2));
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response from Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('Generated response:', responseText);
      return responseText;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Return a fallback response in the appropriate language
      const fallbackResponse = language === 'tr'
        ? 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin. ÖNEMLI UYARI: Bu öneriler yalnızca genel bilgi amaçlıdır ve profesyonel tıbbi tavsiyenin yerini tutmaz.'
        : 'Sorry, I cannot respond right now. Please try again later. IMPORTANT DISCLAIMER: These suggestions are for general information only and do not replace professional medical advice.';
      
      return fallbackResponse;
    }
  }

  async analyzeImage(imageBase64: string, userQuestion: string, language: 'tr' | 'en'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    try {
      console.log('Sending image analysis request to Gemini API...');
      const prompt = this.createHealthSafePrompt(userQuestion, language);
      
      const requestBody = {
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(`${this.visionUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Image analysis response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini Vision API error response:', errorText);
        throw new Error(`Gemini Vision API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini Vision API response:', JSON.stringify(data, null, 2));
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Invalid vision response structure:', data);
        throw new Error('Invalid response from Gemini Vision API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini image analysis error:', error);
      
      // Return a fallback response in the appropriate language
      const fallbackResponse = language === 'tr'
        ? 'Üzgünüm, görüntüyü analiz edemiyorum. Lütfen daha sonra tekrar deneyin. ÖNEMLI UYARI: Bu öneriler yalnızca genel bilgi amaçlıdır ve profesyonel tıbbi tavsiyenin yerini tutmaz.'
        : 'Sorry, I cannot analyze the image right now. Please try again later. IMPORTANT DISCLAIMER: These suggestions are for general information only and do not replace professional medical advice.';
      
      return fallbackResponse;
    }
  }
}