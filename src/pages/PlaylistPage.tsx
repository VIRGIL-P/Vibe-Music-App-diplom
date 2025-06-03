import { useParams, useNavigate } from "react-router-dom";
import { useMusicStore } from "../store/musicStore";
import LanguageSwitcher from "../components/Layout/LanguageSwitcher";
import TrackWithDelete from "../components/TrackList/TrackWithDelete";
import { Play, Shuffle, Music } from "lucide-react";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    playlists,
    setQueue,
    setCurrentTrack,
    setIsPlaying,
    setShuffle,
    deletePlaylist,
    updatePlaylist,
  } = useMusicStore();

  const playlist = playlists.find((p) => p.id === id);

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

  const playAll = () => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks);
      setCurrentTrack(playlist.tracks[0]);
      setIsPlaying(true);
    }
  };

  const shufflePlay = () => {
    if (playlist.tracks.length > 0) {
      const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setCurrentTrack(shuffled[0]);
      setShuffle(true);
      setIsPlaying(true);
    }
  };

  const handleDeletePlaylist = () => {
    if (confirm("Удалить плейлист?")) {
      deletePlaylist(playlist.id);
      navigate("/");
    }
  };

  const handleRenamePlaylist = () => {
    const newName = prompt("Новое имя плейлиста:", playlist.name);
    if (newName && newName.trim()) {
      updatePlaylist(playlist.id, { name: newName.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black">
      {/* Header */}
      <div className="relative p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
          </div>
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
{/* Controls + Edit/Delete */}
<div className="px-6 pb-6">
  <div className="flex flex-wrap items-center gap-4">
    {/* ▶️ Play */}
    {playlist.tracks.length > 0 && (
      <>
        <button
          onClick={playAll}
          className="bg-green-500 hover:bg-green-600 rounded-full p-4 hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <Play className="w-6 h-6 text-black ml-0.5" />
        </button>

        {/* 🔀 Shuffle */}
        <button
          onClick={shufflePlay}
          className="p-3 text-gray-400 hover:text-white transition-colors"
        >
          <Shuffle className="w-6 h-6" />
        </button>
      </>
    )}

    {/* ✏️ Rename + 🗑 Delete */}
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


      {/* Track List */}
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
      const updated = playlist.tracks.filter(t => t.id !== trackId);
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
