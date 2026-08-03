import React from "react";
import { useSpring, animated } from "@react-spring/web";

const DesertEffect = () => {
  const { opacity } = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 2000 },
  });

  return (
    <>
      {/* Glowing sun in top-right */}
      <div className="sun-overlay" />
      {/* Animated sun circle */}
      <animated.div
        style={{
          position: "fixed",
          top: "5%",
          right: "8%",
          width: "clamp(80px,12vw,160px)",
          height: "clamp(80px,12vw,160px)",
          backgroundColor: "rgba(255,223,0,0.85)",
          borderRadius: "50%",
          boxShadow: "0 0 60px rgba(255,200,0,0.6), 0 0 120px rgba(255,150,0,0.3)",
          opacity,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </>
  );
};

export default DesertEffect;
