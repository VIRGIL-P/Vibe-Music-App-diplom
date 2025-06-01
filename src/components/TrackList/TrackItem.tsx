
import React from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import { Track } from '../../types/music';
import { useMusicStore } from '../../store/musicStore';
import { cn } from '../../lib/utils';

interface TrackItemProps {
  track: Track;
  index: number;
  isCompact?: boolean;
  showArtist?: boolean;
  showAlbum?: boolean;
  onAddToPlaylist?: (track: Track) => void;
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  index,
  isCompact = false,
  showArtist = true,
  showAlbum = true,
  onAddToPlaylist,
}) => {
  const {
    currentTrack,
    isPlaying,
    likedTracks,
    setCurrentTrack,
    setIsPlaying,
    setQueue,
    toggleLikeTrack,
  } = useMusicStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isLiked = likedTracks.some(t => t.id === track.id);

  const handlePlay = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setQueue([track]); // Set single track queue for now
      setIsPlaying(true);
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isCompact) {
    return (
      <div className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            <img
              src={track.album_image || '/placeholder.svg'}
              alt={track.album_name}
              className="w-12 h-12 rounded object-cover"
            />
            <button
              onClick={handlePlay}
              className="absolute inset-0 bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              {isCurrentTrack && isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>
          </div>
          
          <div className="min-w-0 flex-1">
            <h4 className={cn(
              "font-medium truncate",
              isCurrentTrack ? "text-green-400" : "text-white"
            )}>
              {track.name}
            </h4>
            {showArtist && (
              <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => toggleLikeTrack(track)}
            className={cn(
              "p-1 rounded-full transition-colors",
              isLiked ? "text-green-400" : "text-gray-400 hover:text-white"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </button>
          
          {onAddToPlaylist && (
            <button
              onClick={() => onAddToPlaylist(track)}
              className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group grid grid-cols-12 gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors items-center">
      {/* Index/Play Button */}
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

      {/* Track Info */}
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
          {showArtist && (
            <p className="text-gray-400 text-sm truncate">{track.artist_name}</p>
          )}
        </div>
      </div>

      {/* Album */}
      {showAlbum && (
        <div className="col-span-3 hidden md:block">
          <p className="text-gray-400 text-sm truncate">{track.album_name}</p>
        </div>
      )}

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end space-x-2">
        <button
          onClick={() => toggleLikeTrack(track)}
          className={cn(
            "p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100",
            isLiked ? "text-green-400 opacity-100" : "text-gray-400 hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        </button>
        
        {onAddToPlaylist && (
          <button
            onClick={() => onAddToPlaylist(track)}
            className="p-1 rounded-full text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Duration */}
      <div className="col-span-1 hidden sm:block">
        <span className="text-gray-400 text-sm">{formatDuration(track.duration)}</span>
      </div>
    </div>
  );
};

export default TrackItem;
