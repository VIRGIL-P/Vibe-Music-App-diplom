
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Track, Artist, Album } from '../types/music';
import { JamendoAPI } from '../services/jamendoApi';
import TrackItem from '../components/TrackList/TrackItem';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tracks' | 'artists' | 'albums'>('all');

  useEffect(() => {
    if (query.trim()) {
      searchContent(query);
    } else {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
    }
  }, [query]);

  const searchContent = async (searchQuery: string) => {
    setLoading(true);
    try {
      const [tracksResult, artistsResult, albumsResult] = await Promise.all([
        JamendoAPI.searchTracks(searchQuery, 20),
        JamendoAPI.searchArtists(searchQuery, 10),
        JamendoAPI.searchAlbums(searchQuery, 10),
      ]);

      setTracks(tracksResult);
      setArtists(artistsResult);
      setAlbums(albumsResult);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setTracks([]);
    setArtists([]);
    setAlbums([]);
  };

  const tabs = [
    { id: 'all', label: 'All', count: tracks.length + artists.length + albums.length },
    { id: 'tracks', label: 'Songs', count: tracks.length },
    { id: 'artists', label: 'Artists', count: artists.length },
    { id: 'albums', label: 'Albums', count: albums.length },
  ];

  const showTracks = activeTab === 'all' || activeTab === 'tracks';
  const showArtists = activeTab === 'all' || activeTab === 'artists';
  const showAlbums = activeTab === 'all' || activeTab === 'albums';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black p-6 pb-32 lg:pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Search</h1>
        
        {/* Search Input */}
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/10 border border-gray-600 rounded-full py-4 px-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
        </div>
      )}

      {/* Results */}
      {query && !loading && (
        <>
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1 max-w-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label} {tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>

          {/* Tracks */}
          {showTracks && tracks.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
              <div className="bg-white/5 rounded-lg p-4">
                {tracks.slice(0, activeTab === 'tracks' ? 50 : 5).map((track, index) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    index={index}
                    isCompact
                  />
                ))}
              </div>
            </section>
          )}

          {/* Artists */}
          {showArtists && artists.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {artists.slice(0, activeTab === 'artists' ? 30 : 6).map((artist) => (
                  <Link
                    key={artist.id}
                    to={`/artist/${artist.id}`}
                    className="group text-center"
                  >
                    <div className="relative mb-3">
                      <img
                        src={artist.image || '/placeholder.svg'}
                        alt={artist.name}
                        className="w-full aspect-square rounded-full object-cover bg-gray-800"
                      />
                    </div>
                    <h3 className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                      {artist.dispname || artist.name}
                    </h3>
                    <p className="text-gray-400 text-xs">Artist</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {showAlbums && albums.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {albums.slice(0, activeTab === 'albums' ? 25 : 5).map((album) => (
                  <Link
                    key={album.id}
                    to={`/album/${album.id}`}
                    className="group"
                  >
                    <div className="relative mb-3">
                      <img
                        src={album.image || '/placeholder.svg'}
                        alt={album.name}
                        className="w-full aspect-square rounded-lg object-cover bg-gray-800"
                      />
                    </div>
                    <h3 className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">{album.artist_name}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {!loading && query && tracks.length === 0 && artists.length === 0 && albums.length === 0 && (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try searching with different keywords</p>
            </div>
          )}
        </>
      )}

      {/* Browse Categories */}
      {!query && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Pop', color: 'from-pink-500 to-red-500' },
              { name: 'Rock', color: 'from-red-500 to-orange-500' },
              { name: 'Hip Hop', color: 'from-purple-500 to-pink-500' },
              { name: 'Electronic', color: 'from-blue-500 to-purple-500' },
              { name: 'Jazz', color: 'from-yellow-500 to-red-500' },
              { name: 'Classical', color: 'from-green-500 to-blue-500' },
              { name: 'Country', color: 'from-orange-500 to-yellow-500' },
              { name: 'R&B', color: 'from-purple-500 to-blue-500' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => setQuery(category.name.toLowerCase())}
                className={`relative p-6 rounded-lg bg-gradient-to-br ${category.color} text-white font-bold text-lg hover:scale-105 transition-transform overflow-hidden`}
              >
                <span className="relative z-10">{category.name}</span>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-black/20 rounded-full transform translate-x-6 translate-y-6"></div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Search;
