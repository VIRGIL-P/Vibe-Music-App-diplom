import React from "react";
import { usePlaylists } from "@/hooks/usePlaylists";

const Library = () => {
  const { playlists, loading } = usePlaylists();

  if (loading) {
    return <p className="text-muted-foreground p-4">Загрузка...</p>;
  }

  if (playlists.length === 0) {
    return <p className="text-muted-foreground p-4">Плейлисты не найдены</p>;
  }

  return (
    <div className="space-y-4 p-4">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="p-4 bg-white/5 rounded-lg shadow-sm text-white"
        >
          <p className="font-semibold text-lg">{playlist.name}</p>
          <p className="text-sm text-muted-foreground">
            Создан: {new Date(playlist.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Library;
