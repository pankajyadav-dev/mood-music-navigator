
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import TrackCard from '@/components/TrackCard';
import { Button } from '@/components/ui/button';
import { getMoodBasedVideos, YoutubeVideo } from '@/api/youtube';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Play, Shuffle } from 'lucide-react';

interface MoodData {
  title: string;
  description: string;
  color: string;
}

const moodData: Record<string, MoodData> = {
  happy: {
    title: 'Happy',
    description: 'Upbeat tunes to brighten your day and keep the good vibes flowing.',
    color: 'happy',
  },
  sad: {
    title: 'Sad',
    description: 'Emotional tracks that understand how you feel and help process those feelings.',
    color: 'sad',
  },
  energetic: {
    title: 'Energetic',
    description: 'High-energy songs to power your workout or get your day started right.',
    color: 'energetic',
  },
  chill: {
    title: 'Chill',
    description: 'Relaxed beats to help you unwind and take it easy.',
    color: 'chill',
  },
  romantic: {
    title: 'Romantic',
    description: 'Love songs and soulful melodies for those special moments.',
    color: 'romantic',
  },
  focus: {
    title: 'Focus',
    description: 'Concentration-enhancing tracks to help you stay in the zone.',
    color: 'focus',
  },
};

const MoodPage = () => {
  const { mood = 'happy' } = useParams<{ mood: string }>();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentVideo, addToQueue } = useMusicPlayer();
  const currentMood = moodData[mood.toLowerCase()] || moodData.happy;

  useEffect(() => {
    const fetchMoodVideos = async () => {
      setIsLoading(true);
      try {
        const videos = await getMoodBasedVideos(mood.toLowerCase(), 20);
        setVideos(videos);
      } catch (error) {
        console.error(`Error fetching ${mood} videos:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodVideos();
  }, [mood]);

  const playAll = () => {
    if (videos.length > 0) {
      // Play first video and add rest to queue
      setCurrentVideo(videos[0]);
      videos.slice(1).forEach(video => addToQueue(video));
    }
  };

  const shufflePlay = () => {
    if (videos.length > 0) {
      // Shuffle videos
      const shuffled = [...videos].sort(() => Math.random() - 0.5);
      // Play first video and add rest to queue
      setCurrentVideo(shuffled[0]);
      shuffled.slice(1).forEach(video => addToQueue(video));
    }
  };

  return (
    <Layout>
      <div className="pb-8">
        <div 
          className="rounded-lg p-8 mb-8"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,0.7), transparent), linear-gradient(to bottom, var(--tw-colors-mood-${currentMood.color})/20, transparent)`
          }}
        >
          <span className={`inline-block mb-3 px-2 py-1 rounded text-xs bg-mood-${currentMood.color} text-black font-semibold`}>
            MOOD PLAYLIST
          </span>
          <h1 className="text-5xl font-bold mb-4">{currentMood.title} Mood</h1>
          <p className="text-gray-300 mb-8 max-w-xl">
            {currentMood.description}
          </p>
          
          <div className="flex gap-4">
            <Button 
              onClick={playAll}
              className={`bg-mood-${currentMood.color} hover:bg-mood-${currentMood.color}/90 text-black`}
            >
              <Play size={18} className="mr-2" /> Play All
            </Button>
            <Button 
              onClick={shufflePlay}
              variant="outline"
              className="border-white/30 hover:bg-white/10"
            >
              <Shuffle size={18} className="mr-2" /> Shuffle
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#282828] rounded-md aspect-square mb-3"></div>
                <div className="h-4 bg-[#282828] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#282828] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {videos.map((video) => (
              <TrackCard key={video.id} track={video} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MoodPage;
