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
   
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200 font-sans">
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
    
  );
};

export default App;
