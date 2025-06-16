import Image from "next/image";

type HeroItem = {
  src: string;
  alt: string;
  label: string;
};

const items: HeroItem[] = [
  {
    src: "/Delivery.webp",
    alt: "Delivering cheezy khushiyan",
    label: "Delivering cheezy khushiyan",
  },
  {
    src: "/Fastest-Growing-brand.webp",
    alt: "Fastest Growing Brand of the Year",
    label: "Fastest Growing Brand of the Year",
  },
  {
    src: "/for-the-love-of-local-flavour.webp",
    alt: "Made with fresh, local ingredients and love",
    label: "Made with fresh, local ingredients and love",
  },
];

const HeroSection3: React.FC = () => {
  return (
    <section
      className="w-full flex justify-center items-center py-16 px-4 md:px-24 bg-white"
      aria-label="Brand Highlights"
    >
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full max-w-6xl">
        {items.map((item, idx) => (
          <div
            key={item.src}
            className="flex flex-col items-center flex-1 min-w-[260px]"
          >
            <div className="w-[320px] h-[220px] md:w-[340px] md:h-[240px] flex items-center justify-center overflow-hidden rounded-2xl shadow-lg bg-white">
              <Image
                src={item.src}
                alt={item.alt}
                width={340}
                height={240}
                className="object-cover w-full h-full"
                {...(idx === 0
                  ? { priority: true }
                  : { loading: "lazy" })}
                sizes="(max-width: 768px) 320px, 340px"
              />
            </div>
            <div className="mt-6 text-xl md:text-2xl font-bold text-center leading-snug">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection3;