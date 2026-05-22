'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpaceBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    // ---------- SCÈNE ----------
    const scene = new THREE.Scene();

    // ---------- CAMÉRA (yeux du voyageur) ----------
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // ---------- MOTEUR DE RENDU WebGL ----------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Fond transparent pour laisser voir le CSS derrière
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    // ---------- TEXTURE RONDE POUR ÉTOILES ----------
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const ctx = starCanvas.getContext('2d');

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 14);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const starTexture = new THREE.CanvasTexture(starCanvas);

    // ---------- ÉTOILES (4000 particules) ----------
    const starsCount = 4000;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      starsPositions[i * 3] = (Math.random() - 0.5) * 200;
      starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        starsColors[i * 3] = 1;
        starsColors[i * 3 + 1] = 1;
        starsColors[i * 3 + 2] = 1;
      } else if (colorChoice < 0.75) {
        starsColors[i * 3] = 0.4;
        starsColors[i * 3 + 1] = 0.6;
        starsColors[i * 3 + 2] = 1;
      } else {
        starsColors[i * 3] = 1;
        starsColors[i * 3 + 1] = 0.7;
        starsColors[i * 3 + 2] = 0.2;
      }
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(starsPositions, 3)
    );
    starsGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(starsColors, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: starTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // ---------- POUSSIÈRE (nébuleuse) ----------
    const dustCount = 2500;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 300;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 150;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }

    dustGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(dustPositions, 3)
    );

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x4488ff,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.4,
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // ---------- SPHÈRES POLYGONALES ----------
    const sphereGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, -2);
    scene.add(sphere);

    const sphere2Geometry = new THREE.IcosahedronGeometry(2.5, 2);
    const sphere2Material = new THREE.MeshBasicMaterial({
      color: 0x6699ff,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
    sphere2.position.set(0, 0, -2);
    scene.add(sphere2);

    // ---------- ANIMATION ----------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const speed = 3;

      camera.position.z -= speed * delta;
      if (camera.position.z < -80) {
        camera.position.z = 5;
      }

      stars.rotation.x += 0.01 * delta;
      stars.rotation.y += 0.02 * delta;
      dust.rotation.x -= 0.005 * delta;
      dust.rotation.y += 0.01 * delta;

      const pos = stars.geometry.attributes.position.array;
      for (let i = 0; i < starsCount; i++) {
        pos[i * 3 + 2] -= speed * delta * 0.4;
        if (pos[i * 3 + 2] < -100) {
          pos[i * 3 + 2] = 100;
          pos[i * 3] = (Math.random() - 0.5) * 200;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
        }
      }
      stars.geometry.attributes.position.needsUpdate = true;

      const dustPos = dust.geometry.attributes.position.array;
      for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3 + 2] -= speed * delta * 0.2;
        if (dustPos[i * 3 + 2] < -150) {
          dustPos[i * 3 + 2] = 150;
          dustPos[i * 3] = (Math.random() - 0.5) * 300;
          dustPos[i * 3 + 1] = (Math.random() - 0.5) * 150;
        }
      }
      dust.geometry.attributes.position.needsUpdate = true;

      sphere.rotation.x += 0.15 * delta;
      sphere.rotation.y += 0.25 * delta;
      sphere2.rotation.x -= 0.1 * delta;
      sphere2.rotation.y -= 0.2 * delta;

      sphere.position.z = camera.position.z - 3;
      sphere2.position.z = camera.position.z - 3;

      renderer.render(scene, camera);
    }

    animate();

    // ---------- REDIMENSIONNEMENT ----------
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}