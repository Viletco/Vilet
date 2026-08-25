import { BrandMark, ProductMark, type ViletProduct } from "@/components/ui";

const nodes: Array<{
  product: ViletProduct;
  label: string;
  state: string;
  position: string;
}> = [
  {
    product: "studio",
    label: "Studio",
    state: "Active",
    position: "left-[5%] top-[13%]",
  },
  {
    product: "growth",
    label: "Growth",
    state: "Internal",
    position: "right-[2%] top-[8%]",
  },
  {
    product: "insights",
    label: "Insights",
    state: "Beta",
    position: "right-[0%] bottom-[10%]",
  },
  {
    product: "partner",
    label: "Sales Partners",
    state: "Internal",
    position: "left-[0%] bottom-[7%]",
  },
  {
    product: "ai",
    label: "Vilét AI",
    state: "Active",
    position: "left-[43%] bottom-[0%]",
  },
];

export function DigitalProductVisual() {
  return (
    <figure
      className="ecosystem-map relative min-h-[30rem]"
      aria-label="Vilét ecosystem connecting Studio, Growth, Insights, AI, and Sales Partners"
    >
      <svg
        viewBox="0 0 620 470"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="energy" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#c58cff" />
            <stop offset=".5" stopColor="#7b32ff" />
            <stop offset="1" stopColor="#3c2cff" stopOpacity=".2" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#energy)" strokeWidth="1.4" opacity=".62">
          <path className="energy-path" d="M310 222 C210 120 145 95 80 95" />
          <path
            className="energy-path delay-1"
            d="M310 222 C410 105 475 82 560 88"
          />
          <path
            className="energy-path delay-2"
            d="M310 222 C444 260 520 330 580 380"
          />
          <path
            className="energy-path delay-3"
            d="M310 222 C190 270 115 345 50 390"
          />
          <path
            className="energy-path delay-4"
            d="M310 222 C315 315 320 385 330 445"
          />
        </g>
        <g fill="#a962ff">
          <circle cx="310" cy="222" r="3" />
          <circle cx="80" cy="95" r="2" />
          <circle cx="560" cy="88" r="2" />
          <circle cx="580" cy="380" r="2" />
          <circle cx="50" cy="390" r="2" />
          <circle cx="330" cy="445" r="2" />
        </g>
      </svg>
      <div className="absolute top-[42%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="border-accent/30 bg-background/90 shadow-glow mx-auto grid size-28 place-items-center border backdrop-blur">
          <BrandMark className="h-16 w-20" />
        </div>
        <p className="mt-3 font-semibold tracking-[-0.03em]">Vilét</p>
        <p className="text-text-muted vilet-coordinate mt-1">Central system</p>
      </div>
      {nodes.map((node) => (
        <div
          key={node.product}
          className={`absolute ${node.position} border-divider bg-background/85 min-w-32 border-l px-3 py-2 backdrop-blur`}
        >
          <div className="flex items-center gap-2">
            <ProductMark
              product={node.product}
              className="text-accent size-4"
            />
            <span className="text-sm font-semibold">{node.label}</span>
          </div>
          <span className="text-text-muted vilet-coordinate mt-2 block">
            {node.state}
          </span>
        </div>
      ))}
    </figure>
  );
}
