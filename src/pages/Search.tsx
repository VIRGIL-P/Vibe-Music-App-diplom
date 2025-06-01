
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import TrackItem from '../components/TrackList/TrackItem';
import { mockTracks } from '../data/mockMusic';
import LanguageSwitcher from '../components/Layout/LanguageSwitcher';

const Search = () => {
  const [query, setQuery] = useState('');
  const [filteredTracks, setFilteredTracks] = useState(mockTracks);
  const { t } = useLanguageStore();

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredTracks(mockTracks);
    } else {
      const filtered = mockTracks.filter(track => 
        track.name.toLowerCase().includes(query.toLowerCase()) ||
        track.artist_name.toLowerCase().includes(query.toLowerCase()) ||
        track.album_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTracks(filtered);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">{t('search')}</h1>
        <LanguageSwitcher />
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Search Results */}
      <div className="pb-32 lg:pb-24">
        {query.trim() === '' ? (
          <div className="text-center py-20">
            <SearchIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">{t('search')}</h3>
            <p className="text-gray-400 text-lg">
              {t('searchPlaceholder')}
            </p>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-4">
            {filteredTracks.length > 0 ? (
              <>
                <h2 className="text-xl font-bold text-white mb-4">
                  {filteredTracks.length} results for "{query}"
                </h2>
                {filteredTracks.map((track, index) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    index={index}
                    isCompact
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-20">
                <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                <p className="text-gray-400">
                  Try searching for something else
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
