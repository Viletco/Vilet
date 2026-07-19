import { createSocialImage, socialImageSize } from "./social-image";

export const alt = "Vilét — Building what's next.";
export const size = socialImageSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return createSocialImage();
}
