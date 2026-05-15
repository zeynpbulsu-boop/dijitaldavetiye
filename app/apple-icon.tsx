import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 35% 30%, #E5B8AA 0%, #B47F6E 55%, #5A2820 100%)",
          color: "#2A0F08",
          fontWeight: 400,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          borderRadius: 36,
        }}
      >
        N
      </div>
    ),
    { ...size },
  );
}
