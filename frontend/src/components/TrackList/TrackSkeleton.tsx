import React from 'react';

const TrackSkeleton: React.FC = () => {
  return (
    <div className="flex items-center animate-pulse space-x-4 py-2">
      <div className="w-10 h-10 bg-gray-700 rounded-md" />
      <div className="flex-1 space-y-1">
        <div className="h-4 bg-gray-700 rounded w-3/5" />
        <div className="h-3 bg-gray-600 rounded w-2/5" />
      </div>
    </div>
  );
};

export default TrackSkeleton;
