import React, { useEffect, useState } from 'react';
import CreatePlaylistModal from '../components/Modals/CreatePlaylistModal';
import { Link } from 'react-router-dom';
import { Play, User } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';
import { useLanguageStore } from '../store/languageStore';
import { useAuth } from '../hooks/useAuth';
import TrackItem from '../components/TrackList/TrackItem';
import { mockTracks } from '../data/mockMusic';
import LanguageSwitcher from '../components/Layout/LanguageSwitcher';

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const { setQueue, setCurrentTrack, setIsPlaying } = useMusicStore();
  const { t } = useLanguageStore();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (mockTracks.length > 0) {
      setQueue(mockTracks);
    }
  }, [setQueue]);

  const playFeatured = () => {
    if (mockTracks.length > 0) {
      setCurrentTrack(mockTracks[0]);
      setIsPlaying(true);
    }
  };

  const featuredTracks = mockTracks.slice(0, 6);
  const newReleases = mockTracks.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-bold text-white">{t('home')}</h1>
          
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{t('login')}</span>
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>

      <div className="p-6 pb-32 lg:pb-24">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {user ? `Welcome back, ${user.email?.split('@')[0]}!` : 'Welcome to Vibe'}
          </h2>
          <p className="text-gray-400">
            {user ? 'Continue where you left off' : 'Sign in to access your music library'}
          </p>
        </div>

        {/* Featured Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{t('featuredTracks')}</h2>
            <button
              onClick={playFeatured}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>{t('playAll')}</span>
            </button>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            {featuredTracks.map((track, index) => (
              <TrackItem
                key={track.id}
                track={track}
                index={index}
                isCompact
              />
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">{t('newReleases')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newReleases.map((track) => (
              <div
                key={track.id}
                className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
              >
                <div className="relative mb-4">
                  <img
                    src={track.album_image}
                    alt={track.album_name}
                    className="w-full aspect-square rounded-lg object-cover"
                  />
                  <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-105">
                    <Play className="w-5 h-5 text-black ml-0.5" />
                  </button>
                </div>
                <h3 className="text-white font-medium truncate mb-1 group-hover:text-green-400 transition-colors">
                  {track.name}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {track.artist_name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CreatePlaylistModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

export default Home;
