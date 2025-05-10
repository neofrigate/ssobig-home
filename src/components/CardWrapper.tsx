"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface CardWrapperProps {
  href: string;
  children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = ({ href, children }) => {
  const router = useRouter();

  const handleClick = () => {
    if (href.startsWith("/")) {
      router.push(href);
    } else if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      console.warn(`Unhandled link type: ${href}`);
    }
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};

export default CardWrapper;
