
import React from 'react';
import Sidebar from '@/components/Sidebar';
import MusicPlayer from '@/components/MusicPlayer';
import YouTubePlayer from '@/components/YouTubePlayer';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentVideo } = useMusicPlayer();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <div 
        className="ml-64 pt-6 pb-28 min-h-screen"
        style={{ 
          background: currentVideo 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.7), #121212), url(${currentVideo.thumbnail})` 
            : 'linear-gradient(to bottom, #303030, #121212)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundBlendMode: 'multiply',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <main className="max-w-screen-xl mx-auto px-6">
          {children}
        </main>
      </div>
      {currentVideo && <YouTubePlayer />}
      <MusicPlayer />
    </div>
  );
};

export default Layout;
