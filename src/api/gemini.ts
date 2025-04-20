
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface MoodAnalysisResult {
  mood: string;
  confidence: number;
  relatedGenres: string[];
  colorTheme: string;
}

// Predefined moods with their attributes
const moods: Record<string, MoodAnalysisResult> = {
  happy: {
    mood: 'Happy',
    confidence: 0.9,
    relatedGenres: ['Pop', 'Dance', 'Electronic'],
    colorTheme: 'happy',
  },
  sad: {
    mood: 'Sad',
    confidence: 0.9,
    relatedGenres: ['Ballad', 'Indie', 'Classical'],
    colorTheme: 'sad',
  },
  energetic: {
    mood: 'Energetic',
    confidence: 0.9,
    relatedGenres: ['Rock', 'EDM', 'Hip Hop'],
    colorTheme: 'energetic',
  },
  chill: {
    mood: 'Chill',
    confidence: 0.9,
    relatedGenres: ['Lo-fi', 'Ambient', 'Jazz'],
    colorTheme: 'chill',
  },
  romantic: {
    mood: 'Romantic',
    confidence: 0.9,
    relatedGenres: ['R&B', 'Soul', 'Acoustic'],
    colorTheme: 'romantic',
  },
  focus: {
    mood: 'Focus',
    confidence: 0.9,
    relatedGenres: ['Instrumental', 'Classical', 'Ambient'],
    colorTheme: 'focus',
  },
};

// List of available moods
export const availableMoods = Object.keys(moods).map(key => moods[key]);

// Detect mood from text input
export const detectMood = async (text: string): Promise<MoodAnalysisResult> => {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyDZCTMU4v0qQRK11ilgF3LfLcUsj7Oppno');

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096,
      }
    });

    const prompt = `Analyze the following text and determine the mood. 
    Return only one of these moods: Happy, Sad, Energetic, Chill, Romantic, Focus.
    Text: "${text}"`;

    let attempts = 0;
    const maxAttempts = 3;
    let detectedMood = '';

    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        detectedMood = response.text().trim().toLowerCase();
        
        if (detectedMood && Object.keys(moods).includes(detectedMood)) {
          return moods[detectedMood];
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        attempts++;
        console.error(`Error detecting mood on attempt ${attempts}/${maxAttempts}:`, err);
        
        if (attempts >= maxAttempts) {
          throw err;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    // Fallback to keyword matching if AI detection fails
    const lowerText = text.toLowerCase();

    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
      return moods.happy;
    } else if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('blue')) {
      return moods.sad;
    } else if (lowerText.includes('energetic') || lowerText.includes('pumped') || lowerText.includes('workout')) {
      return moods.energetic;
    } else if (lowerText.includes('chill') || lowerText.includes('relax') || lowerText.includes('peaceful')) {
      return moods.chill;
    } else if (lowerText.includes('love') || lowerText.includes('romantic') || lowerText.includes('date')) {
      return moods.romantic;
    } else if (lowerText.includes('focus') || lowerText.includes('concentrate') || lowerText.includes('study')) {
      return moods.focus;
    }

    return moods.happy; // Default fallback
  } catch (error) {
    console.error('Error detecting mood:', error);
    return moods.happy; // Default fallback
  }
};

// Random mood for demo purposes
export const getRandomMood = (): MoodAnalysisResult => {
  const moodKeys = Object.keys(moods);
  const randomKey = moodKeys[Math.floor(Math.random() * moodKeys.length)];
  return moods[randomKey];
};
