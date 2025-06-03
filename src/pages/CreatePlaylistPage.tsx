import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMusicStore } from "../store/musicStore";
import { Track } from "../types/music";
import TrackItem from "../components/TrackList/TrackItem";

const CreatePlaylistPage = () => {
  const navigate = useNavigate();
  const { allTracks, createPlaylist } = useMusicStore();

  const [playlistName, setPlaylistName] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);

  const toggleSelectTrack = (track: Track) => {
    const isAlreadySelected = selectedTracks.some(t => t.id === track.id);
    if (isAlreadySelected) {
      setSelectedTracks(prev => prev.filter(t => t.id !== track.id));
    } else {
      setSelectedTracks(prev => [...prev, track]);
    }
  };

  const handleCreatePlaylist = () => {
    if (!playlistName.trim() || selectedTracks.length === 0) return;

    createPlaylist({
      name: playlistName.trim(),
      tracks: selectedTracks,
    });

    navigate("/"); // Перенаправляем обратно на главную
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Создать новый плейлист</h1>

        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Название плейлиста"
          className="w-full px-4 py-2 mb-4 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <p className="text-sm text-gray-300 mb-2">
          Выбрано треков: {selectedTracks.length}
        </p>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto rounded-lg bg-black/20 p-4 backdrop-blur-sm">
          {allTracks.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
              isCompact
              onAddToPlaylist={() => toggleSelectTrack(track)}
            />
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handleCreatePlaylist}
            disabled={!playlistName.trim() || selectedTracks.length === 0}
            className="bg-green-500 hover:bg-green-600 text-black font-medium px-6 py-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Создать плейлист
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
