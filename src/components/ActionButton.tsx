"use client";

import React, { useEffect, useState } from "react";
import { appendUtmParams } from "../utils/utm";
import { trackLinkClick } from "../utils/gtag";

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  // 추적을 위한 새로운 props
  brandPage?: string;
  buttonType?: string;
  destination?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
  brandPage,
  buttonType,
  destination,
}) => {
  const [urlWithUtm, setUrlWithUtm] = useState(href);

  useEffect(() => {
    // 클라이언트 사이드에서만 UTM 파라미터 추가
    setUrlWithUtm(appendUtmParams(href));
  }, [href]);

  return (
    <a
      href={urlWithUtm}
      target={target}
      rel={rel}
      className={`flex p-4 justify-center items-center gap-4 w-full max-w-[580px] rounded-full bg-[#FF689F] text-white font-bold text-[16px] shadow-[0px_0px_20px_0px_rgba(255,255,255,0.50)] transform transition-all hover:scale-105 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 aspect-[145/14] ${className}`}
      onClick={() =>
        trackLinkClick({
          linkUrl: urlWithUtm,
          linkText: typeof children === "string" ? children : "ActionButton",
          brandPage,
          buttonType,
          destination,
        })
      }
    >
      {children}
    </a>
  );
};

export default ActionButton;
