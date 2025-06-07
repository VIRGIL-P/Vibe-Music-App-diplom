import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Track } from "@/types/music";
import { useMusicStore } from "@/store/musicStore"; // ✅ подключаем Zustand

export const useLikedSongs = () => {
  const [loading, setLoading] = useState(true);
  const { likedTracks, setLikedTracks } = useMusicStore(); // ✅ глобальное состояние

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Ошибка получения пользователя:", userError);
          setLikedTracks([]); // ⛔ сбрасываем глобально
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("liked_songs")
          .select(`
            song_id,
            songs:song_id (
              id,
              name,
              artist_name,
              artist_id,
              album_name,
              album_id,
              album_image,
              audio,
              audiodownload,
              duration,
              position,
              releasedate,
              album_datecreated,
              artist_dispname,
              license_ccurl
            )
          `)
          .eq("user_id", user.id);

        if (error) {
          console.error("Ошибка получения треков:", error);
          setLikedTracks([]);
          setLoading(false);
          return;
        }

        const validSongs: Track[] = data
          .map((entry) => entry.songs as unknown as Track) // ✅ решаем ошибку типов
          .filter((song) => song !== null && song !== undefined);

        setLikedTracks(validSongs); // ✅ обновляем глобальное хранилище
      } catch (err) {
        console.error("Ошибка в useLikedSongs:", err);
        setLikedTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, [setLikedTracks]);

  return { likedSongs: likedTracks, loading };
};
