// components/DesertEffect.js
import React from "react";
import { useSpring, animated } from "@react-spring/web";
import HeatWaveEffect from "./heatWave/heatWave";

const DesertEffect = () => {
  // Animation for sun
  const { opacity } = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 2000 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #FFD700 0%, #FF6347 100%)", // Sandy desert color gradient
        zIndex: 1,
      }}
    >
      <animated.div
        style={{
          position: "absolute",
          top: "6%",
          left: "20%",
          transform: "translateX(-50%)",
          width: "20vw",
          height: "20vw",
          maxWidth: "200px",
          maxHeight: "200px",
          backgroundColor: "rgba(255, 223, 0, 0.8)", // Bright sun
          borderRadius: "50%",
          boxShadow: "0 0 100px rgba(255, 223, 0, 0.5)",
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "30%",
          background: "rgba(139, 69, 19, 0.8)", // Sandy color for ground
        }}
      />
      <HeatWaveEffect /> {/* Add heat wave effect */}
    </div>
  );
};

export default DesertEffect;
