import { ImageResponse } from "next/og";

export const alt = "NUVE — Modern Düğünler İçin Zarif Dijital Davetiyeler";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          background:
            "radial-gradient(ellipse at 70% 30%, #F4D8C8 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #C9D2C2 0%, transparent 55%), #FBF7F4",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Wax seal */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #E5B8AA 0%, #B47F6E 55%, #5A2820 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 80,
            fontStyle: "italic",
            color: "#2A0F08",
            marginBottom: 48,
            boxShadow: "0 12px 32px rgba(80, 30, 25, 0.25)",
          }}
        >
          N
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#8A5044",
            fontWeight: 500,
            marginBottom: 24,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          NUVE
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 80,
            color: "#2A2520",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Modern düğünler için{" "}
          <span style={{ fontStyle: "italic", color: "#8A5044", fontFamily: "Georgia, serif" }}>
            zarif dijital
          </span>{" "}
          davetiyeler.
        </div>

        {/* Sub */}
        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            color: "#5C544B",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          48 saatte teslim · RSVP yönetimi · 7 dil destek
        </div>
      </div>
    ),
    { ...size },
  );
}
