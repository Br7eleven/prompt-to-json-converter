import React from 'react';
import { GithubIcon } from './icons/GithubIcon';
import {  XIcon } from './icons/XIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';

interface FooterProps {
  onNavClick: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-slate-400 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} VEO 3 Superprompt Builder. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavClick('Terms')} className="text-sm text-slate-400 hover:text-white transition-colors">
              Terms & Conditions
            </button>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <XIcon />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">YouTube</span>
              <YoutubeIcon />
            </a>
            <a href="https://github.com/Br7eleven" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
