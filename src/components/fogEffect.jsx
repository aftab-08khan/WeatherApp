import React, { useMemo } from "react";

const FogEffect = () => {
  const layers = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        top: `${10 + i * 15}%`,
        duration: `${18 + i * 5}s`,
        delay: `-${i * 4}s`,
        opacity: 0.25 + i * 0.05,
      })),
    []
  );

  return (
    <div className="fog-container">
      {layers.map((l) => (
        <div
          key={l.id}
          className="fog-layer"
          style={{
            top: l.top,
            animationDuration: l.duration,
            animationDelay: l.delay,
            opacity: l.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default FogEffect;
