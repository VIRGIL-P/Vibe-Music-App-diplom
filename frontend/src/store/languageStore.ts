import { create } from 'zustand';

interface LanguageStore {
  language: 'en' | 'ru';
  setLanguage: (lang: 'en' | 'ru') => void;
  t: (key: string) => string;
}

const translations: Record<'en' | 'ru', Record<string, string>> = {
  en: {
    // Core UI
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

    // Playlist
    createFirstPlaylist: 'Create your first playlist',
    songsYouLike: 'Your liked songs will appear here',
    saveByHeart: 'Tap the heart icon to save songs.',
    findSomething: 'Browse and find something you like',
    madeByYou: 'Made by You',

    // Form & Actions
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
    cancel: 'Cancel',
    creating: 'Creating...',
    noTracks: 'No available tracks',
    selectAtLeastOne: 'Select at least one track',
    enterPlaylistName: 'Please enter a playlist name',
    unauthorized: 'User not authorized',
    failedToCreate: 'Failed to create playlist',
    failedToAddTracks: 'Failed to add tracks',
    unknownError: 'Unknown error',
    attachFiles: 'Attach track and cover',
    specifyDuration: 'Specify duration in seconds',
    trackName: 'Track Name',
    artistName: 'Artist Name',
    album: 'Album',
    uploadAudio: 'Upload Audio',
    uploadCover: 'Upload Cover',
    upload: 'Upload',
    uploading: 'Uploading...',

    // AI Assistant
    aiAssistant: 'AI Assistant',
    askToStart: 'Ask a question to get started ✨',
    askSomething: 'Ask something...',
    aiTyping: 'AI is thinking...',
    aiError: '⚠ Error contacting AI',
    tryAssistant: 'Try AI Assistant!',

    // AI
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
    // Core UI
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

    // Playlist
    createFirstPlaylist: 'Создайте свой первый плейлист',
    songsYouLike: 'Здесь будут ваши любимые треки',
    saveByHeart: 'Добавляйте треки, нажимая на сердечко.',
    findSomething: 'Найдите что-нибудь по вкусу',
    madeByYou: 'Создано вами',

    // Form & Actions
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
    cancel: 'Отмена',
    creating: 'Создание...',
    noTracks: 'Нет доступных треков',
    selectAtLeastOne: 'Выберите хотя бы один трек',
    enterPlaylistName: 'Введите название плейлиста',
    unauthorized: 'Пользователь не авторизован',
    failedToCreate: 'Не удалось создать плейлист',
    failedToAddTracks: 'Не удалось добавить треки',
    unknownError: 'Неизвестная ошибка',
    attachFiles: 'Прикрепите трек и обложку',
    specifyDuration: 'Укажите длительность трека в секундах',
    trackName: 'Название трека',
    artistName: 'Исполнитель',
    album: 'Альбом',
    uploadAudio: 'Загрузить трек',
    uploadCover: 'Загрузить обложку',
    upload: 'Загрузить',
    uploading: 'Загрузка...',

    // AI Assistant
    aiAssistant: 'AI Ассистент',
    askToStart: 'Задай вопрос, чтобы начать ✨',
    askSomething: 'Спроси что-нибудь...',
    aiTyping: 'AI думает...',
    aiError: '⚠ Ошибка при обращении к AI',
    tryAssistant: 'Попробуй AI-ассистента!',

    // AI
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
    const value = translations[language][key];
    if (!value) {
      console.warn(`Missing translation for key: "${key}" in "${language}"`);
    }
    return value || key;
  },
}));
