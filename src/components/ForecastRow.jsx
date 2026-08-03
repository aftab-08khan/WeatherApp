import React from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Apple Weather-style 5-day forecast — full-width panel with rows,
 * each row: Day | Icon | Rain% bar | Low — ████ — High
 */
const ForecastRow = ({ forecast, unit }) => {
  if (!forecast?.forecastday) return null;

  // Find global min/max for consistent bar scaling
  const allHighs = forecast.forecastday.map((d) =>
    unit === "C" ? d.day.maxtemp_c : d.day.maxtemp_f
  );
  const allLows = forecast.forecastday.map((d) =>
    unit === "C" ? d.day.mintemp_c : d.day.mintemp_f
  );
  const globalMin = Math.min(...allLows);
  const globalMax = Math.max(...allHighs);
  const range = globalMax - globalMin || 1;

  return (
    <div className="apple-panel fade-up delay-2" style={{ padding: "16px 20px", marginBottom: 14 }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <span>📅</span> 5-Day Forecast
      </div>

      {forecast.forecastday.map((day, i) => {
        const date    = new Date(day.date);
        const dayName = i === 0 ? "Today" : DAYS[date.getDay()];
        const high    = unit === "C" ? Math.round(day.day.maxtemp_c) : Math.round(day.day.maxtemp_f);
        const low     = unit === "C" ? Math.round(day.day.mintemp_c) : Math.round(day.day.mintemp_f);
        const icon    = `https:${day.day.condition.icon}`;
        const rain    = day.day.daily_chance_of_rain;

        // Position of bar within global range
        const barLeft  = ((low  - globalMin) / range) * 100;
        const barWidth = ((high - low) / range) * 100;

        return (
          <div key={day.date} className="forecast-row">
            {/* Day */}
            <span style={{ width: 48, fontSize: "0.95rem", fontWeight: i === 0 ? 700 : 500, color: "white", flexShrink: 0 }}>
              {dayName}
            </span>

            {/* Icon */}
            <img src={icon} alt="" style={{ width: 28, height: 28, flexShrink: 0 }} />

            {/* Rain chance */}
            <span style={{ width: 36, fontSize: "0.72rem", color: "#93c5fd", fontWeight: 600, textAlign: "right", flexShrink: 0 }}>
              {rain > 5 ? `${rain}%` : ""}
            </span>

            {/* Low temp */}
            <span style={{ width: 32, textAlign: "right", fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", fontWeight: 500, flexShrink: 0 }}>
              {low}°
            </span>

            {/* Gradient temp bar */}
            <div style={{ flex: 1, position: "relative" }}>
              <div className="temp-bar-track">
                <div
                  className="temp-bar-fill"
                  style={{
                    position: "absolute",
                    left: `${barLeft}%`,
                    width: `${Math.max(barWidth, 6)}%`,
                    height: "100%",
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>

            {/* High temp */}
            <span style={{ width: 32, textAlign: "left", fontSize: "0.9rem", color: "white", fontWeight: 600, flexShrink: 0, paddingLeft: 8 }}>
              {high}°
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ForecastRow;
