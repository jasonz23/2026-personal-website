"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

interface WaveOptions {
  lightColor: string;
  darkColor: string;
  isDark: boolean;
}

export function useWaveGL(
  containerRef: RefObject<HTMLDivElement | null>,
  options: WaveOptions,
) {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const initializedRef = useRef(false);

  // Update wireframe color on theme change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(
        options.isDark ? options.darkColor : options.lightColor,
      );
    }
  }, [options.isDark, options.lightColor, options.darkColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;
    initializedRef.current = true;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 5, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Geometry: wireframe plane
    const segments = 40;
    const geometry = new THREE.PlaneGeometry(14, 10, segments, segments);
    geometry.rotateX(-Math.PI * 0.5);
    geometryRef.current = geometry;

    // Store original positions
    const positions = geometry.attributes.position.array as Float32Array;
    positionsRef.current = new Float32Array(positions);

    // Material
    const material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: options.isDark ? options.darkColor : options.lightColor,
      transparent: true,
      opacity: 0.6,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Resize
    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    handleResize();

    // Animation
    let time = 0;
    let lastVisible = true;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Pause when not visible
      if (document.hidden) {
        lastVisible = false;
        return;
      }
      if (!lastVisible) {
        lastVisible = true;
      }

      time += 0.015;

      const pos = geometry.attributes.position.array as Float32Array;
      const original = positionsRef.current!;

      for (let i = 0; i < pos.length; i += 3) {
        const ox = original[i];
        const oz = original[i + 2];
        pos[i + 1] =
          Math.sin(ox * 0.5 + time) *
          Math.cos(oz * 0.6 + time * 0.8) *
          0.8 +
          Math.sin(ox * 0.3 - time * 0.5) * 0.4;
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      initializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
