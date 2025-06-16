"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
const FALLBACK_IMAGE = "https://via.placeholder.com/300x200.png?text=No+Image";
const MAX_DESC_LENGTH = 80;

type Category = {
  id: number;
  name: string;
};

type CategoryApi = {
  id: number;
  name?: string;
  attributes?: {
    name?: string;
  };
};

type ProductApiImage = {
  formats?: {
    small?: { url: string };
    thumbnail?: { url: string };
  };
  url?: string;
};

type ProductApi = {
  id: number;
  attributes?: {
    name?: string;
    description?: string | ProductApiDescription[];
    price?: number;
    image?: {
      data?: Array<{
        attributes?: ProductApiImage;
      }>;
    };
    category?: CategoryApi;
    categories?: CategoryApi[];
    slug?: string;
  };
  name?: string;
  description?: string;
  price?: number;
  image?: ProductApiImage[];
  category?: CategoryApi;
  categories?: CategoryApi[];
  slug?: string;
};

type ProductApiDescription = {
  type: string;
  children: Array<{ type: string; text: string }>;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category | null;
  slug: string;
};

function getImageUrl(prod: ProductApi): string {
  const img =
    prod.attributes?.image?.data?.[0]?.attributes?.formats?.small?.url ||
    prod.attributes?.image?.data?.[0]?.attributes?.formats?.thumbnail?.url ||
    prod.attributes?.image?.data?.[0]?.attributes?.url ||
    prod.image?.[0]?.formats?.small?.url ||
    prod.image?.[0]?.formats?.thumbnail?.url ||
    prod.image?.[0]?.url ||
    null;
  if (img && typeof img === "string" && img.startsWith("/")) {
    return `${API_URL.replace(/\/api$/, "")}${img}`;
  }
  return img || FALLBACK_IMAGE;
}

function getDescription(prod: ProductApi): string {
  const desc =
    prod.attributes?.description ??
    prod.description ??
    "";
  if (Array.isArray(desc) && desc.length > 0) {
    return desc
      .map((d: ProductApiDescription) =>
        Array.isArray(d.children)
          ? d.children.map((c) => c.text).join(" ")
          : ""
      )
      .join(" ");
  }
  return typeof desc === "string" ? desc : "";
}

function getCategory(prod: ProductApi): Category | null {
  const cat =
    prod.category ||
    prod.attributes?.category ||
    (prod.categories && prod.categories[0]) ||
    (prod.attributes?.categories && prod.attributes.categories[0]);
  if (!cat) return null;
  // cat can be { id, name? } or { id, attributes?: { name? } }
  let name = "No Name";
  if (typeof cat.name === "string") {
    name = cat.name;
  } else if (cat.attributes && typeof cat.attributes.name === "string") {
    name = cat.attributes.name;
  }
  return {
    id: cat.id,
    name,
  };
}

const PAGE_SIZE = 6;

const Product1: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read category and page from URL
  const categoryIdParam = searchParams.get("category");
  const pageParam = searchParams.get("page");

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(
    categoryIdParam ? Number(categoryIdParam) : null
  );
  const [page, setPage] = useState<number>(pageParam ? Number(pageParam) : 1);

  // Sync state with URL params
  useEffect(() => {
    setActiveCategoryId(categoryIdParam ? Number(categoryIdParam) : null);
    setPage(pageParam ? Number(pageParam) : 1);
  }, [categoryIdParam, pageParam]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products?populate=*`)
      .then((res) => res.json())
      .then((data) => {
        const prods: Product[] = (data?.data || []).map((prod: ProductApi) => ({
          id: prod.id,
          name: prod.attributes?.name || prod.name || "No Name",
          description: getDescription(prod),
          price: prod.attributes?.price ?? prod.price ?? 0,
          imageUrl: getImageUrl(prod),
          category: getCategory(prod),
          slug: prod.attributes?.slug || prod.slug || "",
        }));
        setProducts(prods);

        // Extract unique categories from products
        const catMap = new Map<number, Category>();
        prods.forEach((p) => {
          if (p.category && !catMap.has(p.category.id)) {
            catMap.set(p.category.id, p.category);
          }
        });
        const cats = Array.from(catMap.values());
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  // Group products by category
  const grouped = useMemo(() => {
    const map = new Map<number, { id: number; name: string; products: Product[] }>();
    products.forEach((prod) => {
      if (prod.category) {
        if (!map.has(prod.category.id)) {
          map.set(prod.category.id, { id: prod.category.id, name: prod.category.name, products: [] });
        }
        map.get(prod.category.id)!.products.push(prod);
      }
    });
    return Array.from(map.values());
  }, [products]);

  // If a category is selected, only show that category and its products, else show all
  const visibleCategories = useMemo(() => {
    if (!activeCategoryId) return grouped;
    return grouped.filter((cat) => cat.id === activeCategoryId);
  }, [grouped, activeCategoryId]);

  // Pagination logic
  const allVisibleProducts = useMemo(
    () => visibleCategories.flatMap((cat) => cat.products),
    [visibleCategories]
  );
  const totalPages = Math.ceil(allVisibleProducts.length / PAGE_SIZE);
  const paginatedProducts = allVisibleProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Navigation handlers
  const handleCategoryChange = (catId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId) {
      params.set("category", String(catId));
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "32px 16px 64px 16px",
        boxSizing: "border-box",
      }}
    >
      {/* Back to Products Link */}
      <Link
        href="/products"
        style={{ color: "#FF4C00", fontWeight: 600, marginBottom: 24, display: "inline-block" }}
      >
        ← Back to Products
      </Link>

      {/* Category Bar */}
      <div
        style={{
          background: "#fafafa",
          padding: "18px 0",
          borderRadius: "16px",
          margin: "0 auto 36px auto",
          maxWidth: 1200,
          width: "100%",
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          gap: 18,
        }}
        className="hide-scrollbar"
      >
        <button
          onClick={() => handleCategoryChange(null)}
          style={{
            minWidth: 120,
            height: 48,
            background: activeCategoryId === null ? "#FFE100" : "#fff",
            color: "#111",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 20,
            cursor: "pointer",
            boxShadow:
              activeCategoryId === null
                ? "0 2px 8px rgba(255, 225, 0, 0.08)"
                : "0 1px 4px rgba(0,0,0,0.03)",
            outline: activeCategoryId === null ? "2px solid #FFE100" : "none",
            transition: "background 0.18s, outline 0.18s",
            marginLeft: 8,
            marginRight: 8,
            whiteSpace: "nowrap",
          }}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            style={{
              minWidth: 180,
              height: 48,
              background: cat.id === activeCategoryId ? "#FFE100" : "#fff",
              color: "#111",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 20,
              cursor: "pointer",
              boxShadow:
                cat.id === activeCategoryId
                  ? "0 2px 8px rgba(255, 225, 0, 0.08)"
                  : "0 1px 4px rgba(0,0,0,0.03)",
              outline: cat.id === activeCategoryId ? "2px solid #FFE100" : "none",
              transition: "background 0.18s, outline 0.18s",
              marginLeft: 8,
              marginRight: 8,
              whiteSpace: "nowrap",
            }}
          >
            {cat.name}
          </button>
        ))}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>

      {/* Products by Category */}
      {loading ? (
        <div style={{ fontSize: 22, color: "#FF4C00", textAlign: "center", marginTop: 80 }}>
          Loading...
        </div>
      ) : allVisibleProducts.length === 0 ? (
        <div style={{ fontSize: 20, color: "#888", textAlign: "center", marginTop: 80 }}>
          No products found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            {/* Show category name if only one category is selected */}
            {activeCategoryId && visibleCategories.length === 1 && (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 28,
                  marginBottom: 24,
                  marginLeft: 8,
                  color: "#111",
                  letterSpacing: "0.01em",
                  textAlign: "left",
                }}
              >
                {visibleCategories[0].name}
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "36px",
                justifyContent: "start",
                alignItems: "stretch",
              }}
            >
              {paginatedProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/products/${prod.slug || prod.id}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                  passHref
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 320,
                      minWidth: 0,
                      background: "#fff",
                      borderRadius: 24,
                      boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "0 0 24px 0",
                      position: "relative",
                      margin: "0",
                      minHeight: 410,
                    }}
                  >
                    {/* Heart Icon */}
                    <div
                      style={{
                        position: "absolute",
                        top: 18,
                        right: 28,
                        fontSize: 22,
                        color: "#FF4C00",
                        background: "none",
                        border: "none",
                        zIndex: 2,
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                      title="Add to wishlist"
                    >
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path
                          d="M11 19s-7-4.35-7-9.5A4.5 4.5 0 0 1 11 5a4.5 4.5 0 0 1 7 4.5C18 14.65 11 19 11 19z"
                          stroke="#FF4C00"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                    {/* Product Image */}
                    <div
                      style={{
                        width: 220,
                        height: 140,
                        marginTop: 24,
                        marginBottom: 12,
                        borderRadius: 12,
                        background: "#f7f7f7",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "box-shadow 0.18s",
                      }}
                    >
                      <Image
                        src={prod.imageUrl}
                        alt={prod.name}
                        width={220}
                        height={140}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: 12,
                          transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
                          willChange: "transform",
                          display: "block",
                        }}
                        className="product-img"
                        priority={false}
                        onError={() => {}}
                      />
                    </div>
                    {/* Card Content */}
                    <div
                      style={{
                        width: "90%",
                        background: "#fff",
                        borderRadius: 16,
                        marginTop: 10,
                        padding: "18px 16px 16px 16px",
                        boxShadow: "0 1px 6px rgba(255,225,0,0.04)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        minHeight: 150,
                        justifyContent: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 20,
                          marginBottom: 8,
                          color: "#111",
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "100%",
                        }}
                        title={prod.name}
                      >
                        {prod.name}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          color: "#222",
                          marginBottom: 12,
                          minHeight: 40,
                          textTransform: "capitalize",
                          lineHeight: 1.4,
                          width: "100%",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                        title={prod.description}
                      >
                        {prod.description.length > MAX_DESC_LENGTH
                          ? prod.description.slice(0, MAX_DESC_LENGTH) + "..."
                          : prod.description}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
                        <span
                          style={{
                            color: "#FF4C00",
                            fontWeight: 700,
                            fontSize: 22,
                            marginRight: 8,
                          }}
                        >
                          Rs. {prod.price.toLocaleString()}
                        </span>
                        <span
                          style={{
                            background: "#E6B17A",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 15,
                            borderRadius: 8,
                            padding: "3px 12px",
                          }}
                        >
                          Starting Price
                        </span>
                      </div>
                      <button
                        style={{
                          width: "100%",
                          background: "#fff",
                          border: "none",
                          borderRadius: 12,
                          fontWeight: 700,
                          fontSize: 18,
                          color: "#222",
                          padding: "12px 0",
                          boxShadow: "0 1px 8px rgba(255,225,0,0.08)",
                          cursor: "pointer",
                          marginTop: 4,
                          transition: "background 0.18s",
                        }}
                      >
                        + ADD TO CART
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 40, gap: 8 }}>
                <button
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    border: "1px solid #eee",
                    background: page === 1 ? "#f5f5f5" : "#fff",
                    color: "#222",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: page === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: page === i + 1 ? "2px solid #FFE100" : "1px solid #eee",
                      background: page === i + 1 ? "#FFE100" : "#fff",
                      color: "#222",
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    border: "1px solid #eee",
                    background: page === totalPages ? "#f5f5f5" : "#fff",
                    color: "#222",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Image hover zoom effect */}
      <style>{`
        .product-img:hover {
          transform: scale(1.08);
        }
        @media (max-width: 900px) {
          .product-img {
            max-width: 100%;
            max-height: 120px;
          }
        }
        @media (max-width: 600px) {
          .product-img {
            max-width: 100%;
            max-height: 90px;
          }
        }
      `}</style>
    </div>
  );
};

export default Product1;