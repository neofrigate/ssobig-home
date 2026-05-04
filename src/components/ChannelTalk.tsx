"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const CHANNEL_TALK_PLUGIN_KEY = "07bb5b7d-3d34-4ee8-96bf-09b6d662f6ed";

type ChannelLanguage = "ko" | "en";

declare global {
  interface Window {
    ChannelIO?: (method: string, options?: Record<string, unknown>) => void;
    ChannelIOInitialized?: boolean;
  }
}

function loadChannelTalkScript() {
  if (window.ChannelIO) return;

  const channel = function (...args: unknown[]) {
    channel.c(args);
  };
  channel.q = [] as unknown[][];
  channel.c = (args: unknown[]) => {
    channel.q.push(args);
  };
  window.ChannelIO = channel as NonNullable<Window["ChannelIO"]>;

  const load = () => {
    if (window.ChannelIOInitialized) return;
    window.ChannelIOInitialized = true;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  };

  if (document.readyState === "complete") {
    load();
  } else {
    window.addEventListener("DOMContentLoaded", load, { once: true });
    window.addEventListener("load", load, { once: true });
  }
}

export default function ChannelTalk() {
  const bootedLanguage = useRef<ChannelLanguage | null>(null);
  const pathname = usePathname() ?? "/";
  const channelLanguage: ChannelLanguage = pathname.startsWith(
    "/playroom/form/playtest/en",
  )
    ? "en"
    : "ko";
  const isDayNammeFocusedPage =
    pathname === "/offline/11namme/apply" ||
    pathname?.startsWith("/offline/11namme/survey/");

  useEffect(() => {
    if (isDayNammeFocusedPage) {
      if (bootedLanguage.current && window.ChannelIO) {
        window.ChannelIO("shutdown");
        bootedLanguage.current = null;
      }
      return;
    }

    if (bootedLanguage.current === channelLanguage) return;

    loadChannelTalkScript();

    if (bootedLanguage.current && window.ChannelIO) {
      window.ChannelIO("shutdown");
    }

    window.ChannelIO?.("boot", {
      pluginKey: CHANNEL_TALK_PLUGIN_KEY,
      language: channelLanguage,
    });
    window.ChannelIO?.("updateUser", {
      language: channelLanguage,
    });
    bootedLanguage.current = channelLanguage;
  }, [channelLanguage, isDayNammeFocusedPage]);

  useEffect(() => {
    // 채널톡 버튼 숨김 (플로팅 버튼 비활성화)
    const style = document.createElement("style");
    style.innerHTML = `
      #ch-plugin {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
      if (window.ChannelIO) {
        window.ChannelIO("shutdown");
      }
      bootedLanguage.current = null;
    };
  }, []);

  return null;
}
