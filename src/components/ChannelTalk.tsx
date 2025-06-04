"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ChannelIO: (method: string, options?: Record<string, unknown>) => void;
    ChannelIOInitialized?: boolean;
  }
}

export default function ChannelTalk() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // ChannelTalk 스크립트 로드
    const script = `
      (function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.");}var ch=function(){ch.c(arguments);};ch.q=[];ch.c=function(args){ch.q.push(args);};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return;}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x);}}if(document.readyState==="complete"){l();}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l);}})();

      ChannelIO('boot', {
        "pluginKey": "07bb5b7d-3d34-4ee8-96bf-09b6d662f6ed"
      });
    `;

    const scriptElement = document.createElement("script");
    scriptElement.innerHTML = script;
    document.head.appendChild(scriptElement);

    // 채널톡 버튼 위치 설정
    const style = document.createElement("style");
    style.innerHTML = `
      #ch-plugin {
        position: fixed !important;
        bottom: 138px !important;
        right: 16px !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // 정리 작업 (필요한 경우)
      if (window.ChannelIO) {
        window.ChannelIO("shutdown");
      }
    };
  }, []);

  return null;
}
