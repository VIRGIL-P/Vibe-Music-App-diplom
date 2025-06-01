
import { create } from 'zustand';

interface LanguageStore {
  language: 'en' | 'ru';
  setLanguage: (lang: 'en' | 'ru') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: 'Home',
    search: 'Search',
    library: 'Your Library',
    liked: 'Liked Songs',
    createPlaylist: 'Create Playlist',
    recentlyPlayed: 'Recently Played',
    featuredTracks: 'Featured Tracks',
    trending: 'Trending Now',
    newReleases: 'New Releases',
    madeForYou: 'Made for You',
    discoverWeekly: 'Discover weekly',
    songs: 'songs',
    song: 'song',
    playAll: 'Play All',
    shuffle: 'Shuffle',
    songsYouLike: 'Songs you like will appear here',
    saveByHeart: 'Save songs by tapping the heart icon.',
    findSomething: 'Find something to like',
    madeByYou: 'Made by You',
    createFirstPlaylist: 'Create your first playlist',
    easyHelp: "It's easy, we'll help you",
    searchPlaceholder: 'What do you want to listen to?'
  },
  ru: {
    home: 'Главная',
    search: 'Поиск',
    library: 'Ваша музыка',
    liked: 'Любимые песни',
    createPlaylist: 'Создать плейлист',
    recentlyPlayed: 'Недавно прослушанное',
    featuredTracks: 'Рекомендуемые треки',
    trending: 'В тренде',
    newReleases: 'Новинки',
    madeForYou: 'Для вас',
    discoverWeekly: 'Музыка недели',
    songs: 'песен',
    song: 'песня',
    playAll: 'Воспроизвести',
    shuffle: 'Перемешать',
    songsYouLike: 'Здесь будут песни, которые вам нравятся',
    saveByHeart: 'Сохраняйте песни, нажимая на сердечко.',
    findSomething: 'Найти что-то интересное',
    madeByYou: 'Ваши плейлисты',
    createFirstPlaylist: 'Создайте свой первый плейлист',
    easyHelp: 'Это просто, мы поможем',
    searchPlaceholder: 'Что хотите послушать?'
  }
};

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key: string) => {
    const { language } = get();
    return translations[language][key as keyof typeof translations.en] || key;
  }
}));
