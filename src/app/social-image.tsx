import { ImageResponse } from "next/og";

export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#09090b",
        color: "#f7f7f8",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "84px 92px",
        position: "relative",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: "-4px" }}>
          Vilét
        </div>
        <div style={{ color: "#b8b8c2", fontSize: 34 }}>
          Building what&apos;s next.
        </div>
      </div>
      <div
        style={{
          border: "3px solid #8b70f8",
          borderRadius: "999px",
          display: "flex",
          height: "280px",
          position: "relative",
          width: "280px",
        }}
      >
        <div
          style={{
            background: "#8b70f8",
            borderRadius: "999px",
            display: "flex",
            height: "96px",
            left: "89px",
            position: "absolute",
            top: "89px",
            width: "96px",
          }}
        />
      </div>
    </div>,
    socialImageSize,
  );
}
