
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full max-w-md">
      <div className="relative w-full">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs or artists"
          className="pl-9 bg-[#242424] border-[#333] focus-visible:ring-mood-happy"
        />
      </div>
      <Button 
        type="submit" 
        className="ml-2 bg-mood-happy hover:bg-mood-happy/90 text-black"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBox;
