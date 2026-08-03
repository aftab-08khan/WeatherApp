import React, { useMemo } from "react";

/**
 * Apple Weather-style horizontal hourly scroll — pill capsules
 */
const HourlyScroll = ({ forecast, unit }) => {
  const hours = useMemo(() => {
    if (!forecast?.forecastday?.[0]?.hour) return [];
    // Show all 24 hours but start from current hour
    const allHours = [
      ...(forecast.forecastday[0]?.hour || []),
      ...(forecast.forecastday[1]?.hour || []),
    ];
    const now = new Date();
    const currentHour = now.getHours();
    // Find index of current hour in today's data
    const startIdx = forecast.forecastday[0].hour.findIndex((h) => {
      const hr = parseInt(h.time.split(" ")[1].split(":")[0]);
      return hr >= currentHour;
    });
    const start = startIdx === -1 ? 0 : startIdx;
    return allHours.slice(start, start + 24);
  }, [forecast]);

  if (!hours.length) return null;

  const now = new Date();
  const currentHour = now.getHours();

  return (
    <div className="apple-panel fade-up delay-1" style={{ padding: "16px 20px", marginBottom: 14 }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
        <span>🕐</span> Hourly Forecast
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {hours.map((h, i) => {
          const hr = parseInt(h.time.split(" ")[1].split(":")[0]);
          const label = i === 0 ? "Now" : h.time.split(" ")[1].slice(0, 5);
          const temp = unit === "C" ? Math.round(h.temp_c) : Math.round(h.temp_f);
          const icon = `https:${h.condition.icon}`;
          const isNow = i === 0;

          return (
            <div key={h.time} className={`hour-capsule${isNow ? " active" : ""}`}>
              <span style={{ fontSize: "0.7rem", fontWeight: isNow ? 700 : 500, color: isNow ? "white" : "rgba(255,255,255,0.65)" }}>
                {label}
              </span>
              {h.chance_of_rain > 20 && (
                <span style={{ fontSize: "0.62rem", color: "#93c5fd", fontWeight: 600 }}>
                  {h.chance_of_rain}%
                </span>
              )}
              <img src={icon} alt="" style={{ width: 28, height: 28 }} />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>
                {temp}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyScroll;
