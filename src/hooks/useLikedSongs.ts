import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Track } from "@/types/music";

export const useLikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        // Получение пользователя
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Ошибка получения пользователя:", userError);
          setLikedSongs([]);
          setLoading(false);
          return;
        }

        // Получение лайкнутых треков с детальной информацией
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
          setLikedSongs([]);
          setLoading(false);
          return;
        }

        // Отфильтрованные и приведённые к типу Track треки
        const validSongs: Track[] = data
          .map((entry) => entry.songs as Track)
          .filter((song) => song !== null && song !== undefined);

        setLikedSongs(validSongs);
      } catch (err) {
        console.error("Ошибка в useLikedSongs:", err);
        setLikedSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, []);

  return { likedSongs, loading };
};
