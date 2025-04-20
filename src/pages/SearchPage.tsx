
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchBox from '@/components/SearchBox';
import TrackCard from '@/components/TrackCard';
import { searchYoutubeVideos, YoutubeVideo } from '@/api/youtube';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchVideos = async () => {
      if (!query.trim()) {
        setVideos([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchYoutubeVideos(query, 20);
        setVideos(results);
      } catch (error) {
        console.error('Error searching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchVideos();
  }, [query]);

  return (
    <Layout>
      <div className="pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          <SearchBox />
        </div>

        {query && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">
              {isLoading ? 'Searching...' : `Results for "${query}"`}
            </h2>
            
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
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {videos.map((video) => (
                  <TrackCard key={video.id} track={video} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12">
                <p className="text-gray-400">No results found for "{query}"</p>
                <p className="text-sm mt-2">Try different keywords or check your spelling</p>
              </div>
            )}
          </div>
        )}

        {!query && !isLoading && (
          <div className="text-center p-12">
            <p className="text-gray-400">Enter a search term to find music</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
