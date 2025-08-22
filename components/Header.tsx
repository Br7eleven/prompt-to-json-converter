import React from 'react';
import { AppleIcon } from './icons/AppleIcon';

interface HeaderProps {
    currentPage: string;
    onNavClick: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavClick }) => {
    const navLinks = ["Generator", "About", "Contact", "Terms"];

    return (
        <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-sm border-b border-slate-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={() => onNavClick("Generator")} className="flex-shrink-0 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md">
                            <AppleIcon />
                            <span className="text-white font-bold text-xl">VEO 3 Superprompt Builder</span>
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <button
                                    key={link}
                                    onClick={() => onNavClick(link)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 ${
                                        currentPage === link
                                        ? 'bg-slate-800 text-white' 
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                    aria-current={currentPage === link ? 'page' : undefined}
                                >
                                    {link}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
