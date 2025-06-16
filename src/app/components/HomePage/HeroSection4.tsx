import React from 'react';
import Image from 'next/image';

export default function HeroSection4() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        padding: '3rem 0',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        maxWidth: 1200,
      }}>
        {/* Left: Mobile App Image */}
        <div style={{
          flex: '0 0 320px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}>
          <Image
            src="/mobile.028bdae8.svg"
            alt="Mobile App"
            width={230}
            height={400}
            style={{
              width: 230,
              height: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              borderRadius: 32,
              background: '#fff',
            }}
            priority
          />
        </div>

        {/* Right: Card */}
        <div style={{
          position: 'relative',
          flex: 1,
          marginLeft: -60,
          background: 'linear-gradient(100deg, #ffe259 0%, #ffa751 100%)',
          borderRadius: '48px',
          minHeight: 340,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '3rem 3rem 2.5rem 7rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}>
          {/* Pizza SVG */}
          <Image
            src="/pizza.svg"
            alt="Pizza"
            width={70}
            height={70}
            style={{
              position: 'absolute',
              top: -38,
              right: 70,
              width: 70,
              height: 'auto',
              opacity: 0.7,
              zIndex: 1,
            }}
            priority
          />

          {/* Text */}
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            margin: 0,
            color: '#222',
            zIndex: 2,
          }}>
            Download Our Mobile App
          </h2>
          <p style={{
            fontSize: '1.15rem',
            margin: '1rem 0 1.5rem 0',
            color: '#222',
            zIndex: 2,
            maxWidth: 480,
          }}>
            Elevate your experience by downloading our mobile app for<br />
            Seamless ordering experience.
          </p>

          {/* Avatars and Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginTop: 12,
            zIndex: 2,
          }}>
            {/* Avatars SVG */}
            <Image
              src="/avatar.e940263a.svg"
              alt="Avatars"
              width={48}
              height={48}
              style={{
                height: 48,
                width: 'auto',
              }}
              priority
            />
            {/* App Store Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" target="_blank" rel="noopener">
                <Image
                  src="/apple.50cebbed.svg"
                  alt="Get it on Google Play"
                  width={120}
                  height={40}
                  style={{ height: 40, width: 'auto' }}
                  priority
                />
              </a>
              <a href="#" target="_blank" rel="noopener">
                <Image
                  src="/google.9b9b10ed.svg"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  style={{ height: 40, width: 'auto' }}
                  priority
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}