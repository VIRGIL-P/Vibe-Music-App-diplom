import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLikedSongs } from "@/hooks/useLikedSongs";

interface Track {
  id: string;
  title: string;
  artist_name?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlaylistModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const { likedSongs, loading } = useLikedSongs();

  const handleCreate = async () => {
    await fetch("/api/playlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: playlistName,
        trackIds: selectedTracks,
      }),
    });

    setPlaylistName("");
    setSelectedTracks([]);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <h2 className="text-xl font-bold mb-4">Создать плейлист</h2>

        <input
          type="text"
          placeholder="Название плейлиста"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <div className="text-sm text-muted-foreground mb-2">
          Выбрано: {selectedTracks.length}
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2 border p-2 rounded">
          {loading ? (
            <p>Загрузка...</p>
          ) : likedSongs.length === 0 ? (
            <p>Нет лайкнутых треков</p>
          ) : (
            likedSongs.map((entry) => {
              const track = entry.song;
              return (
                <div key={track.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTracks.includes(track.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTracks((prev) => [...prev, track.id]);
                      } else {
                        setSelectedTracks((prev) =>
                          prev.filter((id) => id !== track.id)
                        );
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm">{track.title}</p>
                    <p className="text-xs text-muted-foreground">{track.artist_name}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 mt-4 rounded hover:bg-green-700"
        >
          Создать
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistModal;
