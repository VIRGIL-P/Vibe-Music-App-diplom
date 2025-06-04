import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
// import ThemeToggle from '../ThemeToggle'; //

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguageStore();

  const handleSwitch = (lang: 'en' | 'ru') => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleSwitch('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en'
            ? 'bg-green-500 text-black'
            : 'bg-gray-800/50 text-white hover:bg-gray-700'
        }`}
      >
        US EN
      </button>
      <button
        onClick={() => handleSwitch('ru')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'ru'
            ? 'bg-green-500 text-black'
            : 'bg-gray-800/50 text-white hover:bg-gray-700'
        }`}
      >
        RU RU
      </button>

      {/* ✅ Кнопка переключения темы */}
      {/* <ThemeToggle /> */}
    </div>
  );
};

export default LanguageSwitcher;
