"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { appendUtmParams } from "../utils/utm";

interface CardWrapperProps {
  href: string;
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ href, children }) => {
  const router = useRouter();

  const handleClick = () => {
    // UTM 파라미터를 URL에 추가
    const urlWithUtm = appendUtmParams(href);

    if (urlWithUtm.startsWith("/")) {
      router.push(urlWithUtm);
    } else if (urlWithUtm.startsWith("http")) {
      window.open(urlWithUtm, "_blank", "noopener,noreferrer");
    } else {
      console.warn(`Unhandled link type: ${urlWithUtm}`);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export default CardWrapper;
