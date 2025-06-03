// src/components/LoadAllTracks.tsx

import { useEffect } from "react";
import { useMusicStore } from "@/store/musicStore";
import { supabase } from "@/lib/supabaseClient";
import { Track } from "@/types/music";

const LoadAllTracks = () => {
  const { setAllTracks } = useMusicStore();

  useEffect(() => {
    const fetchTracks = async () => {
      const { data, error } = await supabase.from("songs").select("*");

      if (error) {
        console.error("❌ Ошибка загрузки треков из Supabase:", error.message);
      } else if (data) {
        setAllTracks(data as Track[]);
        console.log("🎧 Все треки загружены:", data);
      }
    };

    fetchTracks();
  }, []);

  return null;
};

export default LoadAllTracks;
