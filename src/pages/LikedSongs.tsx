
import React from 'react';
import { Heart, Play, Shuffle } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';
import TrackItem from '../components/TrackList/TrackItem';

const LikedSongs = () => {
  const { likedTracks, setQueue, setCurrentTrack, setIsPlaying, setShuffle } = useMusicStore();

  const playAllLiked = () => {
    if (likedTracks.length > 0) {
      setQueue(likedTracks);
      setCurrentTrack(likedTracks[0]);
      setIsPlaying(true);
    }
  };

  const shuffleLiked = () => {
    if (likedTracks.length > 0) {
      const shuffled = [...likedTracks].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
      setCurrentTrack(shuffled[0]);
      setShuffle(true);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-black">
      {/* Header */}
      <div className="relative p-6 pb-8">
        <div className="flex items-end space-x-6">
          <div className="w-60 h-60 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg flex items-center justify-center shadow-2xl">
            <Heart className="w-24 h-24 text-white fill-current" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium mb-2">PLAYLIST</p>
            <h1 className="text-5xl font-bold text-white mb-4">Liked Songs</h1>
            <p className="text-gray-300 text-lg">
              {likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-4">
          {likedTracks.length > 0 && (
            <>
              <button
                onClick={playAllLiked}
                className="bg-green-500 hover:bg-green-600 rounded-full p-4 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Play className="w-6 h-6 text-black ml-0.5" />
              </button>
              
              <button
                onClick={shuffleLiked}
                className="p-3 text-gray-400 hover:text-white transition-colors"
              >
                <Shuffle className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Track List */}
      <div className="px-6 pb-32 lg:pb-24">
        {likedTracks.length > 0 ? (
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm font-medium border-b border-gray-700 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">TITLE</div>
              <div className="col-span-3">ALBUM</div>
              <div className="col-span-2">DATE ADDED</div>
              <div className="col-span-1">⏱</div>
            </div>
            
            {likedTracks.map((track, index) => (
              <TrackItem
                key={track.id}
                track={track}
                index={index}
                showAlbum={true}
                showArtist={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Songs you like will appear here</h3>
            <p className="text-gray-400 text-lg mb-8">
              Save songs by tapping the heart icon.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-white text-black font-medium px-8 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Find something to like
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
