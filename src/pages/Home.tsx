
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronRight } from 'lucide-react';
import { Track } from '../types/music';
import { JamendoAPI } from '../services/jamendoApi';
import { useMusicStore } from '../store/musicStore';
import TrackItem from '../components/TrackList/TrackItem';

const Home = () => {
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [popularTracks, setPopularTracks] = useState<Track[]>([]);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const { recentlyPlayed, setCurrentTrack, setQueue, setIsPlaying } = useMusicStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, popular, recent] = await Promise.all([
          JamendoAPI.getFeaturedTracks(10),
          JamendoAPI.getPopularTracks(10),
          JamendoAPI.getRecommendations(10),
        ]);

        setFeaturedTracks(featured);
        setPopularTracks(popular);
        setRecentTracks(recent);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const playTrackList = (tracks: Track[], startIndex = 0) => {
    setQueue(tracks);
    setCurrentTrack(tracks[startIndex]);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black p-6 pb-32 lg:pb-24">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
        </h1>
        <p className="text-gray-400 text-lg">Ready to discover your next favorite song?</p>
      </div>

      {/* Quick Access */}
      {recentlyPlayed.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Recently Played</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyPlayed.slice(0, 6).map((track, index) => (
              <div
                key={track.id}
                onClick={() => playTrackList([track], 0)}
                className="group flex items-center bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={track.album_image || '/placeholder.svg'}
                  alt={track.album_name}
                  className="w-16 h-16 rounded object-cover mr-4"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{track.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
                </div>
                <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity ml-4" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Tracks */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Featured Tracks</h2>
          <Link
            to="/featured"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            See all
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {featuredTracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => playTrackList(featuredTracks, index)}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300 cursor-pointer"
            >
              <div className="relative mb-4">
                <img
                  src={track.album_image || '/placeholder.svg'}
                  alt={track.album_name}
                  className="w-full aspect-square rounded-lg object-cover"
                />
                <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  <Play className="w-4 h-4 text-black ml-0.5" />
                </button>
              </div>
              <h3 className="text-white font-medium truncate mb-1">{track.name}</h3>
              <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular This Week */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Popular This Week</h2>
          <Link
            to="/popular"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            See all
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          {popularTracks.slice(0, 5).map((track, index) => (
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">New Releases</h2>
          <Link
            to="/new-releases"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            See all
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recentTracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => playTrackList(recentTracks, index)}
              className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all duration-300 cursor-pointer"
            >
              <div className="relative mb-4">
                <img
                  src={track.album_image || '/placeholder.svg'}
                  alt={track.album_name}
                  className="w-full aspect-square rounded-lg object-cover"
                />
                <button className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  <Play className="w-4 h-4 text-black ml-0.5" />
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
