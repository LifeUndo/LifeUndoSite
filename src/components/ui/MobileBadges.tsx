import React from 'react';

interface MobileBadgesProps {
  className?: string;
}

export default function MobileBadges({ className = '' }: MobileBadgesProps) {
  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      <a 
        href="/downloads#mobile" 
        className="transition-opacity hover:opacity-80"
        aria-label="App Store"
      >
        <img 
          src="/brand/badges/app-store.svg" 
          className="h-14 w-auto" 
          alt="App Store" 
        />
      </a>
      
      <a 
        href="/downloads#mobile" 
        className="transition-opacity hover:opacity-80"
        aria-label="Google Play"
      >
        <img 
          src="/brand/badges/google-play.svg" 
          className="h-14 w-auto" 
          alt="Google Play" 
        />
      </a>
      
      <a 
        href="/downloads#mobile" 
        className="transition-opacity hover:opacity-80"
        aria-label="RuStore"
      >
        <img 
          src="/brand/badges/rustore.svg" 
          className="h-14 w-auto" 
          alt="RuStore" 
        />
      </a>
    </div>
  );
}

