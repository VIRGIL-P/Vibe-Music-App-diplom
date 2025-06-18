import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMusicStore } from "../store/musicStore";
import type { Track } from "../types/music"; // убедись, что путь правильный

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const creatingRef = useRef(false);
  const navigate = useNavigate();

  const {
    likedTracks,
    createPlaylist,
    fetchPlaylists,
  } = useMusicStore();

  const handleCreate = async () => {
    if (creatingRef.current) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Введите название плейлиста");
      return;
    }

    if (!likedTracks || !Array.isArray(likedTracks) || likedTracks.length === 0) {
      alert("Нет понравившихся треков");
      return;
    }

    creatingRef.current = true;

    try {
      const cleanTracks: Track[] = likedTracks.map((t) => ({
        id: String(t.id ?? ""),
        name: String(t.name ?? ""),
        artist_name: String(t.artist_name ?? ""),
        album_name: String(t.album_name ?? ""),
        album_image: String(t.album_image ?? ""),
        audio_url: String(t.audio_url ?? ""),
        duration: Number(t.duration ?? 0),
        album_id: "",
        artist_id: "",
        audiodownload: "",
        position: 0,
        releasedate: "",
        album_datecreated: "",
        artist_dispname: "",
        license_ccurl: "",
        user_id: String(t.user_id ?? "")
      }));

      const newPlaylist = {
        name: trimmedName,
        description: "Плейлист из понравившихся треков",
        tracks: cleanTracks,
      };

      console.log("📤 Отправка в createPlaylist:", newPlaylist);

      const created = await createPlaylist(newPlaylist);

      if (created?.id) {
        console.log("✅ Плейлист успешно создан:", created);
        await fetchPlaylists();
        alert(`✅ Плейлист "${trimmedName}" создан из ${likedTracks.length} треков`);
        navigate(`/playlist/${created.id}`);
      } else {
        alert("Ошибка: плейлист не был создан");
      }
    } catch (err) {
      console.error("❌ Ошибка при создании плейлиста:", err);
      alert("Произошла ошибка при создании плейлиста");
    } finally {
      creatingRef.current = false;
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
          disabled={creatingRef.current}
        >
          {creatingRef.current ? "Создание..." : "Создать из понравившихся"}
        </button>
      </div>
    </div>
  );
};

export default CreatePlaylist;
