import React from "react";

// Inline SVG from your attachment (offer.1a1809b0.svg)
const OfferSVG = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    {/* Replace the content below with your actual SVG paths */}
    <circle cx="60" cy="60" r="60" fill="#F5F7FA"/>
    <rect x="30" y="40" width="60" height="40" rx="8" fill="#FFD700"/>
    <path d="M40 50 L80 50 L60 80 Z" fill="#FF8C00"/>
    {/* ...rest of your SVG... */}
  </svg>
);

const HeroSection6 = () => (
  <section style={{
    background: "#F5F7FA",
    padding: "60px 0 0 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }}>
    <div style={{
      background: "#fff",
      borderRadius: "24px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
      padding: "40px 32px",
      maxWidth: "420px",
      width: "100%",
      textAlign: "center",
      marginBottom: "40px"
    }}>
      <div style={{ marginBottom: 24 }}>
        <OfferSVG />
      </div>
      <h2 style={{
        fontSize: "2rem",
        fontWeight: 700,
        margin: "0 0 12px 0",
        color: "#222"
      }}>
        Special Offers &<br/>News
      </h2>
      <p style={{
        color: "#555",
        fontSize: "1.1rem",
        marginBottom: 28
      }}>
        Subscribe now for news, promotions and more<br/>
        delivered right to your inbox
      </p>
      <form style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        <input
          type="email"
          placeholder="Enter your email"
          autoComplete="off"
          style={{
            padding: "14px 16px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg, #FFD700 0%, #FF8C00 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "14px 0",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Subscribe
        </button>
      </form>
    </div>
    <Footer />
  </section>
);

// Simple Footer Component
const Footer = () => (
  <footer style={{
    width: "100%",
    background: "#222",
    color: "#fff",
    padding: "32px 0",
    textAlign: "center",
    fontSize: "1rem",
    marginTop: "auto"
  }}>
    &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
  </footer>
);

export default HeroSection6;