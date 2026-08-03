import React from "react";

const getUvMeta = (uv) => {
  if (uv <= 2) return { label: "Low",       cls: "uv-low",      bar: 20 };
  if (uv <= 5) return { label: "Moderate",  cls: "uv-moderate", bar: 45 };
  if (uv <= 7) return { label: "High",      cls: "uv-high",     bar: 65 };
  if (uv <= 10) return { label: "Very High",cls: "uv-extreme",  bar: 85 };
  return             { label: "Extreme",    cls: "uv-extreme",  bar: 100 };
};

const getHumidityMeta = (h) => {
  if (h < 30) return "Dry";
  if (h < 50) return "Comfortable";
  if (h < 70) return "Moderate";
  return "Humid";
};

const getVisibilityMeta = (v) => {
  if (v < 1) return "Very Poor";
  if (v < 4) return "Poor";
  if (v < 10) return "Moderate";
  return "Good";
};

const getWindMeta = (kph) => {
  if (kph < 5) return "Calm";
  if (kph < 20) return "Breeze";
  if (kph < 40) return "Moderate";
  if (kph < 60) return "Fresh";
  return "Strong";
};

/**
 * Apple Weather-style 2×N tile grid
 * Each tile has: icon · label top-left, big value, description bottom
 */
const MetricsGrid = ({ data }) => {
  if (!data) return null;
  const c = data.current;
  const uvMeta = getUvMeta(c.uv);

  const tiles = [
    {
      id: "uv",
      icon: "☀️",
      label: "UV INDEX",
      value: c.uv,
      desc: uvMeta.label,
      extra: (
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${uvMeta.bar}%`, background: "linear-gradient(90deg,#4ade80,#facc15,#f97316,#ef4444)", borderRadius: 99, transition: "width 1s ease" }} />
          </div>
        </div>
      ),
    },
    {
      id: "humidity",
      icon: "💧",
      label: "HUMIDITY",
      value: `${c.humidity}%`,
      desc: getHumidityMeta(c.humidity),
      extra: (
        <div style={{ marginTop: 8 }}>
          <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${c.humidity}%`, background: "linear-gradient(90deg,#60a5fa,#93c5fd)", borderRadius: 99, transition: "width 1s ease" }} />
          </div>
        </div>
      ),
    },
    {
      id: "wind",
      icon: "💨",
      label: "WIND",
      value: `${c.wind_kph}`,
      desc: `km/h · ${getWindMeta(c.wind_kph)}`,
      extra: (
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
          From {c.wind_dir} · Gusts {c.gust_kph || c.wind_kph} km/h
        </div>
      ),
    },
    {
      id: "feels",
      icon: "🌡️",
      label: "FEELS LIKE",
      value: `${Math.round(c.feelslike_c)}°`,
      desc: c.feelslike_c > c.temp_c ? "Feels warmer" : c.feelslike_c < c.temp_c ? "Feels cooler" : "Similar to actual",
    },
    {
      id: "visibility",
      icon: "👁️",
      label: "VISIBILITY",
      value: `${c.vis_km} km`,
      desc: getVisibilityMeta(c.vis_km),
    },
    {
      id: "pressure",
      icon: "🧭",
      label: "PRESSURE",
      value: `${c.pressure_mb}`,
      desc: "hPa",
    },
  ];

  return (
    <div
      className="fade-up delay-3"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 14,
      }}
    >
      {tiles.map((t) => (
        <div key={t.id} className="apple-tile">
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
            <span>{t.icon}</span> {t.label}
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 300, color: "white", lineHeight: 1, marginBottom: 2 }}>
            {t.value}
          </div>
          <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
            {t.desc}
          </div>
          {t.extra}
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
