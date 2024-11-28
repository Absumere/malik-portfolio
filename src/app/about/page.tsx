export default function AboutPage() {
  return (
    <div className="min-h-screen p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About Me</h1>
          <p className="text-xl text-gray-400">
            Digital artist and creative developer based in Frankfurt am Main
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Bio Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Bio</h2>
            <p className="text-gray-300 leading-relaxed">
              As a digital artist and creative developer, I explore the intersection of art and technology,
              pushing the boundaries of what's possible in the digital realm. My work combines traditional
              artistic principles with cutting-edge technology, creating immersive experiences that challenge
              and inspire.
            </p>
          </section>

          {/* Skills Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Skills & Expertise</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Digital Art",
                "Creative Development",
                "UI/UX Design",
                "3D Modeling",
                "Motion Graphics",
                "AI Integration"
              ].map((skill) => (
                <div
                  key={skill}
                  className="p-4 border border-white/10 rounded-lg text-center hover:border-white/20 transition-colors"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Experience</h2>
            <div className="space-y-6">
              <div className="border-l-2 border-white/20 pl-4">
                <h3 className="font-semibold">Creative Developer</h3>
                <p className="text-gray-400">2020 - Present</p>
                <p className="text-gray-300 mt-2">
                  Leading creative technology projects and developing innovative digital experiences.
                </p>
              </div>
              <div className="border-l-2 border-white/20 pl-4">
                <h3 className="font-semibold">Digital Artist</h3>
                <p className="text-gray-400">2018 - 2020</p>
                <p className="text-gray-300 mt-2">
                  Created digital artwork for various clients and exhibitions.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="text-gray-300">
              Interested in collaboration or have a project in mind? Feel free to reach out.
            </p>
            <a
              href="mailto:contact@malikarbab.com"
              className="inline-block px-6 py-3 bg-white text-black rounded-full font-medium hover-lift button-glow"
            >
              Contact Me
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
