import React, { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

type Language = "ru" | "en" | "uz" | "kk" | "ky" | "tg" | "zh";

const lang: Language = (localStorage.getItem("i18nextLng") as Language) || "ru";

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  languages: { code: Language; name: string; flag: string; currency: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(lang);

  const languages = [
    { code: "en" as Language, name: "English", flag: "🇺🇸", currency: "USD" },
    { code: "ru" as Language, name: "Русский", flag: "🇷🇺", currency: "RUB" },
    { code: "uz" as Language, name: "O'zbekcha", flag: "🇺🇿", currency: "UZS" },
    { code: "kk" as Language, name: "Қазақша", flag: "🇰🇿", currency: "KZT" },
    { code: "ky" as Language, name: "Кыргызча", flag: "🇰🇬", currency: "KGS" },
    { code: "tg" as Language, name: "Тоҷикӣ", flag: "🇹🇯", currency: "TJS" },
    { code: "zh" as Language, name: "中文", flag: "🇨🇳", currency: "CNY" },
  ];

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang); // <-- Qo'shildi
    const selectedLanguage = languages.find(
      (language) => language.code === lang
    );
    if (selectedLanguage) {
      console.log("Selected country currency:", selectedLanguage.currency);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
