import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { useInView } from 'react-intersection-observer';
import { useArtworks } from '@/hooks/useArtworks';
import { cn } from '@/lib/utils';

interface TurntableGalleryProps {
  className?: string;
}

export const TurntableGallery = ({ className }: TurntableGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const itemsRef = useRef<THREE.Group | null>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const { artworks } = useArtworks();

  useEffect(() => {
    if (!containerRef.current || !artworks?.length) return;

    // Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create items group
    const items = new THREE.Group();
    itemsRef.current = items;
    scene.add(items);

    // Add artwork planes
    const radius = 4;
    artworks.forEach((artwork, index) => {
      const texture = new THREE.TextureLoader().load(artwork.imageUrl);
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      const angle = (index / artworks.length) * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.rotation.y = -angle;
      
      items.add(mesh);
    });

    // Animation
    let rotationSpeed = 0.001;
    const animate = () => {
      if (itemsRef.current) {
        itemsRef.current.rotation.y += rotationSpeed;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      rotationSpeed = 0.001 + x * 0.002;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }

      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rendererRef.current?.domElement) {
        containerRef.current?.removeChild(rendererRef.current.domElement);
      }
    };
  }, [artworks]);

  // Entrance animation when in view
  useEffect(() => {
    if (inView && itemsRef.current) {
      gsap.from(itemsRef.current.position, {
        y: -10,
        duration: 1.5,
        ease: 'power4.out',
      });
      gsap.to(itemsRef.current.rotation, {
        y: Math.PI * 2,
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  }, [inView]);

  return (
    <div 
      ref={(el) => {
        containerRef.current = el;
        inViewRef(el);
      }}
      className={cn(
        'w-full h-[600px] relative overflow-hidden',
        className
      )}
    />
  );
};
