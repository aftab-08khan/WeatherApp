import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const SearchBar = ({ onSearch, onGeolocate, unit, onUnitToggle, loading }) => {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API;

  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
        );
        const d = await res.json();
        setSuggestions(d.slice(0, 6));
        setShowSuggestions(true);
      } catch { setSuggestions([]); }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    const fn = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSelect = (name) => { onSearch(name); setQuery(""); setSuggestions([]); setShowSuggestions(false); };
  const handleKeyDown = (e) => { if (e.key === "Enter" && query.trim()) handleSelect(query.trim()); };

  return (
    <div ref={wrapperRef} style={{ position: "relative", zIndex: 60, width: "100%", maxWidth: 600, margin: "0 auto 28px" }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "1.5rem" }}>🌤</span>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "white", letterSpacing: "-0.02em", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>SkyCast</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button id="unit-toggle" onClick={onUnitToggle}
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 99, padding: "6px 14px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em" }}>
            °{unit} ⇄ °{unit === "C" ? "F" : "C"}
          </button>
          <button id="theme-toggle" onClick={toggle} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 99, padding: "6px 12px", fontSize: "1rem", cursor: "pointer" }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Search row */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 14, overflow: "visible" }}>
            <span style={{ paddingLeft: 14, fontSize: "1rem", opacity: 0.8 }}>🔍</span>
            <input id="city-search" type="text" placeholder="Search city, region or country..."
              value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="search-input"
              style={{ flex: 1, background: "transparent", border: "none", color: "white", fontSize: "0.95rem", padding: "13px 12px", fontFamily: "inherit", fontWeight: 500 }} />
            {query && (
              <button onClick={() => { setQuery(""); setSuggestions([]); }}
                style={{ paddingRight: 12, background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
            )}
          </div>
          {/* Autocomplete */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="apple-panel fade-in" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, padding: 8, zIndex: 100 }}>
              {suggestions.map((s) => (
                <div key={s.id} className="autocomplete-item" onClick={() => handleSelect(s.name)}>
                  <span style={{ marginRight: 8 }}>📍</span>
                  <strong>{s.name}</strong>
                  <span style={{ marginLeft: 6, opacity: 0.6, fontSize: "0.8rem" }}>
                    {s.region && `${s.region}, `}{s.country}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button id="search-btn" onClick={() => query.trim() && handleSelect(query.trim())} disabled={loading}
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 14, padding: "0 20px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
          {loading ? "⏳" : "Search"}
        </button>
        <button id="geolocate-btn" onClick={onGeolocate} title="Use my location"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 14, padding: "0 14px", fontSize: "1.1rem", cursor: "pointer" }}>
          📍
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
