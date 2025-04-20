
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import TrackCard from '@/components/TrackCard';
import { YoutubeVideo, getTrendingMusicVideos } from '@/api/youtube';

const LibraryPage = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<YoutubeVideo[]>([]);
  const [recommendations, setRecommendations] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        // For demonstration, we'll use trending videos
        // In a real app, this would be user's history and recommendations
        const videos = await getTrendingMusicVideos(20);
        setRecentlyPlayed(videos.slice(0, 10));
        setRecommendations(videos.slice(10));
      } catch (error) {
        console.error('Error fetching library content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Layout>
      <div className="pb-8">
        <h1 className="text-3xl font-bold mb-6">Your Library</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recently Played</h2>
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
          ) : recentlyPlayed.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recentlyPlayed.map((video) => (
                <TrackCard key={video.id} track={video} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 p-4">No recently played tracks</p>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
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
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.map((video) => (
                <TrackCard key={video.id} track={video} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 p-4">No recommendations available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LibraryPage;
