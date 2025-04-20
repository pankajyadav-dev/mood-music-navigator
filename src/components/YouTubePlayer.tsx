
import React, { useEffect, useRef } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiLoaded = false;

const YouTubePlayer: React.FC = () => {
  const playerRef = useRef<any>(null);
  const { 
    currentVideo, 
    isPlaying, 
    volume, 
    progress, 
    setProgress, 
    setDuration, 
    playNext 
  } = useMusicPlayer();
  
  // Initialize YouTube API
  useEffect(() => {
    if (!apiLoaded) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        apiLoaded = true;
        initPlayer();
      };
    } else {
      initPlayer();
    }
    
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Initialize player
  const initPlayer = () => {
    if (window.YT && window.YT.Player && currentVideo?.id) {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: currentVideo.id,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          rel: 0
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    }
  };

  // Handle player ready event
  const onPlayerReady = (event: any) => {
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  // Handle player state changes
  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      playNext();
    }
    
    if (event.data === window.YT.PlayerState.PLAYING) {
      setDuration(event.target.getDuration());
      startProgressTimer();
    }
  };

  // Handle player errors
  const onPlayerError = (event: any) => {
    console.error('YouTube player error:', event.data);
    playNext();
  };

  // Update player when current video changes
  useEffect(() => {
    if (playerRef.current && currentVideo?.id) {
      playerRef.current.loadVideoById(currentVideo.id);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    } else if (apiLoaded && currentVideo?.id && !playerRef.current) {
      initPlayer();
    }
  }, [currentVideo]);

  // Update play state
  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  // Update volume
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Update progress
  useEffect(() => {
    if (playerRef.current && Math.abs(playerRef.current.getCurrentTime() - progress) > 2) {
      playerRef.current.seekTo(progress);
    }
  }, [progress]);

  // Progress timer
  const startProgressTimer = () => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setProgress(playerRef.current.getCurrentTime());
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  return <div id="youtube-player" className="hidden" />;
};

export default YouTubePlayer;
