import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const demoTracks = [
  {
    title: 'Sunset Drive',
    artist_name: 'Synth Rider',
    album: 'Neon Nights',
    image_url: 'https://via.placeholder.com/150x150.png?text=Sunset',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Ocean Dream',
    artist_name: 'Lofi Coast',
    album: 'Sea Breeze',
    image_url: 'https://via.placeholder.com/150x150.png?text=Ocean',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Midnight Chill',
    artist_name: 'LoNight',
    album: 'Dreamwave',
    image_url: 'https://via.placeholder.com/150x150.png?text=Midnight',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    title: 'Jazz Breeze',
    artist_name: 'The Smooth Ensemble',
    album: 'Evening Jazz',
    image_url: 'https://via.placeholder.com/150x150.png?text=Jazz',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    title: 'Deep Focus',
    artist_name: 'FocusMode',
    album: 'Study Vibes',
    image_url: 'https://via.placeholder.com/150x150.png?text=Focus',
    audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  }
  // можешь добавить ещё 5
];

const LoadDemoTracks = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleLoad = async () => {
    setLoading(true);
    setDone(false);

    const { error } = await supabase.from('songs').insert(demoTracks);

    setLoading(false);

    if (error) {
      console.error('❌ Ошибка при загрузке демо-треков:', error.message);
      alert('Ошибка при загрузке демо-треков.');
    } else {
      setDone(true);
    }
  };

return (
  <button
    onClick={handleLoad}
    disabled={loading}
    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out hover:scale-[1.01]
      text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 disabled:opacity-60"
  >
    {loading ? 'Загрузка...' : done ? '✅ Загружено' : '🎧 Загрузить песни'}
  </button>
);

};

export default LoadDemoTracks;
