import React from 'react';


const ContactPage: React.FC = () => {
  return (
    <div className="animate-fade-in py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-300 space-y-12">
        <header className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                Get In Touch
            </h1>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                We'd love to hear from you. Whether you have a question, feedback, or a partnership inquiry, please don't hesitate to reach out.
            </p>
        </header>

        <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Contact Information</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
                For all inquiries, please email us directly. We strive to respond to all messages within 48 business hours.
            </p>
            <a 
                href="mailto:support@veosuperprompt.com" 
                className="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                support@prompttojson.site
            </a>
        </div>
        
      </div>
    </div>
  );
};

export default ContactPage;
export const passToClient = ["pageProps"]