
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { YoutubeVideo, getTrendingMusicVideos } from '@/api/youtube';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Clock3 } from 'lucide-react';

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const PlaylistPage = () => {
  const { id } = useParams<{ id: string }>();
  const [playlistVideos, setPlaylistVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentVideo, addToQueue, currentVideo, isPlaying, togglePlay } = useMusicPlayer();

  useEffect(() => {
    const fetchPlaylist = async () => {
      setIsLoading(true);
      try {
        // For demonstration purposes, we'll use trending videos
        // In a real app, this would fetch the specific playlist
        const videos = await getTrendingMusicVideos(15);
        setPlaylistVideos(videos);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handlePlayAll = () => {
    if (playlistVideos.length > 0) {
      setCurrentVideo(playlistVideos[0]);
      playlistVideos.slice(1).forEach(video => addToQueue(video));
    }
  };

  const handleTrackPlay = (video: YoutubeVideo) => {
    if (currentVideo?.id === video.id) {
      togglePlay();
    } else {
      setCurrentVideo(video);
    }
  };

  return (
    <Layout>
      <div className="pb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-end mb-8">
          <div className="w-48 h-48 bg-[#282828] rounded-md shadow-lg overflow-hidden flex-shrink-0">
            {id === 'liked' ? (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-3xl">
                {id?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div>
            <p className="text-xs uppercase font-bold text-gray-400">Playlist</p>
            <h1 className="text-4xl font-extrabold my-2">
              {id === 'liked' ? 'Liked Songs' : 'My Playlist'}
            </h1>
            <p className="text-sm text-gray-400">
              {playlistVideos.length} songs
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <Button 
            onClick={handlePlayAll} 
            disabled={playlistVideos.length === 0}
            className="bg-mood-happy hover:bg-mood-happy/90 text-black"
          >
            <Play size={16} className="mr-2" /> Play All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-[#282828] h-16 rounded-md"></div>
            ))}
          </div>
        ) : playlistVideos.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-gray-400 text-sm border-b border-[#282828]">
              <div>#</div>
              <div>TITLE</div>
              <div className="hidden md:block">ARTIST</div>
              <div className="flex justify-end items-center">
                <Clock3 size={14} />
              </div>
            </div>
            
            {playlistVideos.map((video, index) => {
              const isCurrentTrack = currentVideo?.id === video.id;
              return (
                <div 
                  key={video.id}
                  onClick={() => handleTrackPlay(video)}
                  className={`grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_2fr_1fr] gap-4 p-2 rounded-md ${
                    isCurrentTrack ? 'bg-white/10' : 'hover:bg-white/5'
                  } cursor-pointer`}
                >
                  <div className="flex items-center justify-center">
                    {isCurrentTrack && isPlaying ? (
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-mood-happy animate-pulse"></div>
                      </div>
                    ) : (
                      <span className={`${isCurrentTrack ? 'text-mood-happy' : 'text-gray-400'}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center overflow-hidden">
                    <div className="h-10 w-10 flex-shrink-0 bg-[#282828] rounded overflow-hidden mr-3">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className={`text-sm font-medium truncate ${isCurrentTrack ? 'text-mood-happy' : ''}`}>
                        {video.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block truncate text-sm text-gray-400">
                    {video.channelTitle}
                  </div>
                  
                  <div className="flex items-center justify-end text-xs text-gray-400">
                    {formatDuration(Math.floor(Math.random() * 300) + 120)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">This playlist is empty</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PlaylistPage;
