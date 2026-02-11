'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../ui/SearchBar';

export default function Topbar({ onSearch = () => {} }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="topbar">
      <SearchBar onSearch={onSearch} />

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
          <FontAwesomeIcon icon={faBell} className="text-white/70" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(prev => !prev)}
            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faUserCircle} className="text-white/70 text-xl" />
            <div className="text-left">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-white/40">admin@ticketsaas.com</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 glass py-2 z-50">
              <button className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors">
                Profile
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-white/10 transition-colors">
                Settings
              </button>
              <hr className="my-2 border-white/10" />
              <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
