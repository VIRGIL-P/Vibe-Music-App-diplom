import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguageStore();

  const handleSwitch = (lang: 'en' | 'ru') => {
    if (lang !== language) {
      setLanguage(lang);
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: -6 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
  };

  return (
    <div className="flex items-center gap-2">
      {/* EN Button */}
      <motion.button
        onClick={() => handleSwitch('en')}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors overflow-hidden ${
          language === 'en'
            ? 'bg-green-500 text-black shadow-md'
            : 'bg-gray-800/50 text-white hover:bg-gray-700'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={`flag-en-${language === 'en'}`}
            src="/flags/us.svg"
            alt="EN"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5"
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.span
            key={`text-en-${language}`}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="text-sm font-medium"
          >
            EN
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* RU Button */}
      <motion.button
        onClick={() => handleSwitch('ru')}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors overflow-hidden ${
          language === 'ru'
            ? 'bg-green-500 text-black shadow-md'
            : 'bg-gray-800/50 text-white hover:bg-gray-700'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={`flag-ru-${language === 'ru'}`}
            src="/flags/ru.svg"
            alt="RU"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5"
          />
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.span
            key={`text-ru-${language}`}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="text-sm font-medium"
          >
            RU
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default LanguageSwitcher;
