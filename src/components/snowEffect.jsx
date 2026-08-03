import React, { useMemo } from "react";

const SnowEffect = () => {
  const flakes = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 5 + 3}px`,
        duration: `${Math.random() * 4 + 4}s`,
        delay: `${Math.random() * 4}s`,
        opacity: Math.random() * 0.5 + 0.4,
      })),
    []
  );

  return (
    <div className="snow-container">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="snowflake"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDuration: f.duration,
            animationDelay: f.delay,
            opacity: f.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
