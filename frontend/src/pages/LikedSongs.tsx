import React, { useEffect, useState } from 'react';
import { Heart, Play, Shuffle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useMusicStore } from '../store/musicStore';
import { useLanguageStore } from '../store/languageStore';
import TrackItem from '../components/TrackList/TrackItem';
import LanguageSwitcher from '../components/Layout/LanguageSwitcher';
import { supabase } from '@/lib/supabaseClient';
import { askAI } from '@/services/askAI';

type ArtistRecommendation = {
  name: string;
  genre: string;
};

const LikedSongs = () => {
  const {
    likedTracks,
    setQueue,
    setCurrentTrack,
    setIsPlaying,
    setShuffle,
    allTracks,
    loadLikedTracks,
  } = useMusicStore();

  const { t } = useLanguageStore();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ArtistRecommendation[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    setLoading(true);
    setRecommendations(null);

    try {
      if (!likedTracks.length) {
        setRecommendations([]);
        return;
      }

      const uniqueArtists = Array.from(
        new Set(likedTracks.map((t) => t.artist_name))
      ).filter(Boolean);

      if (!uniqueArtists.length) {
        setRecommendations([]);
        return;
      }

      const prompt = `Я люблю следующих исполнителей: ${uniqueArtists
        .map((artist) => `"${artist}"`)
        .join(", ")}. Посоветуй 3 похожих артистов, напиши в формате Артист — Жанр или стиль.`;

      const rawResponse = await askAI(prompt);

      const parsed: ArtistRecommendation[] = rawResponse
        .split('\n')
        .map((line) => {
          const [name, genre] = line.split('—').map((s) => s.trim());
          return name && genre ? { name, genre } : null;
        })
        .filter(Boolean) as ArtistRecommendation[];

      setRecommendations(parsed);
    } catch (err) {
      console.error(err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId && allTracks.length > 0) {
      loadLikedTracks(userId, allTracks);
    }
  }, [userId, allTracks]);

  const playAllLiked = () => {
    if (likedTracks.length > 0) {
      setQueue(likedTracks);
      setCurrentTrack(likedTracks[0]);
      setIsPlaying(true);
    }
  };

  const shuffleLiked = () => {
    if (likedTracks.length > 0) {
      const shuffled = [...likedTracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setCurrentTrack(shuffled[0]);
      setShuffle(true);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black">
      {/* Header */}
      <div className="relative p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div></div>
          <LanguageSwitcher />
        </div>

        <div className="flex items-end space-x-6">
          <div className="w-60 h-60 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg flex items-center justify-center shadow-2xl">
            <Heart className="w-24 h-24 text-white fill-current" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium mb-2">PLAYLIST</p>
            <h1 className="text-5xl font-bold text-white mb-4">{t('liked')}</h1>
            <p className="text-gray-300 text-lg">
              {likedTracks.length} {likedTracks.length === 1 ? t('song') : t('songs')}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-4">
          {likedTracks.length > 0 && (
            <>
              <button
                onClick={playAllLiked}
                className="bg-green-500 hover:bg-green-600 rounded-full p-4 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Play className="w-6 h-6 text-black ml-0.5" />
              </button>

              <button
                onClick={shuffleLiked}
                className="p-3 text-gray-400 hover:text-white transition-colors"
              >
                <Shuffle className="w-6 h-6" />
              </button>

              <button
                onClick={handleRecommend}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {loading ? "Загрузка..." : "🎧 Рекомендовать"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 pb-32 lg:pb-24">
        {likedTracks.length > 0 ? (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm font-medium border-b border-gray-700 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">TITLE</div>
              <div className="col-span-3">ALBUM</div>
              <div className="col-span-2">DATE ADDED</div>
              <div className="col-span-1">⏱</div>
            </div>

            {likedTracks.map((track, index) => (
              <TrackItem
                key={track.id}
                track={track}
                index={index}
                showAlbum={true}
                showArtist={true}
              />
            ))}

            {/* AI Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <div className="mt-8 px-2 lg:px-4">
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-md">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-purple-400">🎧</span> {t('aiRecommendations') || 'AI-рекомендации'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {recommendations.map((artist, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-purple-700 to-purple-900 border border-white/10 rounded-xl p-4 text-white shadow group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">🎤</span>
                            <h4 className="text-lg font-semibold">{artist.name}</h4>
                          </div>
                          <button
                            onClick={() => navigate(`/search?query=${encodeURIComponent(artist.name)}`)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title={`Искать ${artist.name}`}
                          >
                            <Search className="w-5 h-5 text-white hover:text-purple-300" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-300">{artist.genre}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">{t('songsYouLike')}</h3>
            <p className="text-gray-400 text-lg mb-8">
              {t('saveByHeart')}
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-white text-black font-medium px-8 py-3 rounded-full hover:scale-105 transition-transform"
            >
              {t('findSomething')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
