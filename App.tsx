import { Helmet, HelmetProvider } from "react-helmet-async";
import { Routes, Route } from "react-router-dom";
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import TermsPage from "./components/TermsPage";
import GeneratorPage from "./components/GeneratorPage";
import AdSenseRefresher from "./components/AdSenseRefresher";

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200 font-sans">
        <Helmet>
          <title>Prompt to JSON Converter For Veo3</title>
          <meta
            name="description"
            content="convert json prompt for Veo3 AI converter. json builder. json prompting"
          />
          <meta
            name="keywords"
            content="veo3 prompt converter, prompt to json converter, AI video, structured prompt, json ai tool"
          />
          <meta
            name="google-site-verification"
            content="Ygoogle-site-verification=vWFC99rddhvwKE6hEqM568X0P7Y8MKXDoXGZ4GRXRD8"
          />
          <meta name="robots" content="index, follow" />

          {/* Open Graph */}
          <meta property="og:title" content=" Prompt to json converter" />
          <meta
            property="og:description"
            content="Generate JSON prompts for VEO 3 AI video fast and free."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://prompttojson.site" />
          <meta property="og:image" content="https://prompttojson.site/banner.png" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="VEO 3 JSON Prompt Generator" />
          <meta
            name="twitter:description"
            content="Generate JSON prompts for VEO 3 AI video fast and free."
          />
          <meta
            name="twitter:image"
            content="https://prompttojson.site/banner.png"
          />

          {/* Google AdSense */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1122624959641494"
            crossOrigin="anonymous"
          ></script>
        </Helmet>

        <Header />
        <main className="w-full max-w-7xl mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<GeneratorPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<h1>Page not found</h1>} />
          </Routes>
        </main>
        <Footer />
        <AdSenseRefresher />
      </div>
    </HelmetProvider>
  );
};

export default App;
