import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const RainEffect = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create raindrops
    const rainCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      vertices[i * 3] = Math.random() * 1000 - 500;
      vertices[i * 3 + 1] = Math.random() * 1000; // Start from top to bottom
      vertices[i * 3 + 2] = Math.random() * 1000 - 500;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 1.5 }); // Increased size
    const rain = new THREE.Points(geometry, material);
    scene.add(rain);

    // Create dark rainy clouds
    const cloudTexture = new THREE.TextureLoader().load(
      "/path/to/cloud_texture.png",
      (texture) => {
        // Callback ensures texture is loaded before applying
        const cloudMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.7, // Adjust opacity for cloud density
          depthWrite: false, // Ensure clouds don't obscure raindrops
        });

        const cloudGeometry = new THREE.PlaneGeometry(2000, 2000); // Adjust size as needed
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        clouds.position.set(0, 0, -500); // Place clouds behind raindrops
        scene.add(clouds);
      }
    );

    // Create the ambient light
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // Create the lightning effect
    const lightning = new THREE.PointLight(0xffffff, 0, 1000); // White light
    lightning.position.set(0, 0, 0); // Center position
    scene.add(lightning);

    // Set camera position
    camera.position.z = 500;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Move raindrops downwards
      const positions = rain.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 2; // Speed of falling
        if (positions[i] < -500) {
          positions[i] = 1000; // Reset position to top
        }
      }
      rain.geometry.attributes.position.needsUpdate = true;

      // Flashing lightning effect
      if (Math.random() > 0.98) {
        // Adjust probability for flash frequency
        lightning.intensity = 10; // Bright flash
        setTimeout(() => {
          lightning.intensity = 0; // Dim after flash
        }, 100); // Flash duration
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      renderer.dispose();
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
        zIndex: 1,
      }}
    />
  );
};

export default RainEffect;
