import type { NextPageContext } from "next";

type ErrorPageProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorPageProps) {
  const title = statusCode
    ? `${statusCode} 오류가 발생했습니다`
    : "오류가 발생했습니다";

  return (
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
          {title}
        </h1>
        <p style={{ fontSize: "15px", lineHeight: 1.6 }}>
          페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;
