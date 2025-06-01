
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume, Heart } from 'lucide-react';
import { useMusicStore } from '../../store/musicStore';
import { cn } from '../../lib/utils';

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    repeat,
    shuffle,
    likedTracks,
    queue,
    setIsPlaying,
    setProgress,
    setDuration,
    setRepeat,
    setShuffle,
    setVolume,
    playNext,
    playPrevious,
    toggleLikeTrack,
  } = useMusicStore();

  const isLiked = currentTrack ? likedTracks.some(track => track.id === currentTrack.id) : false;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Use a simple test audio for demo
    audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCD2U4f3dbSkNdL7m/aJCAQpQlePtnWshFz6i4f7YdCgN";
    audio.load();

    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setProgress(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentTrack?.duration || 0);
    };

    const handleEnded = () => {
      if (repeat === 'track') {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isSeeking, repeat, playNext, setProgress, setDuration, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = parseFloat(e.target.value);
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleRepeat = () => {
    const modes: Array<'off' | 'track' | 'playlist'> = ['off', 'track', 'playlist'];
    const currentIndex = modes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeat(modes[nextIndex]);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />
      
      {/* Desktop Player */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-md border-t border-gray-800/50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Track Info */}
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <img
              src={currentTrack.album_image || '/placeholder.svg'}
              alt={currentTrack.album_name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h4 className="text-white font-medium truncate">{currentTrack.name}</h4>
              <p className="text-gray-400 text-sm truncate">{currentTrack.artist_name}</p>
            </div>
            <button
              onClick={() => toggleLikeTrack(currentTrack)}
              className={cn(
                "p-2 rounded-full transition-colors",
                isLiked ? "text-green-400 hover:text-green-300" : "text-gray-400 hover:text-white"
              )}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  shuffle ? "text-green-400" : "text-gray-400 hover:text-white"
                )}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={queue.length <= 1}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="bg-white text-black rounded-full p-3 hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              
              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={queue.length <= 1}
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              <button
                onClick={toggleRepeat}
                className={cn(
                  "p-2 rounded-full transition-colors relative",
                  repeat !== 'off' ? "text-green-400" : "text-gray-400 hover:text-white"
                )}
              >
                <Repeat className="w-4 h-4" />
                {repeat === 'track' && (
                  <span className="absolute -top-1 -right-1 text-xs bg-green-400 text-black rounded-full w-4 h-4 flex items-center justify-center">1</span>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(progress)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || currentTrack?.duration || 0}
                value={progress}
                onChange={handleSeek}
                onMouseDown={() => setIsSeeking(true)}
                onMouseUp={() => setIsSeeking(false)}
                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-xs text-gray-400 w-10">
                {formatTime(duration || currentTrack?.duration || 0)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Mobile Player */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-md border-t border-gray-800/50">
        <div className="px-4 py-3">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || currentTrack?.duration || 0}
            value={progress}
            onChange={handleSeek}
            onTouchStart={() => setIsSeeking(true)}
            onTouchEnd={() => setIsSeeking(false)}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider mb-3"
          />
          
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <img
                src={currentTrack.album_image || '/placeholder.svg'}
                alt={currentTrack.album_name}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-white text-sm font-medium truncate">{currentTrack.name}</h4>
                <p className="text-gray-400 text-xs truncate">{currentTrack.artist_name}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleLikeTrack(currentTrack)}
                className={cn(
                  "p-2 transition-colors",
                  isLiked ? "text-green-400" : "text-gray-400"
                )}
              >
                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              </button>
              
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-white transition-colors p-1"
                disabled={queue.length <= 1}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              
              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors p-1"
                disabled={queue.length <= 1}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
