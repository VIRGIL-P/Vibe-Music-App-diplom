
import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Heart, Clock, Plus } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';
import { useLanguageStore } from '../store/languageStore';
import TrackItem from '../components/TrackList/TrackItem';
import { mockTracks } from '../data/mockMusic';
import LanguageSwitcher from '../components/Layout/LanguageSwitcher';

const Library = () => {
  const { playlists, likedTracks, recentlyPlayed } = useMusicStore();
  const { t } = useLanguageStore();

  // Use mock tracks for recently played if empty
  const displayRecentlyPlayed = recentlyPlayed.length > 0 ? recentlyPlayed : mockTracks.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black p-6 pb-32 lg:pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">{t('library')}</h1>
        <LanguageSwitcher />
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link
          to="/liked"
          className="group bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 hover:scale-105 transition-all duration-200"
        >
          <Heart className="w-8 h-8 text-white mb-4 fill-current" />
          <h3 className="text-white font-bold text-lg mb-1">{t('liked')}</h3>
          <p className="text-white/80 text-sm">{likedTracks.length} {t('songs')}</p>
        </Link>

        <div className="group bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-6 hover:scale-105 transition-all duration-200">
          <Clock className="w-8 h-8 text-white mb-4" />
          <h3 className="text-white font-bold text-lg mb-1">{t('recentlyPlayed')}</h3>
          <p className="text-white/80 text-sm">{displayRecentlyPlayed.length} {t('songs')}</p>
        </div>

        <div className="group bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-6 hover:scale-105 transition-all duration-200">
          <Music className="w-8 h-8 text-white mb-4" />
          <h3 className="text-white font-bold text-lg mb-1">{t('madeForYou')}</h3>
          <p className="text-white/80 text-sm">{t('discoverWeekly')}</p>
        </div>
      </div>

      {/* Playlists */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{t('madeByYou')}</h2>
        
        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300"
              >
                <div className="relative mb-4">
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    {playlist.image ? (
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <Music className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <h3 className="text-white font-medium truncate mb-1 group-hover:text-green-400 transition-colors">
                  {playlist.name}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {playlist.tracks.length} {t('songs')}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">{t('createFirstPlaylist')}</h3>
            <p className="text-gray-400 mb-6">{t('easyHelp')}</p>
            <button className="bg-white text-black font-medium px-6 py-3 rounded-full hover:scale-105 transition-transform inline-block">
              {t('createPlaylist')}
            </button>
          </div>
        )}
      </section>

      {/* Recently Played */}
      {displayRecentlyPlayed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">{t('recentlyPlayed')}</h2>
          <div className="bg-white/5 rounded-lg p-4">
            {displayRecentlyPlayed.slice(0, 10).map((track, index) => (
              <TrackItem
                key={`${track.id}-${index}`}
                track={track}
                index={index}
                isCompact
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Library;
