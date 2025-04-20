
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
    <div className="audio-visualizer flex items-center h-4 gap-0.5" style={{ color: color }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div 
          key={i} 
          className="audio-bar w-0.5 bg-current rounded-sm"
          style={{ 
            height: '100%',
            animation: `audioVisualizerBar ${0.5 + Math.random() * 0.3}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 0.2}s`
          }}
        ></div>
      ))}

      <style jsx>{`
        @keyframes audioVisualizerBar {
          0% {
            transform: scaleY(0.3);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AudioVisualizer;
