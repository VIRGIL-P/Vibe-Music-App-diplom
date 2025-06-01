
import { create } from 'zustand';
import { Track, PlayerState, Playlist } from '../types/music';

interface MusicStore extends PlayerState {
  // Player actions
  setCurrentTrack: (track: Track) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setRepeat: (repeat: 'off' | 'track' | 'playlist') => void;
  setShuffle: (shuffle: boolean) => void;
  setQueue: (queue: Track[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  
  // Library state
  likedTracks: Track[];
  playlists: Playlist[];
  recentlyPlayed: Track[];
  
  // Library actions
  toggleLikeTrack: (track: Track) => void;
  addToRecentlyPlayed: (track: Track) => void;
  createPlaylist: (name: string, description: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  // Initial player state
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,
  queue: [],
  currentIndex: 0,
  
  // Initial library state
  likedTracks: [],
  playlists: [],
  recentlyPlayed: [],
  
  // Player actions
  setCurrentTrack: (track) => {
    set({ currentTrack: track, currentIndex: get().queue.findIndex(t => t.id === track.id) });
    get().addToRecentlyPlayed(track);
  },
  
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setRepeat: (repeat) => set({ repeat }),
  setShuffle: (shuffle) => set({ shuffle }),
  setQueue: (queue) => set({ queue }),
  
  playNext: () => {
    const { queue, currentIndex, repeat, shuffle } = get();
    let nextIndex = currentIndex + 1;
    
    if (shuffle && queue.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === currentIndex);
    } else if (nextIndex >= queue.length) {
      if (repeat === 'playlist') {
        nextIndex = 0;
      } else {
        return;
      }
    }
    
    if (queue[nextIndex]) {
      get().setCurrentTrack(queue[nextIndex]);
    }
  },
  
  playPrevious: () => {
    const { queue, currentIndex } = get();
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    
    if (queue[prevIndex]) {
      get().setCurrentTrack(queue[prevIndex]);
    }
  },
  
  // Library actions
  toggleLikeTrack: (track) => {
    const { likedTracks } = get();
    const isLiked = likedTracks.some(t => t.id === track.id);
    
    if (isLiked) {
      set({ likedTracks: likedTracks.filter(t => t.id !== track.id) });
    } else {
      set({ likedTracks: [...likedTracks, track] });
    }
  },
  
  addToRecentlyPlayed: (track) => {
    const { recentlyPlayed } = get();
    const filtered = recentlyPlayed.filter(t => t.id !== track.id);
    set({ recentlyPlayed: [track, ...filtered].slice(0, 50) });
  },
  
  createPlaylist: (name, description) => {
    const { playlists } = get();
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      image: '',
      tracks: [],
      created_at: new Date().toISOString(),
      user_id: 'current_user', // This will be replaced with actual user ID from auth
    };
    
    set({ playlists: [...playlists, newPlaylist] });
  },
  
  addToPlaylist: (playlistId, track) => {
    const { playlists } = get();
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        const trackExists = playlist.tracks.some(t => t.id === track.id);
        if (!trackExists) {
          return { ...playlist, tracks: [...playlist.tracks, track] };
        }
      }
      return playlist;
    });
    
    set({ playlists: updatedPlaylists });
  },
  
  removeFromPlaylist: (playlistId, trackId) => {
    const { playlists } = get();
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, tracks: playlist.tracks.filter(t => t.id !== trackId) };
      }
      return playlist;
    });
    
    set({ playlists: updatedPlaylists });
  },
  
  deletePlaylist: (playlistId) => {
    const { playlists } = get();
    set({ playlists: playlists.filter(p => p.id !== playlistId) });
  },
  
  updatePlaylist: (playlistId, updates) => {
    const { playlists } = get();
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, ...updates };
      }
      return playlist;
    });
    
    set({ playlists: updatedPlaylists });
  },
}));
