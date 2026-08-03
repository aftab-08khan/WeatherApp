import React from "react";

/**
 * Apple Weather-style Hero card:
 * City name → condition → giant temperature → H/L range
 * No card background — text sits directly on the gradient
 */
const WeatherCard = ({ data, unit }) => {
  if (!data) return null;

  const temp      = unit === "C" ? Math.round(data.current.temp_c) : Math.round(data.current.temp_f);
  const feelsLike = unit === "C" ? Math.round(data.current.feelslike_c) : Math.round(data.current.feelslike_f);
  const condition = data.current.condition.text;
  const iconUrl   = `https:${data.current.condition.icon}`;
  const localtime = data.location.localtime?.split(" ")[1] || "";

  return (
    <div className="fade-up" style={{ textAlign: "center", padding: "8px 0 32px", position: "relative", zIndex: 10 }}>
      {/* City */}
      <div className="hero-city" style={{ marginBottom: 4 }}>
        {data.location.name}
      </div>

      {/* Local time */}
      {localtime && (
        <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
          {localtime} local time
        </div>
      )}

      {/* Big Temperature */}
      <div className="hero-temp" style={{ margin: "8px 0 4px" }}>
        {temp}°
      </div>

      {/* Condition + icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
        <img src={iconUrl} alt={condition} className="anim-float" style={{ width: 32, height: 32 }} />
        <span className="hero-condition">{condition}</span>
      </div>

      {/* Feels like */}
      <div className="hero-range" style={{ marginBottom: 2 }}>
        Feels like {feelsLike}°{unit}
      </div>

      {/* Country */}
      <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
        {data.location.region && `${data.location.region}, `}{data.location.country}
      </div>
    </div>
  );
};

export default WeatherCard;
