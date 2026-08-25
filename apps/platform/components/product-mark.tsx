export type PlatformProductMark =
  "vilet" | "studio" | "growth" | "partner" | "insights" | "ai";

export function ProductMark({
  product,
  className = "",
}: {
  product: PlatformProductMark;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`fill-none stroke-current ${className}`}
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {product === "vilet" && (
        <path d="M3 5.5 10.5 19 21 3.5M10.5 19 13 14.5" />
      )}
      {product === "studio" && (
        <>
          <path d="M4 5h9v9H4zM11 10h9v9h-9z" />
          <path d="M4 19h4M18 5h2" />
        </>
      )}
      {product === "growth" && (
        <>
          <path d="M4 18 10 12l3 3 7-9" />
          <path d="M15 6h5v5M4 21h16" />
        </>
      )}
      {product === "insights" && (
        <>
          <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />
          <path d="M3 20h18" />
        </>
      )}
      {product === "ai" && (
        <>
          <path d="M4 5 12 12 20 5M4 19l8-7 8 7" />
          <path d="M12 3v18" />
        </>
      )}
      {product === "partner" && (
        <>
          <path d="M3 7h7l4 4-4 4H3zM21 17h-7l-4-4 4-4h7z" />
          <path d="M10 13h4" />
        </>
      )}
    </svg>
  );
}
