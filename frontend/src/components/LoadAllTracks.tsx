import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useMusicStore } from '@/store/musicStore';
import { Track } from '@/types/music';

const LoadAllTracks = () => {
  const setAllTracks = useMusicStore((s) => s.setAllTracks);

  useEffect(() => {
    console.log('📥 LoadAllTracks монтируется');

    const fetchTracks = async () => {
      const { data, error } = await supabase.from('songs').select('*');
      console.log('📦 Получено от Supabase:', data);

      if (error) {
        console.error('❌ Ошибка загрузки треков:', error.message);
        return;
      }

      if (data) {
        const tracks: Track[] = data.map((s: any) => ({
          id: String(s.id),
          name: String(s.name),
          artist_name: String(s.artist_name ?? ''),
          artist_id: '',
          album_name: String(s.album ?? ''),
          album_id: '',
          album_image: String(s.album_image ?? ''),
          audio_url: String(s.audio_url ?? ''), // ✅ ключевое исправление
          audiodownload: '',
          duration: Number(s.duration ?? 0),
          position: 0,
          releasedate: '',
          album_datecreated: '',
          artist_dispname: '',
          license_ccurl: '',
          user_id: String(s.user_id ?? ''),
        }));

        console.log('✅ Треки после преобразования:', tracks);
        setAllTracks(tracks);
      }
    };

    fetchTracks();
  }, [setAllTracks]);

  return null;
};

export default LoadAllTracks;
