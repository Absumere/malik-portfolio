import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const fadeInUp = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power3.out',
  });
};

export const staggerFadeInUp = (elements: string | Element[], stagger: number = 0.2) => {
  return gsap.from(elements, {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger,
    ease: 'power3.out',
  });
};

export const fadeIn = (element: string | Element, delay: number = 0) => {
  return gsap.from(element, {
    opacity: 0,
    duration: 1,
    delay,
    ease: 'power2.out',
  });
};

export const slideIn = (element: string | Element, direction: 'left' | 'right' = 'left') => {
  return gsap.from(element, {
    x: direction === 'left' ? -100 : 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });
};

export const createScrollAnimation = (element: string | Element, animation: gsap.TweenVars) => {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top 80%',
    animation: gsap.from(element, animation),
  });
};
