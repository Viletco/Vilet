import { BrandMark, ProductMark, type ViletProduct } from "@/components/ui";

const products: Array<{
  product: ViletProduct;
  label: string;
  description: string;
  tone: string;
}> = [
  {
    product: "studio",
    label: "Studio",
    description: "Design, build, launch.",
    tone: "text-[#d8ba78]",
  },
  {
    product: "growth",
    label: "Growth",
    description: "Find and develop opportunity.",
    tone: "text-[#72cfa1]",
  },
  {
    product: "insights",
    label: "Insights",
    description: "See clearly. Decide confidently.",
    tone: "text-[#a878ff]",
  },
  {
    product: "ai",
    label: "Vilét AI",
    description: "Contextual intelligence.",
    tone: "text-[#6fc9ef]",
  },
  {
    product: "partner",
    label: "Sales Partners",
    description: "Trusted reach and collaboration.",
    tone: "text-[#d6ad48]",
  },
];

export function DigitalProductVisual() {
  return (
    <figure
      className="vilet-ecosystem-window relative overflow-hidden rounded-xl border border-white/10"
      aria-label="Vilét ecosystem connecting Studio, Growth, Insights, AI, and Sales Partners"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-7 w-8" />
          <span className="font-display text-lg">Vilét</span>
        </div>
        <span className="vilet-coordinate text-text-muted">Ecosystem</span>
      </div>
      <div className="relative min-h-[22rem] p-5 sm:p-7">
        <div
          aria-hidden="true"
          className="vilet-energy-ribbon absolute inset-0"
        />
        <div className="relative grid min-h-[18rem] content-between gap-8">
          <div className="max-w-sm">
            <p className="vilet-coordinate text-[#d8ba78]">
              One connected system
            </p>
            <h2 className="font-display mt-3 text-3xl leading-[1.02] sm:text-4xl">
              Every capability. One Vilét experience.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {products.map((item) => (
              <div
                key={item.product}
                className="vilet-mini-product rounded-lg border border-white/[0.08] p-3 backdrop-blur"
              >
                <ProductMark
                  product={item.product}
                  className={`size-4 ${item.tone}`}
                />
                <p className="mt-3 text-sm font-semibold">{item.label}</p>
                <p className="text-text-muted mt-1 text-[10px] leading-4">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
