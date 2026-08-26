import { BrandMark } from "@/components/ui";

export function DigitalProductVisual() {
  return (
    <figure
      className="vilet-aperture"
      aria-label="Vilét signature split-form aperture"
    >
      <div className="vilet-aperture__index" aria-hidden="true">
        <span>V/01</span>
        <span>Est. 2026</span>
      </div>
      <div className="vilet-aperture__orbit" aria-hidden="true" />
      <BrandMark className="vilet-aperture__mark" />
      <div className="vilet-aperture__caption">
        <span>Strategy</span>
        <span>Design</span>
        <span>Intelligence</span>
      </div>
    </figure>
  );
}
