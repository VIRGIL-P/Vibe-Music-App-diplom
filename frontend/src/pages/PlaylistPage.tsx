import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useMusicStore } from "../store/musicStore";
import LanguageSwitcher from "../components/Layout/LanguageSwitcher";
import TrackWithDelete from "../components/TrackList/TrackWithDelete";
import { Play, Shuffle, Music } from "lucide-react";
import { Track, Playlist } from "../types/music";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    setQueue,
    setCurrentTrack,
    setIsPlaying,
    setShuffle,
    updatePlaylist,
    deletePlaylist,
  } = useMusicStore();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("❌ Ошибка при получении плейлиста:", error);
        setPlaylist(null);
      } else {
        let rawTracks: any[] = [];

        try {
          rawTracks = Array.isArray(data.tracks)
            ? data.tracks
            : JSON.parse(data.tracks || "[]");
        } catch (err) {
          console.warn("⚠️ Не удалось распарсить tracks:", err);
          rawTracks = [];
        }

        const tracks: Track[] = rawTracks.map((t: any) => ({
          id: String(t.id),
          name: String(t.name),
          artist_name: String(t.artist_name ?? ""),
          artist_id: "",
          album_name: String(t.album_name ?? ""),
          album_id: "",
          album_image: String(t.album_image ?? ""),
          audio_url: String(t.audio_url ?? ""),
          audiodownload: "",
          duration: Number(t.duration ?? 0),
          position: 0,
          releasedate: "",
          album_datecreated: "",
          artist_dispname: "",
          license_ccurl: "",
          user_id: String(t.user_id ?? ""),
        }));

        setPlaylist({ ...data, tracks });
      }

      setLoading(false);
    };

    fetchPlaylist();
  }, [id]);

  const playAll = () => {
    if (playlist?.tracks.length) {
      setQueue(playlist.tracks);
      setCurrentTrack(playlist.tracks[0]);
      setIsPlaying(true);
    }
  };

  const shufflePlay = () => {
    if (playlist?.tracks.length) {
      const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setCurrentTrack(shuffled[0]);
      setShuffle(true);
      setIsPlaying(true);
    }
  };

  const handleDeletePlaylist = async () => {
    if (confirm("Удалить плейлист?")) {
      await deletePlaylist(playlist.id);
      navigate("/");
    }
  };

  const handleRenamePlaylist = () => {
    const newName = prompt("Новое имя плейлиста:", playlist?.name);
    if (newName && newName.trim()) {
      updatePlaylist(playlist!.id, { name: newName.trim() });
      setPlaylist({ ...playlist!, name: newName.trim() });
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Загрузка плейлиста...</div>;
  }

  if (!playlist) {
    return (
      <div className="text-center text-white mt-20">
        <p>Плейлист не найден</p>
        <button
          onClick={() => navigate("/")}
          className="text-green-400 underline mt-2"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black">
      {/* Header */}
      <div className="relative p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4" />
          <LanguageSwitcher />
        </div>

        <div className="flex items-end space-x-6">
          <div className="w-60 h-60 bg-gradient-to-br from-green-400 to-blue-600 rounded-lg flex items-center justify-center shadow-2xl">
            <Music className="w-24 h-24 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium mb-2">PLAYLIST</p>
            <h1 className="text-5xl font-bold text-white mb-4">{playlist.name}</h1>
            <p className="text-gray-300 text-lg">
              {playlist.tracks.length} трек(ов)
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-6">
        <div className="flex flex-wrap items-center gap-4">
          {playlist.tracks.length > 0 && (
            <>
              <button
                onClick={playAll}
                className="bg-green-500 hover:bg-green-600 rounded-full p-4 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Play className="w-6 h-6 text-black ml-0.5" />
              </button>
              <button
                onClick={shufflePlay}
                className="p-3 text-gray-400 hover:text-white transition-colors"
              >
                <Shuffle className="w-6 h-6" />
              </button>
            </>
          )}

          <button
            onClick={handleRenamePlaylist}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition"
          >
            ✏️
          </button>
          <button
            onClick={handleDeletePlaylist}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium transition"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Tracks */}
      <div className="px-6 pb-32 lg:pb-24">
        {playlist.tracks.length > 0 ? (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm font-medium border-b border-gray-700 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">TITLE</div>
              <div className="col-span-3">ALBUM</div>
              <div className="col-span-2">DATE ADDED</div>
              <div className="col-span-1">⏱</div>
            </div>

            {playlist.tracks.map((track, index) => (
              <TrackWithDelete
                key={track.id}
                track={track}
                playlistId={playlist.id}
                index={index}
                onDelete={(trackId) => {
                  const updated = playlist.tracks.filter((t) => t.id !== trackId);
                  setPlaylist({ ...playlist, tracks: updated });
                  updatePlaylist(playlist.id, { tracks: updated });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">Плейлист пуст</div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
