import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This fixes the TypeScript error for 'adsbygoogle'
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSenseRefresher: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    try {
      // Ensure the adsbygoogle array exists before pushing
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Adsense push error on route change:', error);
    }
  }, [location.pathname]); // Dependency array to re-run on route changes

  return null;
};

export default AdSenseRefresher;