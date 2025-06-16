import React from 'react';
import Image from 'next/image';

const blogs = [
  {
    title: "Cheezious: The Awami Brand That's All About Local Love",
    image: "/cheezious-yellow.png",
    link: "#",
  },
  {
    title: "Cheezious and Chill: The Perfect Movie Night Pairings",
    image: "/netflix-pizza.png",
    link: "#",
  },
  {
    title: "How to Host the Ultimate Pizza Party with Cheezious",
    image: "/pizza-party.png",
    link: "#",
  },
];

function HeroSection5() {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 0',
      background: '#fff',
    }}>
      <div style={{
        width: '90%',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Blogs</h2>
          <a href="#" style={{ color: '#FF4C00', fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>VIEW ALL</a>
        </div>
        <div style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {blogs.map((blog, idx) => (
            <div key={idx} style={{
              width: 340,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              background: '#fff',
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
              <div style={{ position: 'relative', width: '100%', height: 220 }}>
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  style={{
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  sizes="340px"
                />
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 70,
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.0) 100%)',
                }} />
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  color: '#fff',
                  padding: '1.2rem 1rem 1rem 1rem',
                  fontWeight: 600,
                  fontSize: 18,
                  zIndex: 2,
                }}>
                  {blog.title}
                </div>
              </div>
              <a
                href={blog.link}
                style={{
                  background: '#000',
                  color: '#fff',
                  padding: '0.8rem 1rem',
                  fontWeight: 500,
                  fontSize: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: 0.85,
                  textDecoration: 'none',
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              >
                <span>Learn more</span>
                <span style={{
                  marginLeft: 8,
                  borderRadius: '50%',
                  background: '#fff',
                  color: '#FF4C00',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                }}>&#8594;</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroSection5;