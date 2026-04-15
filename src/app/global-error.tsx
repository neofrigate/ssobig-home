"use client";

export default function GlobalError({
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            backgroundColor: "#ffffff",
            color: "#111827",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ maxWidth: "420px", textAlign: "center" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
              문제가 발생했습니다
            </h1>
            <p style={{ fontSize: "15px", lineHeight: 1.6, marginBottom: "20px" }}>
              페이지를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#111827",
                color: "#ffffff",
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              새로고침
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
