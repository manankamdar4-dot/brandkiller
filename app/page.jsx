'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import SearchResults from '@/components/SearchResults';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch search suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const { data, error: queryError } = await supabase
            .from('products')
            .select('brand_name')
            .ilike('brand_name', `%${searchQuery}%`)
            .limit(8);

          if (!queryError && data) {
            // Remove duplicates and get unique brand names
            const uniqueSuggestions = [...new Set(data.map(item => item.brand_name))];
            setSuggestions(uniqueSuggestions);
            setShowSuggestions(true);
          }
        } catch (err) {
          // Silently fail for suggestions
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const { data, error: queryError } = await supabase
        .from('products')
        .select('*')
        .ilike('brand_name', `%${searchQuery}%`)
        .limit(10);

      if (queryError) {
        throw queryError;
      }

      if (data) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Trigger search automatically
    const fakeEvent = { preventDefault: () => {} };
    handleSearch(fakeEvent);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestionIndex]);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-green-50 to-purple-100">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo/Title */}
        <div className="mb-12 w-full max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-2 text-center">
            Brand<span className="text-red-600">Killer</span>
          </h1>
          <p className="text-center text-gray-600 mt-2 text-lg">Find cheaper generic alternatives without compromise in the quality</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8 relative">
          <div className="relative">
            <div className="flex items-center w-full border-2 border-gray-300 rounded-full shadow-lg hover:shadow-xl focus-within:shadow-xl focus-within:border-red-500 transition-all bg-white">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                placeholder="Search for a brand name..."
                className="flex-1 px-6 py-4 text-lg rounded-full focus:outline-none bg-transparent text-black placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-4 text-gray-500 hover:text-red-600 focus:outline-none disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    className={`w-full text-left px-6 py-3 hover:bg-red-50 transition-colors ${
                      index === selectedSuggestionIndex ? 'bg-red-50' : ''
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${
                      index === suggestions.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-gray-700">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="w-full max-w-4xl mt-8">
            <SearchResults results={results} />
          </div>
        )}

        {/* No Results Message */}
        {!loading && searchQuery && results.length === 0 && !error && (
          <div className="mt-8 text-gray-500 text-lg">
            No results found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </main>
  );
}

