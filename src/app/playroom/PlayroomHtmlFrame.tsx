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
        min-height: 0;
        overflow: visible;
      }
      body {
        overflow-x: hidden;
      }
      #playroom-html-content {
        display: flow-root;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="playroom-html-content">${html}</div>
    <script>
      (function () {
        var key = ${JSON.stringify(messageKey)};
        function sendHeight() {
          var content = document.getElementById("playroom-html-content");
          var body = document.body;
          var html = document.documentElement;
          var contentRect = content ? content.getBoundingClientRect() : null;
          var height = Math.max(
            content ? content.scrollHeight : 0,
            content ? content.offsetHeight : 0,
            contentRect ? contentRect.height : 0,
            body ? body.scrollHeight : 0,
            body ? body.offsetHeight : 0,
            html ? html.scrollHeight : 0,
            html ? html.offsetHeight : 0
          );
          parent.postMessage(
            { type: "playroom-html-height", key: key, height: Math.ceil(height) },
            "*"
          );
        }
        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);
        if (window.ResizeObserver) {
          var observer = new ResizeObserver(sendHeight);
          var observedElement = document.getElementById("playroom-html-content");
          if (observedElement) observer.observe(observedElement);
        }
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(sendHeight);
        }
        setTimeout(sendHeight, 0);
        setTimeout(sendHeight, 120);
        setTimeout(sendHeight, 400);
        setTimeout(sendHeight, 1000);
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
      scrolling="no"
      className="block w-full overflow-hidden border-0 bg-transparent"
      style={{ height }}
    />
  );
}
