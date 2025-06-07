import { X } from "lucide-react";
import { Track } from "../../types/music";
import { useMusicStore } from "../../store/musicStore";

interface Props {
  track: Track;
  playlistId: string;
}

const PlaylistTrackItem = ({ track, playlistId }: Props) => {
  const { removeFromPlaylist } = useMusicStore();

  return (
    <div className="flex justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-lg transition">
      <div>
        <p className="text-white font-medium">{track.name}</p>
        <p className="text-gray-400 text-sm">{track.artist_name}</p>
      </div>
      <button
        onClick={() => removeFromPlaylist(playlistId, track.id)}
        className="text-red-400 hover:text-red-300 transition"
        title="Удалить трек"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PlaylistTrackItem;
