
import { Track, Artist, Album } from '../types/music';

export const mockTracks: Track[] = [
  {
    id: '1',
    name: 'Sunset Dreams',
    artist_name: 'Alex Nova',
    artist_id: 'artist1',
    album_name: 'Urban Nights',
    album_id: 'album1',
    album_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    audiodownload: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 185,
    position: 1,
    releasedate: '2024-01-15',
    album_datecreated: '2024-01-15',
    artist_dispname: 'Alex Nova',
    license_ccurl: 'https://creativecommons.org/licenses/by/4.0/'
  },
  {
    id: '2',
    name: 'Midnight Pulse',
    artist_name: 'Sarah Moon',
    artist_id: 'artist2',
    album_name: 'Electronic Vibes',
    album_id: 'album2',
    album_image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    audiodownload: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 210,
    position: 1,
    releasedate: '2024-02-20',
    album_datecreated: '2024-02-20',
    artist_dispname: 'Sarah Moon',
    license_ccurl: 'https://creativecommons.org/licenses/by/4.0/'
  },
  {
    id: '3',
    name: 'Ocean Waves',
    artist_name: 'Blue Harmony',
    artist_id: 'artist3',
    album_name: 'Nature Sounds',
    album_id: 'album3',
    album_image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    audiodownload: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 195,
    position: 1,
    releasedate: '2024-03-10',
    album_datecreated: '2024-03-10',
    artist_dispname: 'Blue Harmony',
    license_ccurl: 'https://creativecommons.org/licenses/by/4.0/'
  },
  {
    id: '4',
    name: 'City Lights',
    artist_name: 'Metro Band',
    artist_id: 'artist4',
    album_name: 'Urban Stories',
    album_id: 'album4',
    album_image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop',
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    audiodownload: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 175,
    position: 1,
    releasedate: '2024-04-05',
    album_datecreated: '2024-04-05',
    artist_dispname: 'Metro Band',
    license_ccurl: 'https://creativecommons.org/licenses/by/4.0/'
  },
  {
    id: '5',
    name: 'Digital Revolution',
    artist_name: 'Tech Fusion',
    artist_id: 'artist5',
    album_name: 'Future Beats',
    album_id: 'album5',
    album_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    audiodownload: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: 220,
    position: 1,
    releasedate: '2024-05-12',
    album_datecreated: '2024-05-12',
    artist_dispname: 'Tech Fusion',
    license_ccurl: 'https://creativecommons.org/licenses/by/4.0/'
  }
];

export const mockArtists: Artist[] = [
  {
    id: 'artist1',
    name: 'Alex Nova',
    dispname: 'Alex Nova',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop',
    joindate: '2020-01-15',
    website: 'https://alexnova.com',
    shorturl: 'alexnova'
  },
  {
    id: 'artist2',
    name: 'Sarah Moon',
    dispname: 'Sarah Moon',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
    joindate: '2019-08-20',
    website: 'https://sarahmoon.com',
    shorturl: 'sarahmoon'
  }
];

export const mockAlbums: Album[] = [
  {
    id: 'album1',
    name: 'Urban Nights',
    artist_name: 'Alex Nova',
    artist_id: 'artist1',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    zip: '',
    shorturl: 'urban-nights',
    shareurl: 'https://vibe.app/album/urban-nights',
    datecreated: '2024-01-15',
    prouser: 'false',
    musicinfo: {
      tags: {
        genres: ['electronic', 'ambient']
      }
    }
  }
];
