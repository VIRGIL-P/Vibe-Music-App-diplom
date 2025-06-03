import React from "react";
import { Play, Pause, X } from "lucide-react";
import { useMusicStore } from "../../store/musicStore";
import { cn } from "../../lib/utils";

// Интерфейс трека
interface Track {
  id: string;
  name: string;
  album_name?: string;
  duration: number;
  artist_name: string;
  album_image?: string;
  audio_url?: string;
}

// Пропсы компонента
interface Props {
  track: Track;
  index: number;
  onDelete?: (trackId: string) => void;
}
const TrackWithDelete: React.FC<Props> = ({ track, index, onDelete }) => {
  const {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    setQueue,
    setIsPlaying,
    queue,
  } = useMusicStore();

  const isCurrentTrack = currentTrack?.id === track.id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);

      // Если трека нет в очереди — создаём очередь из одного трека
      if (!queue.find(t => t.id === track.id)) {
        setQueue([track]);
      }

      setIsPlaying(true);
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <div className="group grid grid-cols-12 gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors items-center">
      {/* Левая колонка: номер трека или кнопка ▶ / ❚❚ */}
      <div className="col-span-1 flex items-center justify-center">
        <span className={cn(
          "text-sm group-hover:hidden",
          isCurrentTrack ? "text-green-400" : "text-gray-400"
        )}>
          {isCurrentTrack && isPlaying ? '♪' : index + 1}
        </span>

        <button
          onClick={handlePlay}
          className="hidden group-hover:flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>
      </div>
      {/* Информация о треке: обложка, название, артист */}
      <div className="col-span-5 flex items-center space-x-3 min-w-0">
        <img
          src={track.album_image || '/placeholder.svg'}
          alt={track.album_name}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="min-w-0">
          <h4 className={cn(
            "font-medium truncate",
            isCurrentTrack ? "text-green-400" : "text-white"
          )}>
            {track.name}
          </h4>
          <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
        </div>
      </div>
      {/* Название альбома (показывается только на md+) */}
      <div className="col-span-3 hidden md:block">
        <p className="text-gray-400 text-sm truncate">{track.album_name}</p>
      </div>
      {/* Длительность и кнопка удаления */}
      <div className="col-span-3 sm:col-span-2 flex items-center justify-end space-x-3">
        <span className="text-gray-400 text-sm">{formatDuration(track.duration)}</span>
        
        {onDelete && (
          <X
            className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
            onClick={() => onDelete(track.id)}
          />
        )}
      </div>
    </div>
  );
};

export default TrackWithDelete;
