import React, { useEffect } from 'react';

export const JumpHandler: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jumpIndex = urlParams.get('jump');

    if (jumpIndex !== null) {
      const index = parseInt(jumpIndex, 10);
      if (!isNaN(index)) {
        // Wait for components to load and animations to be ready
        setTimeout(() => {
          const vh = window.innerHeight;
          const destinations = [
            0,                      // Intro
            vh * 1.75,              // Planet 1
            vh * 4.25,              // Planet 2
            vh * 6.75,              // Planet 3
            vh * 9.25,              // Planet 4
            vh * 11.75,             // Planet 5
            vh * 13.5,              // Upcoming / Projects & Journal
            vh * 14.5,              // Let's Connect
            vh * 15.5               // Developer Credit
          ];
          
          const destination = destinations[index];

          if (destination !== undefined) {
            window.scrollTo({
              top: destination,
              behavior: 'instant' as any // Use instant to avoid weird double animations on load
            });
          }

          // Clean up the URL
          window.history.replaceState({}, '', '/');
        }, 100);
      }
    }
  }, []);

  return <></>;
};
