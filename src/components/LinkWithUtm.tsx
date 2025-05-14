"use client";

import Link, { LinkProps } from "next/link";
import { useEffect, useState } from "react";
import { appendUtmParams } from "../utils/utm";

interface LinkWithUtmProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const LinkWithUtm: React.FC<LinkWithUtmProps> = ({
  href,
  children,
  className,
  target,
  rel,
  style,
  onClick,
  ...props
}) => {
  const [urlWithUtm, setUrlWithUtm] = useState<string | object>(href);

  useEffect(() => {
    // 클라이언트 사이드에서만 UTM 파라미터 추가
    if (typeof href === "string") {
      setUrlWithUtm(appendUtmParams(href));
    }
  }, [href]);

  return (
    <Link
      href={urlWithUtm}
      className={className}
      target={target}
      rel={rel}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkWithUtm;
