import { create } from 'zustand';

interface LanguageStore {
  language: 'en' | 'ru';
  setLanguage: (lang: 'en' | 'ru') => void;
  t: (key: string) => string;
}

const translations: Record<'en' | 'ru', Record<string, string>> = {
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
    discoverWeekly: 'Discover Weekly',
    songs: 'songs',
    song: 'song',
    playAll: 'Play All',
    shuffle: 'Shuffle',
    songsYouLike: 'Your liked songs will appear here',
    saveByHeart: 'Tap the heart icon to save songs.',
    findSomething: 'Browse and find something you like',
    madeByYou: 'Made by You',
    createFirstPlaylist: 'Create your first playlist',
    easyHelp: "It's simple — we’ll help you",
    searchPlaceholder: 'What do you want to listen to?',
    login: 'Log In',
    signup: 'Sign Up',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    logout: 'Log Out',
    welcomeBack: 'Welcome back',
    continueListening: 'Continue listening',
    playNow: 'Play Now',
    uploadTrack: 'Upload Track',

    // AI & advanced
    aiRecommendations: 'AI Recommendations',
    genre: 'Genre',
    artistSearchTitle: 'Search',
    showMore: 'Show More',

    // Recently Played
    recentlyPlayedTitle: 'Recently Played',
    recentlyPlayedSubtitle: 'Tracks you recently listened to',
    lastPlayed: 'Last played',
    clearList: 'Clear list',
  },

  ru: {
    home: 'Главная',
    search: 'Поиск',
    library: 'Ваша библиотека',
    liked: 'Понравившиеся',
    createPlaylist: 'Создать плейлист',
    recentlyPlayed: 'Недавно слушали',
    featuredTracks: 'Рекомендуемые треки',
    trending: 'Популярное',
    newReleases: 'Новые релизы',
    madeForYou: 'Подборки для вас',
    discoverWeekly: 'Открытия недели',
    songs: 'песен',
    song: 'песня',
    playAll: 'Воспроизвести всё',
    shuffle: 'Перемешать',
    songsYouLike: 'Здесь будут ваши любимые треки',
    saveByHeart: 'Добавляйте треки, нажимая на сердечко.',
    findSomething: 'Найдите что-нибудь по вкусу',
    madeByYou: 'Создано вами',
    createFirstPlaylist: 'Создайте свой первый плейлист',
    easyHelp: 'Это просто — мы поможем',
    searchPlaceholder: 'Что вы хотите послушать?',
    login: 'Войти',
    signup: 'Регистрация',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    logout: 'Выйти',
    welcomeBack: 'С возвращением',
    continueListening: 'Продолжайте слушать',
    playNow: 'Слушать сейчас',
    uploadTrack: 'Загрузить трек',

    // AI & advanced
    aiRecommendations: 'Рекомендации от ИИ',
    genre: 'Жанр',
    artistSearchTitle: 'Искать',
    showMore: 'Показать ещё',

    // Recently Played
    recentlyPlayedTitle: 'Недавно слушали',
    recentlyPlayedSubtitle: 'Треки, которые вы недавно прослушали',
    lastPlayed: 'Последний раз',
    clearList: 'Очистить список',
  },
};

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key: string) => {
    const { language } = get();
    return translations[language][key] || key;
  },
}));