import React from 'react';


const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-300 space-y-12">
        <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                About VEO Superprompt Generator
            </h1>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                Empowering creativity in the age of AI video.
            </p>
        </header>

        <section className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed">
            Our mission is to democratize high-quality video creation by providing creators, artists, and storytellers with a powerful yet intuitive tool. We believe that the future of video production lies at the intersection of human creativity and artificial intelligence. This Superprompt Generator is designed to be the bridge between your imagination and the incredible capabilities of AI video models, making prompt engineering accessible to everyone, regardless of technical expertise.
          </p>
        </section>

        <section className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">The Technology</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            The VEO Superprompt Generator is built on a foundation of cutting-edge technology to deliver a seamless and intelligent user experience:
          </p>
          <ul className="list-disc list-inside space-y-3 text-slate-400">
            <li><strong>Google's Gemini API:</strong> At the core of our application is Google's powerful `gemini-2.5-flash` model. It powers our "Inspire Me" feature for creative suggestions and, most importantly, handles the complex task of interpreting your inputs and structuring them into a precise JSON format that AI video models can understand.</li>
            <li><strong>React & TypeScript:</strong> The user interface is built with React, a modern JavaScript library for building dynamic and responsive applications. We use TypeScript to ensure the code is robust, scalable, and maintainable.</li>
            <li><strong>Tailwind CSS:</strong> For a sleek, futuristic design that is both beautiful and functional, we utilize Tailwind CSS, a utility-first CSS framework that allows for rapid UI development.</li>
          </ul>
        </section>

        <section className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">The Future</h2>
          <p className="text-slate-400 leading-relaxed">
            The world of AI is evolving at an incredible pace, and so are we. We are committed to continuously updating the Superprompt Generator with new features, presets, and optimizations to support the latest advancements in AI video generation. Our goal is to remain the go-to tool for anyone looking to push the boundaries of what's possible with AI video.
          </p>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
export const passToClient = ["pageProps"]