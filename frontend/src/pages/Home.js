import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({ departure: '', destination: '', date: '' });
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/routes/search?departure=${searchQuery.departure}&destination=${searchQuery.destination}`);
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-primary-600 text-white overflow-hidden pb-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>

        <div className="relative container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-sm animate-fadeIn">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
            {t('heroSubtitle')}
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-5xl mx-auto transform translate-y-12 text-gray-800">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="text-left">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">{t('from')}</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  <input
                    type="text"
                    placeholder={t('placeholderFrom')}
                    value={searchQuery.departure}
                    onChange={(e) => setSearchQuery({ ...searchQuery, departure: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">{t('to')}</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  <input
                    type="text"
                    placeholder={t('placeholderTo')}
                    value={searchQuery.destination}
                    onChange={(e) => setSearchQuery({ ...searchQuery, destination: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">{t('date')}</label>
                <div className="relative group">
                  <input
                    type="date"
                    value={searchQuery.date}
                    onChange={(e) => setSearchQuery({ ...searchQuery, date: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-500 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50"
              >
                {isSearching ? '...' : t('searchBuses')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {hasSearched && (
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-3xl font-extrabold text-gray-800">
                {results.length} Available Routes
              </h2>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((route) => (
              <div key={route.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group animate-fadeIn">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-primary-500 uppercase tracking-widest mb-1">{route.distance}</span>
                    <span className="text-2xl font-black text-gray-800">{route.departure_location}</span>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">{route.estimated_time}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Dest.</span>
                    <span className="text-2xl font-black text-gray-800">{route.destination}</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-gray-100 pt-6 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-400 block mb-1">Price starts from</span>
                    <span className="text-3xl font-black text-primary-600">{route.base_price.toLocaleString()} RWF</span>
                  </div>
                  <button
                    onClick={() => navigate('/booking', {
                      state: {
                        departureLocation: route.departure_location,
                        destination: route.destination,
                        travelDate: searchQuery.date
                      }
                    })}
                    className="bg-gray-50 hover:bg-primary-600 text-gray-400 hover:text-white p-4 rounded-2xl transition-all shadow-sm hover:shadow-primary-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasSearched && results.length === 0 && !isSearching && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 mb-2">No buses found</h3>
              <p className="text-gray-400">Try searching for other locations like Kigali, Musanze, or Rubavu.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
