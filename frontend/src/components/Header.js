import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, t, toggleLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: 'EN' },
    { code: 'rw', name: 'Kinyarwanda', flag: 'RW' }
  ];

  return (
    <header className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-2xl font-bold tracking-tight">{t('brand')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              <Link to="/" className="hover:text-primary-200 transition-colors">{t('home')}</Link>
              <Link to="/about" className="hover:text-primary-200 transition-colors">{t('about')}</Link>
              <Link to="/contact" className="hover:text-primary-200 transition-colors">{t('contact')}</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-1 hover:text-primary-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.183 16.635 5 20.25" />
                  </svg>
                  <span className="uppercase text-sm font-bold">{language}</span>
                </button>

                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          toggleLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === lang.code ? 'font-bold text-primary-600' : ''}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/login" className="hover:text-primary-200 transition-colors font-semibold">
                {t('login')}
              </Link>
              <Link to="/register" className="bg-white text-primary-600 px-5 py-2 rounded-lg hover:bg-primary-50 transition-colors font-bold shadow-sm">
                {t('register')}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 border-t border-primary-500 animate-fadeIn">
            <div className="flex flex-col space-y-4 text-center">
              <Link to="/" className="text-lg py-2" onClick={() => setIsMenuOpen(false)}>{t('home')}</Link>
              <Link to="/about" className="text-lg py-2" onClick={() => setIsMenuOpen(false)}>{t('about')}</Link>
              <Link to="/contact" className="text-lg py-2" onClick={() => setIsMenuOpen(false)}>{t('contact')}</Link>
              <div className="flex justify-center space-x-4 py-2 border-y border-primary-500">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      toggleLanguage(lang.code);
                      setIsMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded ${language === lang.code ? 'bg-white text-primary-600 font-bold' : ''}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              <Link to="/login" className="text-lg py-2 font-semibold" onClick={() => setIsMenuOpen(false)}>{t('login')}</Link>
              <Link to="/register" className="bg-white text-primary-600 py-3 rounded-lg font-bold mx-4" onClick={() => setIsMenuOpen(false)}>{t('register')}</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
