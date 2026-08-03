import React, { useMemo } from "react";

/**
 * SVG temperature sparkline inside an Apple-glass panel
 * Shows today's 24h hourly temperatures with animated draw
 */
const HourlyChart = ({ forecast, unit }) => {
  const hours = useMemo(() => {
    if (!forecast?.forecastday?.[0]?.hour) return [];
    return forecast.forecastday[0].hour;
  }, [forecast]);

  if (!hours.length) return null;

  const temps = hours.map((h) => (unit === "C" ? Math.round(h.temp_c) : Math.round(h.temp_f)));
  const minT  = Math.min(...temps);
  const maxT  = Math.max(...temps);
  const range = maxT - minT || 1;

  const W = 640, H = 90, padX = 16, padY = 16;
  const chartW = W - padX * 2;
  const chartH = H - padY;

  const pts = temps.map((t, i) => [
    padX + (i / (temps.length - 1)) * chartW,
    padY + ((maxT - t) / range) * chartH,
  ]);

  // Smooth bezier path
  const pathD = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = pts[i - 1];
    const mx = (px + x) / 2;
    return acc + ` C${mx},${py} ${mx},${y} ${x},${y}`;
  }, "");

  const areaD = pathD + ` L${pts[pts.length-1][0]},${H+padY} L${pts[0][0]},${H+padY} Z`;

  return (
    <div className="apple-panel fade-up delay-4" style={{ padding: "16px 20px", marginBottom: 14 }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <span>📊</span> Temperature Today
      </div>
      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H + padY * 2}`} style={{ width: "100%", minWidth: 300, height: "auto", display: "block" }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaD} fill="url(#areaGrad)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinecap="round" className="chart-line" />

          {/* Points + labels (every 3rd hour) */}
          {pts.map(([x, y], i) => {
            if (i % 3 !== 0 && i !== 0 && i !== pts.length - 1) return null;
            const hr = hours[i].time.split(" ")[1].slice(0, 5);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={3} fill="white" />
                <text x={x} y={y - 9} textAnchor="middle" fontSize={9} fontWeight={600} fill="rgba(255,255,255,0.85)">
                  {temps[i]}°
                </text>
                <text x={x} y={H + padY * 1.7} textAnchor="middle" fontSize={8.5} fill="rgba(255,255,255,0.45)">
                  {hr}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default HourlyChart;
