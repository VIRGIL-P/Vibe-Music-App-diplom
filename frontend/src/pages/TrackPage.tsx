import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Track } from '@/types/music';
import { Play } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';

const TrackPage = () => {
  const { id } = useParams();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentTrack, setIsPlaying } = useMusicStore();

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

  const handlePlay = () => {
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  if (loading) return <div className="text-white p-6">Загрузка трека...</div>;
  if (!track) return <div className="text-white p-6">Трек не найден.</div>;

  return (
    <div className="p-6 text-white space-y-4">
      <h1 className="text-3xl font-bold">{track.name}</h1>
      <p className="text-lg text-gray-400">{track.artist_name}</p>
      <img
        src={track.album_image || '/placeholder.svg'}
        alt="cover"
        className="w-64 h-64 object-cover rounded"
      />
      <button
        onClick={handlePlay}
        className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded text-black flex items-center space-x-2"
      >
        <Play className="w-5 h-5" />
        <span>Слушать</span>
      </button>
    </div>
  );
};

export default TrackPage;
