import React, { useMemo } from "react";

const RainEffect = ({ heavy = false }) => {
  const drops = useMemo(() => {
    const count = heavy ? 80 : 50;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${Math.random() * 40 + 20}px`,
      duration: `${Math.random() * 0.5 + 0.5}s`,
      delay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.4 + 0.3,
    }));
  }, [heavy]);

  return (
    <div className="rain-container">
      {drops.map((d) => (
        <div
          key={d.id}
          className="raindrop"
          style={{
            left: d.left,
            height: d.height,
            animationDuration: d.duration,
            animationDelay: d.delay,
            opacity: d.opacity,
          }}
        />
      ))}
      {/* Lightning overlay for thunderstorms */}
      {heavy && <div className="lightning-overlay" />}
    </div>
  );
};

export default RainEffect;
