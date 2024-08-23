import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Box, Typography } from '@mui/material';

interface CubeLoaderProps {
  size?: number;
}

const CubeLoader: React.FC<CubeLoaderProps> = ({ size = 100 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState('.');

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true // Enable antialiasing
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio); // Adjust for high DPI displays
    mountRef.current.appendChild(renderer.domElement);

    // Main cube group
    const mainCube = new THREE.Group();
    scene.add(mainCube);

    // Blue gradient colors
    const colors = [
      0x8B4513, /* חום כהה */
      0xA0522D, /* חום חם */
      0xCD853F, /* חום בינוני */
      0xD2B48C, /* בז' כהה */
      0xDEB887, /* בז' בהיר */
      0xD3D3D3, /* אפרפר בהיר */
      
    ];

    // Create small cubes
    const smallCubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cubes: THREE.Mesh[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const colorIndex = Math.abs(x) + Math.abs(y) + Math.abs(z);
          const material = new THREE.MeshPhongMaterial({ 
            color: colors[colorIndex],
            shininess: 100,
            specular: 0x111111
          });
          const cube = new THREE.Mesh(smallCubeGeometry, material);
          cube.position.set(x, y, z);
          mainCube.add(cube);
          cubes.push(cube);
        }
      }
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Rotate main cube
      mainCube.rotation.x += 0.005;
      mainCube.rotation.y += 0.005;

      // Pulsate and separate small cubes
      const pulseFactor = Math.sin(elapsedTime * 2) * 0.2;
      cubes.forEach((cube) => {
        const originalPos = new THREE.Vector3(
          Math.round(cube.position.x),
          Math.round(cube.position.y),
          Math.round(cube.position.z)
        );
        cube.position.copy(originalPos).multiplyScalar(1.1 + pulseFactor);
      });

      renderer.render(scene, camera);
    };

    animate();

    const dotInterval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) return '.';
        return prevDots + '.';
      });
    }, 500);

    // Clean up
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      clearInterval(dotInterval);
    };
  }, [size]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div ref={mountRef} style={{ width: size, height: size }} />
      <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold', direction: 'rtl' }}>
        מעבד נתונים {dots}
      </Typography>
    </Box>
    )
};

export default CubeLoader;