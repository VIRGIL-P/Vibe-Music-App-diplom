import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMusicStore } from "../store/musicStore";

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const { likedTracks, createPlaylist, setPlaylists } = useMusicStore();

  const handleCreate = async () => {
    if (!name.trim()) return alert("Введите название плейлиста");
    if (likedTracks.length === 0) return alert("Нет понравившихся треков");

    setCreating(true);

    try {
      // 1. Создаём плейлист через функцию в zustand
      const newPlaylist = {
        name: name.trim(),
        description: "Плейлист из понравившихся треков",
        tracks: likedTracks,
      };

      await createPlaylist(newPlaylist); // автоматически добавит в Zustand

      // 2. Перенаправление на страницу нового плейлиста
      const { playlists } = useMusicStore.getState();
      const created = playlists.find(p => p.name === name.trim());

      if (created) {
        navigate(`/playlist/${created.id}`);
      } else {
        navigate("/library");
      }

      alert(`✅ Плейлист "${name}" создан из ${likedTracks.length} треков`);
    } catch (err) {
      console.error("❌ Ошибка создания плейлиста:", err);
      alert("Ошибка при создании плейлиста");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">Создать плейлист</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название плейлиста"
          className="w-full p-3 rounded bg-zinc-800 text-white"
        />
        <button
          onClick={handleCreate}
          className="w-full bg-green-500 text-black font-semibold py-3 rounded hover:bg-green-600 transition disabled:opacity-50"
          disabled={creating}
        >
          {creating ? "Создание..." : "Создать из понравившихся"}
        </button>
      </div>
    </div>
  );
};

export default CreatePlaylist;
