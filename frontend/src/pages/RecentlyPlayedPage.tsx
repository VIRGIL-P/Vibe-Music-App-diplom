import React from 'react';
import { useMusicStore } from '@/store/musicStore';
import TrackItem from '@/components/TrackList/TrackItem';
import { Trash2 } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

const RecentlyPlayedPage = () => {
  const { recentlyPlayed, clearRecentlyPlayed } = useMusicStore();
  const { t } = useLanguageStore();

  return (
    <div className="p-6 pb-24 min-h-screen bg-gradient-to-b from-gray-900 via-black to-black">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            🕘 {t('recentlyPlayedTitle')}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {t('recentlyPlayedSubtitle')}
          </p>
        </div>

        {recentlyPlayed.length > 0 && (
          <button
            onClick={clearRecentlyPlayed}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-400 px-3 py-1.5 border border-red-400/30 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-300 transition-all shadow-sm backdrop-blur"
          >
            <Trash2 className="w-4 h-4" />
            {t('clearList')}
          </button>
        )}
      </div>

      {recentlyPlayed.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 text-lg">
          {t('noRecentlyPlayed')}
        </p>
      ) : (
        <div className="bg-white/5 rounded-lg p-4 divide-y divide-white/10">
          {recentlyPlayed.map((track, index) => (
            <div key={track.id} className="py-3">
              <TrackItem track={track} index={index} />
              <p className="text-xs text-gray-400 mt-1 ml-14">
                {t('lastPlayed')}: {new Date(track.playedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyPlayedPage;
