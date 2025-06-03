import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMusicStore } from "../store/musicStore";

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { likedTracks, createPlaylist, addToPlaylist } = useMusicStore();

  const handleCreate = () => {
    if (!name.trim()) return alert("Введите название плейлиста");

    // 1. создаём плейлист
    const newId = Date.now().toString();
    createPlaylist(name.trim(), "");

    // 2. добавляем в него все понравившиеся треки
    likedTracks.forEach(track => {
      addToPlaylist(newId, track);
    });

    // 3. переходим на главную (или /library)
    alert(`Плейлист "${name}" создан из ${likedTracks.length} треков`);
    navigate("/");
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
          className="w-full bg-green-500 text-black font-semibold py-3 rounded hover:bg-green-600 transition"
        >
          Создать из понравившихся
        </button>
      </div>
    </div>
  );
};

export default CreatePlaylist;
