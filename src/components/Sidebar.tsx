
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Music, ListMusic } from 'lucide-react';
import { availableMoods } from '@/api/gemini';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-[#121212] border-r border-[#282828] h-full fixed left-0 overflow-y-auto pb-24">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">
          <span className="text-mood-happy">Mood</span>Music
        </h1>
        
        <div className="space-y-1">
          <NavLink 
            to="/"
            className={({ isActive }) => 
              `flex items-center p-3 rounded-md transition-colors ${
                isActive ? 'bg-[#282828] text-white' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <Home size={20} className="mr-3" />
            <span>Home</span>
          </NavLink>
          <NavLink 
            to="/search"
            className={({ isActive }) => 
              `flex items-center p-3 rounded-md transition-colors ${
                isActive ? 'bg-[#282828] text-white' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <Search size={20} className="mr-3" />
            <span>Search</span>
          </NavLink>
          <NavLink 
            to="/library"
            className={({ isActive }) => 
              `flex items-center p-3 rounded-md transition-colors ${
                isActive ? 'bg-[#282828] text-white' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <Music size={20} className="mr-3" />
            <span>Your Library</span>
          </NavLink>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Moods</h2>
          <div className="space-y-1">
            {availableMoods.map((mood) => (
              <NavLink 
                key={mood.mood}
                to={`/mood/${mood.mood.toLowerCase()}`}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-md transition-colors ${
                    isActive ? `bg-[#282828] text-mood-${mood.colorTheme}` : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                <span className={`w-2 h-2 rounded-full bg-mood-${mood.colorTheme} mr-3`}></span>
                <span>{mood.mood}</span>
              </NavLink>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Your Playlists</h2>
          <div className="space-y-1">
            <NavLink 
              to="/playlist/liked"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-md transition-colors ${
                  isActive ? 'bg-[#282828] text-white' : 'text-gray-400 hover:text-white'
                }`
              }
            >
              <ListMusic size={20} className="mr-3" />
              <span>Liked Songs</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
