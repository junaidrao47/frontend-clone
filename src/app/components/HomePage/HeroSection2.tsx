"use client";
import Link from "next/link";
import useSWR from "swr";
import React, { useState } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

type StrapiImageFormat = {
  url: string;
  width: number;
  height: number;
};

type StrapiImage = {
  id: number;
  url: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    [key: string]: StrapiImageFormat | undefined;
  };
};

type CategoryApiResponse = {
  data: Array<{
    id: number;
    attributes: {
      name: string;
      Image?: {
        data?: {
          attributes: StrapiImage;
        };
      };
    };
  }>;
};

const FALLBACK_IMAGE = "https://via.placeholder.com/180x120.png?text=No+Image";
const VISIBLE_COUNT = 4;

const fetcher = async (url: string): Promise<CategoryApiResponse> => {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  const json = await res.json();
  return json;
};

function getImageUrl(image?: StrapiImage): string {
  if (!image) return FALLBACK_IMAGE;
  return (
    image.formats?.small?.url ||
    image.formats?.thumbnail?.url ||
    image.url ||
    FALLBACK_IMAGE
  );
}

type Category = {
  id: number;
  name: string;
  imageUrl: string;
};

const HeroSection2: React.FC = () => {
  const [startIdx, setStartIdx] = useState<number>(0);

  const { data, error, isLoading } = useSWR<CategoryApiResponse>(
    API_URL ? `${API_URL}/categories?populate=Image` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 10,
      errorRetryCount: 2,
      shouldRetryOnError: true,
    }
  );

  const categories: Category[] = (data?.data || []).map((cat) => {
    const image =
      cat.attributes?.Image?.data?.attributes ?? undefined;
    const imageUrl = getImageUrl(image);
    return {
      id: cat.id,
      name: cat.attributes?.name ?? "No Name",
      imageUrl,
    };
  });

  React.useEffect(() => {
    if (startIdx > Math.max(categories.length - VISIBLE_COUNT, 0)) {
      setStartIdx(Math.max(categories.length - VISIBLE_COUNT, 0));
    }
  }, [categories.length, startIdx]);

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(prev - VISIBLE_COUNT, 0));
  };
  const handleNext = () => {
    setStartIdx((prev) =>
      Math.min(prev + VISIBLE_COUNT, Math.max(categories.length - VISIBLE_COUNT, 0))
    );
  };

  return (
    <div
      className="w-full flex flex-col items-center py-10 bg-white"
      style={{
        paddingLeft: 32,
        paddingRight: 16,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="w-full max-w-[1200px] mx-auto"
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="flex justify-between items-center mb-6" style={{ width: "100%" }}>
          <h2 className="font-bold text-3xl">Explore Menu</h2>
          <a
            href="#"
            className="text-[#FF4C00] font-semibold text-base hover:underline"
          >
            VIEW ALL
          </a>
        </div>
        <div
          className="relative flex justify-center items-center min-h-[250px]"
          style={{
            minHeight: 250,
            width: "100%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Back Button */}
          <button
            onClick={handlePrev}
            disabled={startIdx === 0}
            aria-label="Previous"
            className={`absolute left-0 z-10 bg-white border-none rounded-lg shadow-md w-10 h-10 flex items-center justify-center text-2xl transition-opacity ${
              startIdx === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-50"
            }`}
            style={{ left: 0 }}
          >
            &#60;
          </button>

          {/* Loader, Error, or Categories */}
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-[220px]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-200 border-t-[#FF4C00]" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-lg w-full text-center">
              Failed to load categories. Please try again.
            </div>
          ) : categories.length === 0 ? (
            <div className="text-gray-400 text-lg w-full text-center">
              No categories found.
            </div>
          ) : (
            <div
              className="flex gap-8 justify-center items-center w-full max-w-full"
              style={{
                gap: 24,
                width: "100%",
                overflowX: "auto",
                paddingLeft: 0,
                paddingRight: 0,
                justifyContent: "center",
              }}
            >
              {categories
                .slice(startIdx, startIdx + VISIBLE_COUNT)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      minWidth: 210,
                      maxWidth: 210,
                      width: 210,
                      display: "block",
                    }}
                  >
                    <div
                      className="border-2 border-yellow-200 rounded-xl w-[210px] h-[210px] flex flex-col items-center justify-center bg-white shadow-sm transition hover:shadow-lg"
                      style={{
                        border: "2px solid #FFE100",
                        borderRadius: 16,
                        width: 210,
                        height: 210,
                        background: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "box-shadow 0.18s",
                        cursor: "pointer",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        width={140}
                        height={110}
                        style={{
                          objectFit: "contain",
                          borderRadius: 10,
                          marginBottom: 16,
                          background: "#f7f7f7",
                        }}
                        priority={false}
                        onError={() => {
                          // For debugging, log if image fails to load
                          // (You can remove this in production)
                          // eslint-disable-next-line no-console
                          console.error("Image failed to load for category:", cat.name, "URL:", cat.imageUrl);
                        }}
                      />
                      <div
                        className="font-bold text-base text-center mt-2 uppercase tracking-wide"
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          textAlign: "center",
                          marginTop: 8,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          color: "#222",
                        }}
                      >
                        {cat.name}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}

          {/* Forward Button */}
          <button
            onClick={handleNext}
            disabled={
              startIdx + VISIBLE_COUNT >= categories.length ||
              categories.length <= VISIBLE_COUNT
            }
            aria-label="Next"
            className={`absolute right-0 z-10 bg-white border-none rounded-lg shadow-md w-10 h-10 flex items-center justify-center text-2xl transition-opacity ${
              startIdx + VISIBLE_COUNT >= categories.length ||
              categories.length <= VISIBLE_COUNT
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-50"
            }`}
            style={{ right: 0 }}
          >
            &#62;
          </button>
        </div>
      </div>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .max-w-[1200px] { max-width: 100% !important; }
          .w-[210px] { width: 160px !important; }
          .h-[210px] { height: 160px !important; }
        }
        @media (max-width: 600px) {
          .w-[210px] { width: 120px !important; }
          .h-[210px] { height: 120px !important; }
          .w-[140px] { width: 90px !important; }
          .h-[110px] { height: 70px !important; }
        }
      `}</style>
    </div>
  );
};

export default HeroSection2;