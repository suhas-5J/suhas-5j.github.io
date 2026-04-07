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
          const destination = vh * (1.75 + 2.5 * index);
          
          window.scrollTo({
            top: destination,
            behavior: 'instant' as any // Use instant to avoid weird double animations on load
          });

          // Clean up the URL
          window.history.replaceState({}, '', '/');
        }, 100);
      }
    }
  }, []);

  return <></>;
};
