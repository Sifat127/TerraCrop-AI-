import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, translations, TranslationDictionary } from './translations';

export type TextSize = 'normal' | 'large' | 'extra-large';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  t: TranslationDictionary;
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeechSupported: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY_LANG = 'terracrop_language';
const STORAGE_KEY_TEXT_SIZE = 'terracrop_text_size';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'bn') return saved;
    } catch {}
    return 'en';
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEXT_SIZE);
      if (saved === 'normal' || saved === 'large' || saved === 'extra-large') return saved;
    } catch {}
    return 'normal';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSpeechSupported(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {}
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    try {
      localStorage.setItem(STORAGE_KEY_TEXT_SIZE, size);
    } catch {}
  };

  // Text-To-Speech implementation
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown/special characters from text for smooth speech
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.95; // Slightly slower for clarity with farmers
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const t = translations[language];

  // Apply text size class to root or container
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-extra-large');
    root.classList.add(`text-size-${textSize}`);
  }, [textSize]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        textSize,
        setTextSize,
        t,
        isSpeaking,
        speak,
        stopSpeaking,
        isSpeechSupported
      }}
    >
      <div className={`terracrop-root text-size-${textSize} font-sans min-h-screen ${language === 'bn' ? 'lang-bn' : 'lang-en'}`}>
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
