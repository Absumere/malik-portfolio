'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useEffect } from 'react';

function MovingPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime = { value: 0 };
    }
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[10, 10, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        transparent={true}
        vertexShader={`
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;

          void main() {
            vUv = uv;
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float elevation = sin(modelPosition.x * 3.0 + uTime) * 0.2
                          + sin(modelPosition.y * 2.0 + uTime) * 0.2;
            modelPosition.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * viewMatrix * modelPosition;
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            float colorIntensity = (vElevation + 0.2) * 0.5;
            vec3 color = mix(
              vec3(0.0, 0.0, 0.0),  // Black
              vec3(0.1, 0.1, 0.2),  // Very dark blue
              colorIntensity
            );
            float alpha = smoothstep(-1.0, 1.0, vElevation) * 0.3;
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

export function Background() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={['#000000']} />
        <MovingPlane />
      </Canvas>
    </div>
  );
}
