import React, { useState, useEffect } from 'react';

const bannerImages = [
  'https://picsum.photos/seed/cyberpunk/1280/400',
  'https://picsum.photos/seed/enchanted/1280/400',
  'https://picsum.photos/seed/abstract/1280/400',
  'https://picsum.photos/seed/spaceship/1280/400',
  'https://picsum.photos/seed/watercolor/1280/400',
];

const Banner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000); // 5초마다 이미지 변경

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full h-56 sm:h-64 md:h-72 bg-gray-900 overflow-hidden">
      {bannerImages.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Banner image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Archive Your Own Prompts
        </h2>
        <p className="mt-2 sm:mt-4 max-w-xl text-lg text-gray-300">
          Easily save, search, and reuse your AI prompts.
        </p>
      </div>
    </div>
  );
};

export default Banner;