
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { YoutubeVideo } from '@/api/youtube';

interface MusicPlayerContextType {
  currentVideo: YoutubeVideo | null;
  queue: YoutubeVideo[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  setCurrentVideo: (video: YoutubeVideo) => void;
  addToQueue: (video: YoutubeVideo) => void;
  removeFromQueue: (videoId: string) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState<YoutubeVideo | null>(null);
  const [queue, setQueue] = useState<YoutubeVideo[]>([]);
  const [history, setHistory] = useState<YoutubeVideo[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // Add video to queue
  const addToQueue = useCallback((video: YoutubeVideo) => {
    setQueue(prev => [...prev, video]);
  }, []);

  // Remove video from queue
  const removeFromQueue = useCallback((videoId: string) => {
    setQueue(prev => prev.filter(video => video.id !== videoId));
  }, []);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Set current video and add previous one to history
  const updateCurrentVideo = useCallback((video: YoutubeVideo) => {
    if (currentVideo) {
      setHistory(prev => [currentVideo, ...prev].slice(0, 50));
    }
    setCurrentVideo(video);
    setProgress(0);
    setIsPlaying(true);
  }, [currentVideo]);

  // Play next video
  const playNext = useCallback(() => {
    if (queue.length > 0) {
      if (shuffle) {
        const randomIndex = Math.floor(Math.random() * queue.length);
        const nextVideo = queue[randomIndex];
        updateCurrentVideo(nextVideo);
        setQueue(prev => prev.filter((_, index) => index !== randomIndex));
      } else {
        const nextVideo = queue[0];
        updateCurrentVideo(nextVideo);
        setQueue(prev => prev.slice(1));
      }
    } else if (repeat && currentVideo) {
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [queue, shuffle, repeat, currentVideo, updateCurrentVideo]);

  // Play previous video
  const playPrevious = useCallback(() => {
    if (progress > 3) {
      setProgress(0);
    } else if (history.length > 0) {
      const prevVideo = history[0];
      setCurrentVideo(prevVideo);
      setHistory(prev => prev.slice(1));
      setProgress(0);
      setIsPlaying(true);
    }
  }, [history, progress]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);

  // Effect to auto play next when current song ends
  useEffect(() => {
    if (progress >= duration && duration > 0) {
      playNext();
    }
  }, [progress, duration, playNext]);

  // Save volume to localStorage
  useEffect(() => {
    localStorage.setItem('music-player-volume', volume.toString());
  }, [volume]);

  // Load volume from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('music-player-volume');
    if (savedVolume) {
      setVolume(parseInt(savedVolume, 10));
    }
  }, []);

  const value = {
    currentVideo,
    queue,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    setCurrentVideo: updateCurrentVideo,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playNext,
    playPrevious,
    togglePlay,
    setVolume,
    setProgress,
    setDuration,
    toggleShuffle,
    toggleRepeat,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
