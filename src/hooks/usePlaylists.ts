import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setPlaylists(data);
      setLoading(false);
    };

    fetchPlaylists();
  }, []);

  return { playlists, loading };
};
