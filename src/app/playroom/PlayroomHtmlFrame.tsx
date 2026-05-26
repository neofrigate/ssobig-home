"use client";

import { useEffect, useMemo, useState } from "react";

type PlayroomHtmlFrameProps = {
  html: string;
  messageKey: string;
  title: string;
};

function buildSrcDoc(html: string, messageKey: string) {
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
      }
      body {
        overflow-x: hidden;
      }
    </style>
  </head>
  <body>
    ${html}
    <script>
      (function () {
        var key = ${JSON.stringify(messageKey)};
        function sendHeight() {
          var body = document.body;
          var html = document.documentElement;
          var height = Math.max(
            body ? body.scrollHeight : 0,
            body ? body.offsetHeight : 0,
            html ? html.clientHeight : 0,
            html ? html.scrollHeight : 0,
            html ? html.offsetHeight : 0
          );
          parent.postMessage({ type: "playroom-html-height", key: key, height: height }, "*");
        }
        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);
        if (window.ResizeObserver) {
          var observer = new ResizeObserver(sendHeight);
          observer.observe(document.body);
        }
        setTimeout(sendHeight, 0);
        setTimeout(sendHeight, 120);
        setTimeout(sendHeight, 400);
      })();
    </script>
  </body>
</html>`;
}

export default function PlayroomHtmlFrame({
  html,
  messageKey,
  title,
}: PlayroomHtmlFrameProps) {
  const [height, setHeight] = useState(640);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data;
      if (
        !data ||
        data.type !== "playroom-html-height" ||
        data.key !== messageKey
      ) {
        return;
      }

      const nextHeight = Number(data.height);
      if (Number.isFinite(nextHeight) && nextHeight > 0) {
        setHeight(nextHeight);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [messageKey]);

  const srcDoc = useMemo(() => buildSrcDoc(html, messageKey), [html, messageKey]);

  return (
    <iframe
      title={title}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className="block w-full overflow-hidden border-0 bg-transparent"
      style={{ height }}
    />
  );
}
