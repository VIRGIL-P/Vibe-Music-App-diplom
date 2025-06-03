import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useLikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("liked_songs")
        .select("song_id, songs (*)") // ⚠️ songs — имя таблицы с треками
        .eq("user_id", user.id);

      if (!error && data) {
        // если songs — foreign key, можно так:
        setLikedSongs(data.map((entry) => entry.songs));
      }

      setLoading(false);
    };

    fetchLikedSongs();
  }, []);

  return { likedSongs, loading };
};
