'use client';

import { TracingBeam } from '@/components/ui';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="px-4 py-8 md:px-12 md:py-20 lg:py-24 lg:px-16">
        <TracingBeam>
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">About Me</h1>
              <p className="text-lg md:text-xl text-gray-400">
                Technical Director & Creative Technologist
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-12 md:space-y-16">
              {/* Overview */}
              <section className="space-y-4 md:space-y-6">
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="text-base md:text-lg">
                    Specializing in cutting-edge technical solutions across multiple domains, from real-time graphics and machine learning to full-stack development and creative coding. My expertise spans enterprise-level system architecture to innovative artistic installations.
                  </p>
                </div>
              </section>

              {/* Service Categories */}
              <section className="space-y-6 md:space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Services & Expertise</h2>
                
                {/* Technical Development */}
                <div className="rounded-xl border border-white/10 p-4 md:p-8 space-y-4 md:space-y-6 hover:border-white/20 transition-all">
                  <h3 className="text-xl md:text-2xl font-semibold text-primary">Technical Development</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h4 className="font-medium mb-2 text-base md:text-lg">System Architecture</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm md:text-base">
                        <li>Full-stack web applications</li>
                        <li>Real-time processing pipelines</li>
                        <li>Database architecture & optimization</li>
                        <li>WebGL/WebGPU implementations</li>
                        <li>High-performance computing systems</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-base md:text-lg">Machine Learning</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm md:text-base">
                        <li>Neural rendering (NeRFs, Gaussian Splatting)</li>
                        <li>Custom ML model development</li>
                        <li>Real-time inference optimization</li>
                        <li>Point cloud processing</li>
                        <li>Photogrammetry pipelines</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Creative Technology */}
                <div className="rounded-xl border border-white/10 p-4 md:p-8 space-y-4 md:space-y-6 hover:border-white/20 transition-all">
                  <h3 className="text-xl md:text-2xl font-semibold text-primary">Creative Technology</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h4 className="font-medium mb-2 text-base md:text-lg">Real-time Graphics</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm md:text-base">
                        <li>Three.js and WebGL development</li>
                        <li>Real-time 3D applications</li>
                        <li>Interactive installations</li>
                        <li>GPU-accelerated visualizations</li>
                        <li>Procedural generation systems</li>
                        <li>Game engine integration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-base md:text-lg">Creative Coding</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm md:text-base">
                        <li>Generative art systems</li>
                        <li>Interactive experiences</li>
                        <li>Visual programming (TouchDesigner, vvvv)</li>
                        <li>Live performance systems</li>
                        <li>Custom creative tools</li>
                        <li>Motion reactive installations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Visual Production */}
                <div className="rounded-xl border border-white/10 p-4 md:p-8 space-y-4 md:space-y-6 hover:border-white/20 transition-all">
                  <h3 className="text-xl md:text-2xl font-semibold text-primary">Visual Production</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h4 className="font-medium mb-2 text-base md:text-lg">3D & Motion</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm md:text-base">
                        <li>Motion design & animation</li>
                        <li>3D modeling & texturing</li>
                        <li>Character & environment design</li>
                        <li>Procedural asset creation</li>
                        <li>VFX & compositing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-base md:text-lg">Digital Art</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm md:text-base">
                        <li>Concept development</li>
                        <li>Digital illustration</li>
                        <li>Art direction</li>
                        <li>Brand identity design</li>
                        <li>UI/UX design systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tools & Technologies */}
              <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Tools & Technologies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-primary">Development</h3>
                    <p className="text-sm text-gray-300">
                      Python • TypeScript • Three.js • Odin • P5.js • Next.js • React • Convex • TailwindCSS • GSAP • Framer Motion • WebGL • WebGPU • C++ • VS Code
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-primary">3D & Real-time</h3>
                    <p className="text-sm text-gray-300">
                      Blender • C4D • Maya • UE5 • Houdini • SpeedTree • Gaea • ZBrush • Marvelous Designer • Character Creator • iClone • EmberGen • Lumen • Redshift • Liquigen • Substance Painter • Substance Designer • Wrap 4D • Reality Capture • Cascadeur
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-primary">VFX & Post</h3>
                    <p className="text-sm text-gray-300">
                      After Effects • DaVinci Resolve • BorisFX Silhouette • Syntheyes
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-primary">Creative Coding</h3>
                    <p className="text-sm text-gray-300">
                      TouchDesigner • Notch • Resolume • vvvv gamma • Processing • Max/MSP • Arduino • Raspberry Pi
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-primary">ML & Neural Graphics</h3>
                    <p className="text-sm text-gray-300">
                      PyTorch • TensorFlow • NeRF • Gaussian Splatting • Stable Diffusion • ComfyUI
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-primary">Design & Collaboration</h3>
                    <p className="text-sm text-gray-300">
                      Adobe Creative Suite • Figma • Git • Docker
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section className="space-y-6 mb-24">
                <h2 className="text-2xl font-semibold">Connect & Collaborate</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-2">Services</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      <li>Technical consulting & development</li>
                      <li>Creative technology solutions</li>
                      <li>Visual production & direction</li>
                      <li>System architecture design</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Engagement Types</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300">
                      <li>Project-based collaboration</li>
                      <li>Technical direction & consultation</li>
                      <li>Long-term development partnerships</li>
                      <li>Research & innovation projects</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <a
                    href="mailto:ai@malikarbab.de"
                    className="inline-block px-6 py-3 bg-white text-black rounded-full font-medium hover-lift button-glow"
                  >
                    Contact Me
                  </a>
                  <a
                    href="/portfolio"
                    className="inline-block px-6 py-3 border border-white/20 rounded-full font-medium hover:border-white/40 transition-colors"
                  >
                    View Portfolio
                  </a>
                </div>
              </section>
            </div>
          </div>
        </TracingBeam>
      </div>
    </div>
  );
}