import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useMusicStore } from "@/store/musicStore";
import { Playlist, Track } from "@/types/music";

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
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

      const parsed: Playlist[] = (data ?? []).map((item) => {
        let parsedTracks: Track[] = [];

        try {
          parsedTracks = Array.isArray(item.tracks)
            ? item.tracks
            : typeof item.tracks === "string"
            ? JSON.parse(item.tracks)
            : [];
        } catch (e) {
          console.warn("⚠️ Невалидный JSON в tracks:", item.tracks);
          parsedTracks = [];
        }

        return {
          ...item,
          tracks: parsedTracks,
        };
      })
      .filter((p) => Array.isArray(p.tracks) && p.tracks.length > 0); // 👈 фильтрация

      setPlaylists(parsed);
      setStorePlaylists(parsed);
      setLoading(false);
    };

    fetchPlaylists();
  }, [user?.id, setStorePlaylists]);

  return { playlists, loading };
};
