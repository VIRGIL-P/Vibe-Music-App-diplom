
import React, { useEffect } from 'react';
import { Play } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';
import { useLanguageStore } from '../store/languageStore';
import TrackItem from '../components/TrackList/TrackItem';
import { mockTracks } from '../data/mockMusic';
import LanguageSwitcher from '../components/Layout/LanguageSwitcher';

const Home = () => {
  const { setQueue, setCurrentTrack, setIsPlaying } = useMusicStore();
  const { t } = useLanguageStore();

  useEffect(() => {
    // Initialize with mock data
    setQueue(mockTracks);
  }, [setQueue]);

  const playFeatured = () => {
    if (mockTracks.length > 0) {
      setQueue(mockTracks);
      setCurrentTrack(mockTracks[0]);
      setIsPlaying(true);
    }
  };

  const featuredTracks = mockTracks.slice(0, 3);
  const trendingTracks = mockTracks.slice(1, 4);
  const newReleases = mockTracks.slice(2, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('home')}
          </h1>
          <p className="text-gray-400">
            {new Date().getHours() < 12 ? 'Good morning' : 
             new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}
          </p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Quick Play Section */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTracks.map((track) => (
            <div
              key={track.id}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setCurrentTrack(track);
                setQueue([track]);
                setIsPlaying(true);
              }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={track.album_image}
                  alt={track.album_name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{track.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
                </div>
                <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Tracks */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{t('featuredTracks')}</h2>
          <button
            onClick={playFeatured}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Show all
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

      {/* Trending Now */}
      <section className="px-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{t('trending')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingTracks.map((track) => (
            <div
              key={track.id}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setCurrentTrack(track);
                setQueue(mockTracks);
                setIsPlaying(true);
              }}
            >
              <div className="relative mb-4">
                <img
                  src={track.album_image}
                  alt={track.album_name}
                  className="w-full aspect-square rounded-lg object-cover"
                />
                <button className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 shadow-lg">
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <h3 className="text-white font-medium truncate mb-1">{track.name}</h3>
              <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="px-6 pb-32 lg:pb-24">
        <h2 className="text-2xl font-bold text-white mb-4">{t('newReleases')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newReleases.map((track) => (
            <div
              key={track.id}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setCurrentTrack(track);
                setQueue(mockTracks);
                setIsPlaying(true);
              }}
            >
              <div className="relative mb-4">
                <img
                  src={track.album_image}
                  alt={track.album_name}
                  className="w-full aspect-square rounded-lg object-cover"
                />
                <button className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 shadow-lg">
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <h3 className="text-white font-medium truncate mb-1">{track.name}</h3>
              <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
