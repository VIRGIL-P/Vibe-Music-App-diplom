import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useMusicStore } from "@/store/musicStore";
import { Playlist } from "@/types/music";

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth(); // 🔑 если у тебя плейлисты привязаны к user_id
  const setStorePlaylists = useMusicStore((s) => s.setPlaylists);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user?.id) {
        setPlaylists([]);
        setStorePlaylists([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Ошибка при загрузке плейлистов:", error.message);
        setPlaylists([]);
        setStorePlaylists([]);
        setLoading(false);
        return;
      }

      if (data) {
        setPlaylists(data);
        setStorePlaylists(data); // ✅ обновляем Zustand
      }

      setLoading(false);
    };

    fetchPlaylists();
  }, [user?.id, setStorePlaylists]);

  return { playlists, loading };
};
