import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Plus, Music, Upload, Clock } from 'lucide-react';
import { useMusicStore } from '../../store/musicStore';
import { useModalStore } from '../../store/modalStore';
import { useLanguageStore } from '../../store/languageStore';
import { useUploadTrackStore } from '../../store/uploadTrackStore';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const { playlists } = useMusicStore();
  const { openCreateModal } = useModalStore();
  const { setUploadOpen } = useUploadTrackStore();
  const { t } = useLanguageStore();

  const navigationItems = [
    { label: t('home'), path: '/', icon: Home },
    { label: t('search'), path: '/search', icon: Search },
    { label: t('liked'), path: '/liked', icon: Heart },
    { label: t('recentlyPlayed') || 'Недавно', path: '/recent', icon: Clock },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center p-1 hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <span className="text-2xl font-extrabold tracking-wide text-white">
              Vibe
            </span>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:scale-[1.02]",
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

          <button
            onClick={() => setUploadOpen(true)}
            className="mt-2 flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 hover:scale-[1.02] transition-all w-full"
          >
            <Upload className="w-5 h-5" />
            <span>{t('uploadTrack') || 'Загрузить трек'}</span>
          </button>
        </nav>

        <div className="mt-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {t('madeByYou')}
            </h3>
            <button
              onClick={openCreateModal}
              className="p-1 rounded hover:bg-white/5 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="space-y-1">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className={cn(
                    "block px-4 py-2 rounded text-sm transition-colors hover:scale-[1.01]",
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
                <p className="text-sm text-gray-500">{t('createFirstPlaylist')}</p>
                <p className="text-xs text-gray-600 mt-1">{t('easyHelp')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-t border-white/10">
      </div>
    </div>
  );
};

export default Sidebar;
