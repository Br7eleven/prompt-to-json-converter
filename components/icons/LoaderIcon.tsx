import React from 'react';

export const LoaderIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} animate-spin`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3a9 9 0 100 18 9 9 0 000-18z"
      opacity="0.25"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      style={{
        clipPath: 'inset(0 50% 0 0)'
      }}
    />
  </svg>
);
