"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const images = [
  {
    src: "/BANNER-IQBAL-AVENUE.webp",
    alt: "BANNER-IQBAL-AVENUE",
  },
  {
    src: "/BANNER-PINNE_AVENUE.webp",
    alt: "BANNER-PINNEAPLE-AVENUE",
  },
  {
    src: "/BANNER-PIZZA.webp",
    alt: "BANNER-PIZZA",
  },
];

const HeroSection1 = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current]);

  return (
    <div className="relative w-full h-[320px] md:h-[500px] overflow-hidden">
      {images.map((img, idx) => (
        <div
          key={img.src}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            style={{ objectFit: "cover" }}
            priority={idx === 0}
            sizes="100vw"
          />
        </div>
      ))}
      {/* Dots for navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full ${
              idx === current ? "bg-orange-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection1;