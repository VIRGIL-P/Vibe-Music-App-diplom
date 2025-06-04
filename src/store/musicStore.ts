import { create } from 'zustand';
import { Track, PlayerState, Playlist } from '../types/music';
import { supabase } from '@/lib/supabaseClient';
import type { UserResource } from '@clerk/types';

interface MusicStore extends PlayerState {
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

  likedTracks: Track[];
  playlists: Playlist[];
  recentlyPlayed: Track[];
  allTracks: Track[];
  loadingLikes: boolean;

  toggleLikeTrack: (user: UserResource, track: Track) => Promise<void>;
  loadLikedTracks: (user: UserResource, allTracks: Track[]) => Promise<void>;
  fetchLikedTracks: () => Promise<void>;
  setLoadingLikes: (value: boolean) => void;
  addToRecentlyPlayed: (track: Track) => void;
  createPlaylist: (data: { name: string; description: string; tracks: Track[] }) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  setAllTracks: (tracks: Track[]) => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,
  queue: [],
  currentIndex: 0,

  allTracks: [],
  likedTracks: [],
  playlists: [],
  recentlyPlayed: [],
  loadingLikes: false,

  setCurrentTrack: (track) => {
    const { queue } = get();
    const index = queue.findIndex(t => t.id === track.id);
    set({ currentTrack: track, currentIndex: index >= 0 ? index : 0 });
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
      } else return;
    }

    if (queue[nextIndex]) get().setCurrentTrack(queue[nextIndex]);
  },

  playPrevious: () => {
    const { queue, currentIndex } = get();
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    if (queue[prevIndex]) get().setCurrentTrack(queue[prevIndex]);
  },

  toggleLikeTrack: async (user, track) => {
    const { likedTracks } = get();
    const isLiked = likedTracks.some(t => t.id === track.id);

    if (isLiked) {
      const { error } = await supabase
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", track.id);

      if (error) return console.error("❌ Ошибка удаления лайка:", error.message);

      set({ likedTracks: likedTracks.filter(t => t.id !== track.id) });
    } else {
      const { error } = await supabase.from("liked_songs").insert({
        user_id: user.id,
        song_id: track.id,
      });

      if (error) return console.error("❌ Ошибка добавления лайка:", error.message);

      set({ likedTracks: [...likedTracks, track] });
    }
  },

  loadLikedTracks: async (user, allTracks) => {
    get().setLoadingLikes(true);
    const { data, error } = await supabase
      .from("liked_songs")
      .select("song_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Ошибка загрузки лайков:", error);
      return get().setLoadingLikes(false);
    }

    const likedTracks = allTracks.filter(track => data.some(item => item.song_id === track.id));
    set({ likedTracks });
    get().setLoadingLikes(false);
  },

  fetchLikedTracks: async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data, error } = await supabase
        .from("liked_songs")
        .select(`
          song_id,
          songs:song_id (
            id,
            name,
            artist_name,
            album,
            duration,
            album_image,
            audio_url,
            user_id
          )
        `)
        .eq("user_id", user.id);

      if (!error && data) {
        const songs: Track[] = data
          .map((entry): Track | null => {
            const s: any = entry.songs;
            if (!s) return null;

            return {
              id: String(s.id),
              name: String(s.name),
              artist_name: String(s.artist_name ?? ''),
              artist_id: '',
              album_name: String(s.album ?? ''),
              album_id: '',
              album_image: String(s.album_image ?? ''),
              audio: String(s.audio_url ?? ''),
              audiodownload: '',
              duration: Number(s.duration ?? 0),
              position: 0,
              releasedate: '',
              album_datecreated: '',
              artist_dispname: '',
              license_ccurl: '',
              user_id: String(s.user_id ?? '')
            };
          })
          .filter((s): s is Track => s !== null);

        set({ likedTracks: songs });
      }
    } catch (err) {
      console.error("Ошибка при загрузке likedTracks:", err);
    }
  },

  setLoadingLikes: (value) => set({ loadingLikes: value }),

  addToRecentlyPlayed: (track) => {
    const { recentlyPlayed } = get();
    const filtered = recentlyPlayed.filter(t => t.id !== track.id);
    set({ recentlyPlayed: [track, ...filtered].slice(0, 50) });
  },

  createPlaylist: ({ name, description, tracks }) => {
    const { playlists } = get();
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      image: "",
      tracks,
      created_at: new Date().toISOString(),
      user_id: "current_user",
    };
    set({ playlists: [...playlists, newPlaylist] });
  },

  addToPlaylist: (playlistId, track) => {
    const { playlists } = get();
    const updated = playlists.map(p =>
      p.id === playlistId && !p.tracks.some(t => t.id === track.id)
        ? { ...p, tracks: [...p.tracks, track] }
        : p
    );
    set({ playlists: updated });
  },

  removeFromPlaylist: (playlistId, trackId) => {
    const { playlists } = get();
    const updated = playlists.map(p =>
      p.id === playlistId
        ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId) }
        : p
    );
    set({ playlists: updated });
  },

  deletePlaylist: (playlistId) => {
    const { playlists } = get();
    set({ playlists: playlists.filter(p => p.id !== playlistId) });
  },

  updatePlaylist: (playlistId, updates) => {
    const { playlists } = get();
    const updated = playlists.map(p =>
      p.id === playlistId ? { ...p, ...updates } : p
    );
    set({ playlists: updated });
  },

  setAllTracks: (tracks) => set({ allTracks: tracks }),
}));
