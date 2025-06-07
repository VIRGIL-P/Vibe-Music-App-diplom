
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Music } from 'lucide-react';
import { cn } from '../../lib/utils';

const MobileNav = () => {
  const location = useLocation();

  const navigationItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Library', path: '/library', icon: Music },
    { label: 'Liked', path: '/liked', icon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-gray-800/50">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200",
                isActive(item.path)
                  ? "text-green-400"
                  : "text-gray-400"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
