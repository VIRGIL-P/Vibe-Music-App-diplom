import { create } from 'zustand';
import { Track, PlayerState, Playlist } from '../types/music';
import { supabase } from '@/lib/supabaseClient';

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
  
fetchPlaylists: () => Promise<void>;


  likedTracks: Track[];
  setLikedTracks: (tracks: Track[]) => void;
  playlists: Playlist[];
  recentlyPlayed: (Track & { playedAt: string })[];
  allTracks: Track[];
  loadingLikes: boolean;

  toggleLikeTrack: (userId: string, track: Track) => Promise<void>;
  loadLikedTracks: (userId: string, allTracks: Track[]) => Promise<void>;
  fetchLikedTracks: () => Promise<void>;
  setLoadingLikes: (value: boolean) => void;
  addToRecentlyPlayed: (track: Track) => void;
  clearRecentlyPlayed: () => void;
  createPlaylist: (data: { name: string; description: string; tracks: Track[] }) => Promise<Playlist | undefined>;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  setAllTracks: (tracks: Track[]) => void;
  setPlaylists: (playlists: Playlist[]) => void;
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

  toggleLikeTrack: async (userId, track) => {
    console.log("🧪 toggleLikeTrack:", { userId, trackId: track.id });

    if (!userId || !track?.id) {
      console.warn("⚠️ toggleLikeTrack: userId или track.id отсутствуют");
      return;
    }

    const { likedTracks } = get();
    const isLiked = likedTracks.some(t => t.id === track.id);

    if (isLiked) {
      const { error } = await supabase
        .from("liked_songs")
        .delete()
        .eq("user_id", userId)
        .eq("song_id", track.id);

      if (error) {
        console.error("❌ Ошибка при удалении лайка:", error.message);
        return;
      }

      set({ likedTracks: likedTracks.filter(t => t.id !== track.id) });
    } else {
      const { error } = await supabase.from("liked_songs").insert({
        user_id: userId,
        song_id: track.id,
      });

      if (error) {
        console.error("❌ Ошибка при добавлении лайка:", error.message);
        return;
      }

      set({ likedTracks: [...likedTracks, track] });
    }
  },

  loadLikedTracks: async (userId, allTracks) => {
    get().setLoadingLikes(true);
    const { data, error } = await supabase
      .from("liked_songs")
      .select("song_id")
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Ошибка при загрузке лайков:", error.message);
      get().setLoadingLikes(false);
      return;
    }

    const likedTracks = allTracks.filter(track =>
      data.some(item => item.song_id === track.id)
    );

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
              audio_url: String(s.audio_url ?? ''),
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
      console.error("❌ Ошибка при fetchLikedTracks:", err);
    }
  },

  setLoadingLikes: (value) => set({ loadingLikes: value }),

addToRecentlyPlayed: (track) => {
  const { recentlyPlayed } = get();

  const now = new Date().toISOString();
  const filtered = recentlyPlayed.filter((item) => item.id !== track.id);

  const updated = [
    { ...track, playedAt: now },
    ...filtered,
  ].slice(0, 50);

  set({ recentlyPlayed: updated });
  localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
},


clearRecentlyPlayed: () => {
  set({ recentlyPlayed: [] });
  localStorage.removeItem('recentlyPlayed');
},

createPlaylist: async ({ name, description, tracks }) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("❌ Ошибка получения пользователя");
    return;
  }

  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    console.warn("⛔ createPlaylist: пустые или некорректные треки");
    return;
  }

  const cleanTracks = tracks.map((t) => ({
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
    artist_name: String(t.artist_name ?? ''),
    album_name: String(t.album_name ?? ''),
    duration: Number(t.duration ?? 0),
    album_image: String(t.album_image ?? ''),
    audio_url: String(t.audio_url ?? ''),
  }));

  const { data, error } = await supabase
    .from("playlists")
    .insert([
      {
        name,
        description,
        image: "",
        tracks: cleanTracks,
        user_id: user.id,
      },
    ])
    .select("*")
    .single();

  if (error || !data) {
    console.error("❌ Ошибка при создании плейлиста:", error?.message);
    return;
  }

  const created = {
    ...data,
    tracks: Array.isArray(data.tracks)
      ? data.tracks
      : typeof data.tracks === 'string'
      ? JSON.parse(data.tracks)
      : [],
  };

  set((state) => ({
    playlists: [created, ...state.playlists],
  }));

  return created;
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

deletePlaylist: async (playlistId) => {
  const { playlists } = get();

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);

  if (error) {
    console.error("❌ Ошибка при удалении плейлиста из Supabase:", error.message);
    return;
  }

  set({ playlists: playlists.filter(p => p.id !== playlistId) });

  // 👇 ДОБАВЬ ЭТО
  await get().fetchPlaylists();
},


  updatePlaylist: (playlistId, updates) => {
    const { playlists } = get();
    const updated = playlists.map(p =>
      p.id === playlistId ? { ...p, ...updates } : p
    );
    set({ playlists: updated });
  },

  setAllTracks: (tracks) => set({ allTracks: tracks }),

  setPlaylists: (playlists) => set({ playlists }),
  
  setLikedTracks: (tracks) => set({ likedTracks: tracks }),


fetchPlaylists: async () => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Ошибка при загрузке плейлистов:", error.message);
    return;
  }

  const parsedPlaylists: Playlist[] = data
    .map((item) => {
      let parsedTracks: Track[] = [];

      try {
        parsedTracks = Array.isArray(item.tracks)
          ? item.tracks
          : typeof item.tracks === "string"
          ? JSON.parse(item.tracks)
          : [];
      } catch (e) {
        console.warn("⚠️ Невалидный JSON в tracks:", item.tracks);
        parsedTracks = [];
      }

      return {
        ...item,
        tracks: parsedTracks,
      };
    })
    .filter((p) => Array.isArray(p.tracks) && p.tracks.length > 0); // 👈 вот ЭТА СТРОКА важна

  set({ playlists: parsedPlaylists });
},

}));


try {
  const saved = localStorage.getItem('recentlyPlayed');
  if (saved) {
    useMusicStore.setState({ recentlyPlayed: JSON.parse(saved) });
  }
} catch (e) {
  console.warn("❌ Ошибка восстановления recentlyPlayed:", e);
}
