import React from "react";
import Image from "next/image";

// LinkIcon 컴포넌트
export const LinkIcon = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 ${props.className}`}>
    <Image
      src="/ssobig_assets/linkIcon.png"
      alt="링크 아이콘"
      width={16}
      height={16}
      className="w-full h-full"
    />
  </div>
);

// Instagram 아이콘
export const CssInstagramIcon = (
  props: React.HTMLAttributes<HTMLDivElement>
) => (
  <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 ${props.className}`}>
    <Image
      src="/ssobig_assets/instaIcon.png"
      alt="인스타그램 아이콘"
      width={16}
      height={16}
      className="w-full h-full"
    />
  </div>
);

// Hamburger Icon
export const HamburgerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8 text-neutral-100 hover:text-neutral-300 transition-colors"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);
