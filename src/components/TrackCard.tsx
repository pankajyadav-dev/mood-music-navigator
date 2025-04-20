
import React from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Play, Pause, Plus } from 'lucide-react';
import { YoutubeVideo } from '@/api/youtube';

interface TrackCardProps {
  track: YoutubeVideo;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const { currentVideo, isPlaying, togglePlay, setCurrentVideo, addToQueue } = useMusicPlayer();
  const isCurrentTrack = currentVideo?.id === track.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      setCurrentVideo(track);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
  };

  return (
    <div 
      className="bg-[#181818] rounded-md p-4 hover:bg-[#282828] transition-colors group cursor-pointer"
      onClick={() => setCurrentVideo(track)}
    >
      <div className="relative mb-4">
        <img 
          src={track.thumbnail} 
          alt={track.title} 
          className="w-full aspect-square object-cover rounded-md shadow-md"
        />
        <button 
          className={`
            absolute right-2 bottom-2 rounded-full p-3
            bg-mood-happy text-black
            opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 
            transition-all duration-200 shadow-lg
          `}
          onClick={handlePlay}
        >
          {isCurrentTrack && isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>
      <h3 className="font-semibold text-sm truncate mb-1" title={track.title}>
        {track.title}
      </h3>
      <p className="text-gray-400 text-xs truncate" title={track.channelTitle}>
        {track.channelTitle}
      </p>
      <button 
        className="mt-3 text-gray-400 text-xs flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleAddToQueue}
      >
        <Plus size={14} className="mr-1" />
        Add to queue
      </button>
    </div>
  );
};

export default TrackCard;
