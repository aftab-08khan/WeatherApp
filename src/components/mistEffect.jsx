// components/MistEffect.js
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const MistEffect = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create a plane with mist material
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Add fog effect to the scene
    scene.fog = new THREE.FogExp2(0xaaaaaa, 0.1);

    // Create ambient light
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        backgroundColor: "transparent", // Ensure background is transparent
      }}
    />
  );
};

export default MistEffect;
