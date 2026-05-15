import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
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
          borderRadius: 6,
        }}
      >
        N
      </div>
    ),
    { ...size },
  );
}
