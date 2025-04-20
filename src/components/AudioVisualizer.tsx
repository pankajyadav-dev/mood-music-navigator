
import React from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface AudioVisualizerProps {
  color?: string;
  barCount?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  color = 'currentColor',
  barCount = 5
}) => {
  const { isPlaying, currentVideo } = useMusicPlayer();
  
  if (!isPlaying || !currentVideo) {
    return null;
  }

  return (
    <div className="audio-visualizer" style={{ color: color }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div 
          key={i} 
          className="audio-bar" 
          style={{ 
            animationDuration: `${0.5 + Math.random() * 0.3}s`,
            animationDelay: `${Math.random() * 0.2}s`
          }}
        ></div>
      ))}
    </div>
  );
};

export default AudioVisualizer;
