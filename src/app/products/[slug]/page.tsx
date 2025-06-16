"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
const FALLBACK_IMAGE = "https://via.placeholder.com/400x300.png?text=No+Image";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductApi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/products?filters[slug][$eq]=${slug}&populate=*`)
      .then(res => res.json())
      .then(data => setProduct(data?.data?.[0]))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ textAlign: "center", marginTop: 80 }}>Loading...</div>;
  if (!product) return <div style={{ textAlign: "center", marginTop: 80 }}>Product not found.</div>;

  const prod = product;
  const img =
    prod.image?.[0]?.formats?.small?.url ||
    prod.image?.[0]?.formats?.thumbnail?.url ||
    prod.image?.[0]?.url ||
    FALLBACK_IMAGE;
  const imageUrl = img.startsWith("/") ? `${API_URL.replace(/\/api$/, "")}${img}` : img;

  return (
    <div style={{
      maxWidth: 900,
      margin: "40px auto",
      padding: 24,
      background: "#fff",
      borderRadius: 24,
      boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
      display: "flex",
      flexDirection: "row",
      gap: 40,
      alignItems: "flex-start"
    }}>
      <div style={{ flex: "0 0 340px" }}>
        <Image
          src={imageUrl}
          alt={prod.name || "Product"}
          width={340}
          height={260}
          style={{
            width: 340,
            height: 260,
            objectFit: "contain",
            borderRadius: 18,
            background: "#f7f7f7",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
          }}
          onError={() => {}}
          priority
        />
      </div>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>{prod.name}</h1>
        <div style={{ fontSize: 18, color: "#444", marginBottom: 18 }}>
          {Array.isArray(prod.description)
            ? prod.description.map((d: { type: string; children: Array<{ type: string; text: string }> }, i: number) =>
                <div key={i}>{d.children?.map((c: { type: string; text: string }) => c.text).join(" ")}</div>
              )
            : prod.description}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#FF4C00", marginBottom: 18 }}>
          Rs. {prod.price}
        </div>
        <div style={{ marginBottom: 18 }}>
          <span style={{
            background: "#E6B17A",
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 8,
            padding: "3px 12px"
          }}>
            {prod.category?.name}
          </span>
        </div>
        {/* Quantity Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span style={{ fontWeight: 600 }}>Quantity:</span>
          <QuantitySelector />
        </div>
        <button
          style={{
            background: "#FF4C00",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 18,
            padding: "14px 40px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(255,225,0,0.08)"
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// Simple quantity selector with local state
function QuantitySelector() {
  const [qty, setQty] = useState(1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={() => setQty(q => Math.max(1, q - 1))}
        style={{
          width: 32, height: 32, borderRadius: 8, border: "1px solid #eee",
          background: "#fff", fontWeight: 700, fontSize: 18, cursor: "pointer"
        }}
      >-</button>
      <span style={{ minWidth: 24, textAlign: "center", fontWeight: 600 }}>{qty}</span>
      <button
        onClick={() => setQty(q => q + 1)}
        style={{
          width: 32, height: 32, borderRadius: 8, border: "1px solid #eee",
          background: "#fff", fontWeight: 700, fontSize: 18, cursor: "pointer"
        }}
      >+</button>
    </div>
  );
}

type ProductApi = {
  id: number;
  name?: string;
  slug?: string;
  description?: string | Array<{ type: string; children: Array<{ type: string; text: string }> }>;
  price?: number;
  image?: Array<{
    formats?: {
      small?: { url: string };
      thumbnail?: { url: string };
    };
    url?: string;
  }>;
  category?: { id: number; name?: string };
};