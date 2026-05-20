import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#050505",
          color: "white",
          fontFamily:
            '"Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 18%, rgba(255,122,89,0.22), transparent 34%), radial-gradient(circle at 88% 82%, rgba(255,209,92,0.12), transparent 30%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            padding: "76px 84px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "0.28em",
              color: "#FFB38A",
              textTransform: "uppercase",
            }}
          >
            ssobig PLAYROOM
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 920,
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.18,
              whiteSpace: "pre-wrap",
            }}
          >
            얼리 액세스 사전 체험 신청
          </div>
        </div>
      </div>
    ),
    size
  );
}
