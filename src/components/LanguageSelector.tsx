import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        <div className="flex items-center justify-center space-x-2 w-[30px]">
          <span className="text-lg">{currentLang?.flag}</span>
        </div>
        <ChevronDown
          className={`transform transition-transform dark:text-slate-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>

      {isOpen && (
        <div
          className={`
          absolute w-40 z-50 max-h-64 overflow-y-auto rounded-lg shadow-lg border
          bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700
          bottom-full mb-2             /* Default: mobile - open upward */
          sm:top-full sm:bottom-auto sm:mb-0 sm:mt-2  /* Desktop: open downward */
        `}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                changeLanguage(language.code);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex w-full items-center space-x-2">
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {currentLanguage === language.code && (
                <Check className="text-blue-600" size={20} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
