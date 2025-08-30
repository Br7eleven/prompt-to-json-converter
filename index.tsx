import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import MetaTags from './components/MetaTags';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <MetaTags
        title="Prompt to JSON Converter VEO 3 JSON Prompt Generator | Free AI Video Prompt Builder"
        description="Craft the perfect AI video prompt with VEO 3 Superprompt Builder. Transform ideas into structured JSON for cinematic AI video generation. Free and easy to use."
        url="https://jsontoprompt.site/"
         image="https://jsontoprompt.site/preview.png"
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
