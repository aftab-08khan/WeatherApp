import React, { useEffect, useState, useCallback } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import MetricsGrid from "./components/MetricsGrid";
import ForecastRow from "./components/ForecastRow";
import HourlyScroll from "./components/HourlyScroll";
import HourlyChart from "./components/HourlyChart";
import RainEffect from "./components/rainEffect";
import SnowEffect from "./components/snowEffect";
import FogEffect from "./components/fogEffect";
import DesertEffect from "./components/desertEffect";
import HeatWaveEffect from "./components/heatWave/heatWave";

const API_KEY = import.meta.env.VITE_WEATHER_API;

/* ─── Time-of-day background class ──────────────────────────── */
const getTimeBg = () => {
  const h = new Date().getHours();
  if (h >= 5  && h < 7)  return "bg-dawn";
  if (h >= 7  && h < 11) return "bg-morning";
  if (h >= 11 && h < 14) return "bg-noon";
  if (h >= 14 && h < 18) return "bg-afternoon";
  if (h >= 18 && h < 21) return "bg-evening";
  return "bg-night";
};

/* ─── Condition-based tint overlay class ────────────────────── */
const getConditionTint = (condition = "") => {
  const c = condition.toLowerCase();
  if (c.includes("thunder") || c.includes("storm")) return "tint-thunder";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("shower")) return "tint-rain";
  if (c.includes("snow") || c.includes("blizzard") || c.includes("ice")) return "tint-snow";
  if (c.includes("fog") || c.includes("mist") || c.includes("haze")) return "tint-fog";
  return null;
};

/* ─── Weather effects ────────────────────────────────────────── */
const getWeatherType = (condition = "") => {
  const c = condition.toLowerCase();
  if (c.includes("thunder") || c.includes("storm")) return "thunder";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("shower") || c.includes("sleet")) return "rain";
  if (c.includes("snow") || c.includes("blizzard") || c.includes("ice") || c.includes("freezing")) return "snow";
  if (c.includes("fog") || c.includes("mist") || c.includes("haze") || c.includes("smoke")) return "fog";
  if (c.includes("sunny") || c.includes("clear") || c.includes("hot")) return "sunny";
  return "default";
};

/* ─── Loading Skeleton ───────────────────────────────────────── */
const Skeleton = () => (
  <div style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>
    {/* Hero */}
    <div style={{ textAlign: "center", padding: "8px 0 32px" }}>
      <div className="skeleton" style={{ width: 160, height: 28, margin: "0 auto 8px" }} />
      <div className="skeleton" style={{ width: 100, height: 96, margin: "0 auto 8px", borderRadius: 16 }} />
      <div className="skeleton" style={{ width: 120, height: 18, margin: "0 auto" }} />
    </div>
    {/* Hourly */}
    <div className="apple-panel" style={{ padding: "16px 20px", marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="skeleton" style={{ width: 68, height: 110, borderRadius: 99 }} />
        ))}
      </div>
    </div>
    {/* Metrics */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />
      ))}
    </div>
  </div>
);

/* ─── Error Banner ───────────────────────────────────────────── */
const ErrorBanner = ({ msg, onDismiss }) => (
  <div
    className="apple-panel fade-in"
    style={{ maxWidth: 560, margin: "0 auto 20px", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(239,68,68,0.35)" }}
  >
    <span style={{ fontSize: "1.3rem" }}>⚠️</span>
    <span style={{ flex: 1, color: "white", fontWeight: 500 }}>{msg}</span>
    <button onClick={onDismiss} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "1rem" }}>✕</button>
  </div>
);

/* ─── Inner App ──────────────────────────────────────────────── */
const AppInner = () => {
  const { theme } = useTheme();
  const [city, setCity]         = useState("London");
  const [data, setData]         = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [unit, setUnit]         = useState("C");

  const fetchWeather = useCallback(async (location) => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const [curRes, fxRes] = await Promise.all([
        fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`),
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=5&aqi=no&alerts=no`),
      ]);
      if (!curRes.ok) {
        const err = await curRes.json();
        throw new Error(err?.error?.message || `City "${location}" not found`);
      }
      const [cur, fx] = await Promise.all([curRes.json(), fxRes.json()]);
      setData(cur);
      setForecast(fx.forecast);
    } catch (e) {
      setError(e.message);
      setData(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWeather(city); }, [city, fetchWeather]);

  const handleSearch   = (q) => { if (q.trim()) setCity(q.trim()); };
  const handleGeolocate = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setCity(`${coords.latitude},${coords.longitude}`),
      () => setError("Unable to access your location.")
    );
  };

  const condition   = data?.current?.condition?.text || "";
  const weatherType = getWeatherType(condition);
  const timeBg      = getTimeBg();
  const condTint    = getConditionTint(condition);

  return (
    <div
      style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}
    >
      {/* Base time-of-day gradient */}
      <div className={`${condTint || timeBg}`} style={{ position: "fixed", inset: 0, zIndex: 0 }} />

      {/* Weather particle overlays */}
      {(weatherType === "rain")    && <RainEffect heavy={false} />}
      {(weatherType === "thunder") && <RainEffect heavy={true} />}
      {(weatherType === "snow")    && <SnowEffect />}
      {(weatherType === "fog")     && <FogEffect />}
      {(weatherType === "sunny")   && <><DesertEffect /><HeatWaveEffect /></>}

      {/* Scrollable content */}
      <div style={{ position: "relative", zIndex: 10, padding: "clamp(20px,4vw,36px) clamp(16px,4vw,24px) 60px", maxWidth: 600, margin: "0 auto" }}>

        <SearchBar
          onSearch={handleSearch}
          onGeolocate={handleGeolocate}
          unit={unit}
          onUnitToggle={() => setUnit((u) => (u === "C" ? "F" : "C"))}
          loading={loading}
        />

        {error && <ErrorBanner msg={error} onDismiss={() => setError(null)} />}

        {loading && <Skeleton />}

        {!loading && data && (
          <>
            {/* Apple-style hero: no card, text on gradient */}
            <WeatherCard data={data} unit={unit} />

            {/* Horizontal capsule hourly */}
            <HourlyScroll forecast={forecast} unit={unit} />

            {/* 5-day forecast rows */}
            <ForecastRow forecast={forecast} unit={unit} />

            {/* 2-col metric tiles */}
            <MetricsGrid data={data} />

            {/* SVG chart */}
            <HourlyChart forecast={forecast} unit={unit} />

            {/* Summary quote tile */}
            {data.current.condition.text && (
              <div className="apple-panel fade-up" style={{ padding: "18px 20px", marginBottom: 14, animationDelay: "0.5s" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  🌐 Condition Summary
                </div>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  Currently <strong>{data.current.condition.text}</strong> in {data.location.name}.
                  Wind blowing <strong>{data.current.wind_dir}</strong> at <strong>{data.current.wind_kph} km/h</strong>.
                  Humidity at <strong>{data.current.humidity}%</strong> with a UV index of <strong>{data.current.uv}</strong>.
                  Last updated: <strong>{data.current.last_updated?.split(" ")[1]}</strong>.
                </p>
              </div>
            )}
          </>
        )}

        {!loading && !data && !error && (
          <div className="apple-panel fade-in" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌍</div>
            <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
              Search for a city to see the weather
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 20, fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
          Powered by WeatherAPI.com · SkyCast {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AppInner />
  </ThemeProvider>
);

export default App;
