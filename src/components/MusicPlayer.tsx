
import React, { useState, useCallback } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Slider } from "@/components/ui/slider";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Shuffle, Repeat, Repeat1, Music
} from 'lucide-react';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MusicPlayer: React.FC = () => {
  const { 
    currentVideo, 
    isPlaying, 
    volume, 
    progress, 
    duration, 
    shuffle,
    repeat,
    togglePlay, 
    playNext, 
    playPrevious, 
    setVolume, 
    setProgress,
    toggleShuffle,
    toggleRepeat
  } = useMusicPlayer();
  const [showVolume, setShowVolume] = useState(false);

  const handleProgressChange = useCallback((value: number[]) => {
    setProgress(value[0]);
  }, [setProgress]);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0]);
  }, [setVolume]);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 50) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] p-4 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Current song info */}
        <div className="flex items-center w-1/4">
          {currentVideo ? (
            <>
              <div className="h-12 w-12 bg-gray-700 rounded overflow-hidden mr-3">
                <img 
                  src={currentVideo.thumbnail} 
                  alt={currentVideo.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium truncate">{currentVideo.title}</p>
                <p className="text-xs text-gray-400 truncate">{currentVideo.channelTitle}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center text-gray-400">
              <Music size={20} className="mr-2" />
              <span>No track selected</span>
            </div>
          )}
        </div>
        
        {/* Player controls */}
        <div className="flex flex-col items-center justify-center w-1/2">
          <div className="flex items-center mb-2">
            <button 
              onClick={toggleShuffle}
              className={`mr-4 p-2 rounded-full ${shuffle ? 'text-mood-happy' : 'text-gray-400'} hover:text-white`}
            >
              <Shuffle size={16} />
            </button>
            <button onClick={playPrevious} className="mr-4 text-white p-2 hover:bg-[#282828] rounded-full">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay} 
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={playNext} className="ml-4 text-white p-2 hover:bg-[#282828] rounded-full">
              <SkipForward size={20} />
            </button>
            <button 
              onClick={toggleRepeat}
              className={`ml-4 p-2 rounded-full ${repeat ? 'text-mood-happy' : 'text-gray-400'} hover:text-white`}
            >
              {repeat ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>
          
          <div className="flex items-center w-full max-w-md">
            <span className="text-xs text-gray-400 w-10">{formatTime(progress)}</span>
            <div className="flex-grow mx-2">
              <Slider
                value={[progress]}
                min={0}
                max={duration || 100}
                step={1}
                onValueChange={handleProgressChange}
                className="cursor-pointer"
              />
            </div>
            <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Volume control */}
        <div className="w-1/4 flex justify-end">
          <div className="relative flex items-center">
            <button 
              className="text-gray-400 hover:text-white p-2"
              onClick={() => setShowVolume(!showVolume)}
              onMouseEnter={() => setShowVolume(true)}
            >
              {getVolumeIcon()}
            </button>
            {showVolume && (
              <div 
                className="absolute right-0 bottom-10 bg-[#282828] p-3 rounded-lg w-32"
                onMouseLeave={() => setShowVolume(false)}
              >
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
