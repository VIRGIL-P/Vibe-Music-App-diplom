export interface Track {
  id: string;
  name: string;
  artist_name: string;
  artist_id: string;
  album_name: string;
  album_id: string;
  album_image: string;
  audio: string;
  audiodownload: string;
  duration: number;
  position: number;
  releasedate: string;
  album_datecreated: string;
  artist_dispname: string;
  license_ccurl: string;
  user_id: string; // ✅ добавлено для поддержки Supabase user_id
}

export interface Artist {
  id: string;
  name: string;
  dispname: string;
  image: string;
  joindate: string;
  website: string;
  shorturl: string;
}

export interface Album {
  id: string;
  name: string;
  artist_name: string;
  artist_id: string;
  image: string;
  zip: string;
  shorturl: string;
  shareurl: string;
  datecreated: string;
  prouser: string;
  musicinfo: {
    tags: {
      genres: string[];
    };
  };
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  tracks: Track[];
  created_at: string;
  user_id: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  repeat: 'off' | 'track' | 'playlist';
  shuffle: boolean;
  queue: Track[];
  currentIndex: number;
}
