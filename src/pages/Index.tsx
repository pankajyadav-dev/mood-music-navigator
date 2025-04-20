
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TrackCard from '@/components/TrackCard';
import MoodAnalysisCard from '@/components/MoodAnalysisCard';
import { getTrendingMusicVideos, YoutubeVideo } from '@/api/youtube';
import { availableMoods } from '@/api/gemini';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [trendingVideos, setTrendingVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      setIsLoading(true);
      try {
        const videos = await getTrendingMusicVideos(10);
        setTrendingVideos(videos);
      } catch (error) {
        console.error('Error fetching trending videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  const handleMoodClick = (mood: string) => {
    navigate(`/mood/${mood.toLowerCase()}`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-6">Welcome to MoodMusic</h1>
          <p className="text-gray-400 mb-8 max-w-2xl">
            Discover music based on your mood. Tell us how you're feeling, and we'll find the perfect tracks for you.
          </p>
          
          <MoodAnalysisCard />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Mood</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {availableMoods.map((mood) => (
              <div 
                key={mood.mood}
                onClick={() => handleMoodClick(mood.mood)}
                className={`mood-card rounded-lg p-4 cursor-pointer bg-[#1A1A1A] hover:bg-[#282828] border-l-4 border-mood-${mood.colorTheme}`}
              >
                <h3 className="font-semibold">{mood.mood}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {mood.relatedGenres[0]}, {mood.relatedGenres[1]}...
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Trending Right Now</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#282828] rounded-md aspect-square mb-3"></div>
                  <div className="h-4 bg-[#282828] rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#282828] rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {trendingVideos.map((video) => (
                <TrackCard key={video.id} track={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
