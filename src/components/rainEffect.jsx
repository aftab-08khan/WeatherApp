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
      vertices[i * 3 + 1] = Math.random() * 1000;
      vertices[i * 3 + 2] = Math.random() * 1000 - 500;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 1.5 });
    const rain = new THREE.Points(geometry, material);
    scene.add(rain);

    const cloudTexture = new THREE.TextureLoader().load(
      "/path/to/cloud_texture.png",
      (texture) => {
        const cloudMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
        });

        const cloudGeometry = new THREE.PlaneGeometry(2000, 2000);
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        clouds.position.set(0, 0, -500);
        scene.add(clouds);
      }
    );

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const lightning = new THREE.PointLight(0xffffff, 0, 100);
    lightning.position.set(0, 0, 0);
    scene.add(lightning);

    camera.position.z = 500;

    const animate = () => {
      requestAnimationFrame(animate);

      const positions = rain.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 2;
        if (positions[i] < -500) {
          positions[i] = 100;
        }
      }
      rain.geometry.attributes.position.needsUpdate = true;

      if (Math.random() > 0.98) {
        lightning.intensity = 10;
        setTimeout(() => {
          lightning.intensity = 0;
        }, 100);
      }

      renderer.render(scene, camera);
    };

    animate();

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
        height: "100vh",
        zIndex: 1,
      }}
    />
  );
};

export default RainEffect;
