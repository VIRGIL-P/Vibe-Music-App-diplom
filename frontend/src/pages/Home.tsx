import React, { useEffect, useState } from 'react';
import CreatePlaylistModal from '../components/Modals/CreatePlaylistModal';
import { Link } from 'react-router-dom';
import { Play, User } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';
import { useLanguageStore } from '../store/languageStore';
import { useAuth } from '../hooks/useAuth';
import TrackItem from '../components/TrackList/TrackItem';
import LanguageSwitcher from '../components/Layout/LanguageSwitcher';
import LoadAllTracks from '@/components/LoadAllTracks';
import TrackSkeleton from '../components/TrackList/TrackSkeleton';
import { usePlaylists } from '@/hooks/usePlaylists';

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const { setQueue, setCurrentTrack, setIsPlaying } = useMusicStore();
  const { t } = useLanguageStore();
  const { user: authUser, signOut } = useAuth();
  const tracks = useMusicStore((state) => state.allTracks);
  const [loading, setLoading] = useState(true);
  const [visibleFeatured, setVisibleFeatured] = useState(5);
  const [visibleReleases, setVisibleReleases] = useState(8);

  usePlaylists();

  useEffect(() => {
    if (tracks.length > 0) {
      setQueue(tracks);
      setLoading(false);
    }
  }, [tracks, setQueue]);

  const playFeatured = () => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setIsPlaying(true);
    }
  };

  const featuredTracks = tracks;
  const newReleases = tracks;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black pb-32">
      <LoadAllTracks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-0">{t('home')}</h1>
        <div className="flex items-center flex-wrap gap-3">
          {authUser ? (
            <div className="flex items-center gap-3">
              <span className="text-white text-sm truncate max-w-[120px]">{authUser.email}</span>
              <button
                onClick={signOut}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full font-medium transition"
            >
              <User className="w-4 h-4" />
              <span>{t('login')}</span>
            </Link>
          )}
          <LanguageSwitcher />
        </div>
      </div>

      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden mx-4 sm:mx-6 mt-4 shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1280&q=80"
          alt="Banner"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center px-6 py-6 sm:py-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 leading-snug">
            {authUser ? `${t('welcomeBack')}, ${authUser.email?.split('@')[0]}!` : 'Добро пожаловать в Vibe Music'}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mb-4 max-w-md">
            {t('continueListening')} 🎧
          </p>
          {tracks.length > 0 && (
            <button
              onClick={playFeatured}
              className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 sm:py-3 rounded-full text-sm font-semibold w-fit transition"
            >
              {t('playNow')}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pt-6">
        {/* Featured Tracks */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{t('featuredTracks')}</h2>
            <button
              onClick={playFeatured}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full text-sm font-medium transition"
            >
              <Play className="w-4 h-4" />
              <span>{t('playAll')}</span>
            </button>
          </div>

          <div className="bg-white/5 rounded-lg p-2 sm:p-4 divide-y divide-white/10">
            {loading ? (
              [...Array(5)].map((_, i) => <TrackSkeleton key={i} />)
            ) : (
              featuredTracks.slice(0, visibleFeatured).map((track, index) => (
                <TrackItem key={track.id} track={track} index={index} />
              ))
            )}
          </div>

          {!loading && visibleFeatured < featuredTracks.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleFeatured((prev) => prev + 5)}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-full text-sm font-medium transition hover:scale-105"
              >
                {t('showMore')}
              </button>
            </div>
          )}
        </section>

        {/* New Releases */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{t('newReleases')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(loading ? [...Array(8)] : newReleases.slice(0, visibleReleases)).map((track, index) => (
              loading ? (
                <div key={index} className="bg-white/5 rounded-lg p-4 animate-pulse">
                  <div className="w-full aspect-square bg-gray-700 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-500 rounded w-1/2" />
                </div>
              ) : (
                <div
                  key={track.id}
                  className="group bg-white/5 hover:bg-white/10 rounded-lg p-3 sm:p-4 transition-all cursor-pointer"
                  onClick={() => {
                    setCurrentTrack(track);
                    setIsPlaying(true);
                  }}
                >
                  <div className="relative mb-3">
                    <img
                      src={track.album_image}
                      alt={track.album_name}
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                    <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 sm:p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all hover:scale-105">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                    </button>
                  </div>
                  <h3 className="text-white text-sm sm:text-base font-medium truncate mb-1 group-hover:text-green-400 transition">
                    {track.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">
                    {track.artist_name}
                  </p>
                </div>
              )
            ))}
          </div>

          {!loading && visibleReleases < newReleases.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleReleases((prev) => prev + 8)}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-full text-sm font-medium transition hover:scale-105"
              >
                {t('showMore')}
              </button>
            </div>
          )}
        </section>
      </div>

      <CreatePlaylistModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        tracks={tracks}
      />
    </div>
  );
};

export default Home;
