import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Track } from '@/types/music';
import { Play, Heart, HeartOff, X } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const TrackPage = () => {
  const { id } = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const {
    likedTracks,
    toggleLikeTrack,
    loadLikedTracks,
    setCurrentTrack,
    setIsPlaying,
  } = useMusicStore();

  useEffect(() => {
    const fetchTrack = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Ошибка загрузки трека:', error.message);
        setLoading(false);
        return;
      }

      setTrack(data as Track);
      setLoading(false);
    };

    if (id) fetchTrack();
  }, [id]);

  useEffect(() => {
    if (user?.id && track) {
      loadLikedTracks(user.id, [track]);
    }
  }, [user?.id, track]);

  const isLiked = likedTracks.some((t) => t.id === track?.id);

  const handlePlay = () => {
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleLike = async () => {
    if (!user?.id || !track) return;

    await toggleLikeTrack(user.id, track);

    toast.custom((t) => (
      <div className="bg-zinc-900 text-white px-4 py-3 rounded-xl flex items-center gap-4 shadow-xl max-w-sm w-full">
        <img
          src={track.album_image}
          alt="cover"
          className="w-12 h-12 rounded object-cover"
        />
        <div className="flex-1">
          <p className="font-medium">{track.name}</p>
          <p className="text-sm text-gray-400">
            {isLiked ? 'Удалено из понравившегося' : 'Добавлено в понравившееся'}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ));
  };

  if (loading) return <div className="text-white p-6">Загрузка трека...</div>;
  if (!track) return <div className="text-white p-6">Трек не найден.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-zinc-900 to-black px-4">
      <div className="bg-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col sm:flex-row gap-6 sm:gap-10 max-w-4xl w-full">
        <img
          src={track.album_image || '/placeholder.svg'}
          alt="cover"
          className="w-full sm:w-64 sm:h-64 object-cover rounded-xl shadow-lg"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{track.name}</h1>
            <p className="text-md text-gray-500 mb-1 italic">Альбом: {track.album_name}</p>
            {track.duration && (
              <p className="text-sm text-gray-500">
                Длительность: {Math.floor(track.duration / 60)}:
                {String(track.duration % 60).padStart(2, '0')}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-full font-semibold shadow transition"
            >
              <Play className="w-5 h-5" />
              <span>Слушать</span>
            </button>

            <button
              onClick={handleLike}
              className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition"
            >
              {isLiked ? (
                <Heart className="text-green-500 w-6 h-6" fill="currentColor" />
              ) : (
                <HeartOff className="text-white w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
