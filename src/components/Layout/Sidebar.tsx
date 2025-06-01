
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Plus, Music } from 'lucide-react';
import { useMusicStore } from '../../store/musicStore';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const { playlists } = useMusicStore();

  const navigationItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Liked Songs', path: '/liked', icon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden lg:flex flex-col w-64 bg-black/90 backdrop-blur-md border-r border-gray-800/50">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Vibe</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive(item.path)
                  ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Playlists Section */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Playlists
          </h3>
          <Link
            to="/create-playlist"
            className="p-1 rounded hover:bg-white/5 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400 hover:text-white" />
          </Link>
        </div>

        <div className="space-y-1">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className={cn(
                  "block px-4 py-2 rounded text-sm transition-colors",
                  isActive(`/playlist/${playlist.id}`)
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="truncate">{playlist.name}</div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <Music className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No playlists yet</p>
              <p className="text-xs text-gray-600 mt-1">Create your first playlist</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
