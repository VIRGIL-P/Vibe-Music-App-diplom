
import React from 'react';
import { useLanguageStore } from '../../store/languageStore';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-1">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
          language === 'en' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="text-lg">🇺🇸</span>
        <span className="text-sm font-medium">EN</span>
      </button>
      <button
        onClick={() => setLanguage('ru')}
        className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
          language === 'ru' ? 'bg-green-500 text-black' : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="text-lg">🇷🇺</span>
        <span className="text-sm font-medium">RU</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
