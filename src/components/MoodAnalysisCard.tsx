
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MoodAnalysisResult, detectMood, getRandomMood } from '@/api/gemini';
import { toast } from 'sonner';

const MoodAnalysisCard: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await detectMood(text);
      toast.success(`We detected you're feeling ${result.mood}`);
      navigate(`/mood/${result.mood.toLowerCase()}`);
    } catch (error) {
      console.error('Error detecting mood:', error);
      toast.error('Failed to analyze mood. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRandomMood = () => {
    const mood = getRandomMood();
    toast.success(`Let's try a ${mood.mood} mood`);
    navigate(`/mood/${mood.mood.toLowerCase()}`);
  };

  return (
    <div className="rounded-xl bg-[#1A1A1A] p-6 shadow-lg border border-[#282828]">
      <h2 className="text-xl font-bold mb-4">How are you feeling today?</h2>
      <p className="text-gray-400 mb-4">
        Tell us how you're feeling, and we'll recommend music that matches your mood.
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Example: I'm feeling a bit down today and need some uplifting music..."
        className="min-h-24 mb-4 bg-[#282828] border-[#383838] resize-none focus:border-mood-happy"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleAnalyze} 
          className="bg-mood-happy hover:bg-mood-happy/90 text-black" 
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze My Mood'}
        </Button>
        <Button 
          onClick={handleRandomMood}
          variant="outline" 
          className="border-[#383838] hover:bg-[#282828]"
        >
          I'm Feeling Lucky
        </Button>
      </div>
    </div>
  );
};

export default MoodAnalysisCard;
