"use client";

import Link, { LinkProps } from "next/link";
import { useEffect, useState } from "react";
import { appendUtmParams } from "../utils/utm";
import { trackLinkClick } from "../utils/gtag";

interface LinkWithUtmProps extends Omit<LinkProps, "href"> {
  href: string | object;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  brandPage?: string;
  buttonType?: string;
  destination?: string;
}

const LinkWithUtm: React.FC<LinkWithUtmProps> = ({
  href,
  children,
  className,
  target,
  rel,
  style,
  onClick,
  brandPage,
  buttonType,
  destination,
  ...props
}) => {
  const [urlWithUtm, setUrlWithUtm] = useState<string | object>(href);

  useEffect(() => {
    // 클라이언트 사이드에서만 UTM 파라미터 추가
    if (typeof href === "string") {
      setUrlWithUtm(appendUtmParams(href));
    }
  }, [href]);

  const handleClick = () => {
    // GA 추적
    if (typeof href === "string") {
      trackLinkClick({
        linkUrl: typeof urlWithUtm === "string" ? urlWithUtm : href,
        linkText: typeof children === "string" ? children : "LinkWithUtm",
        brandPage,
        buttonType,
        destination,
      });
    }

    // 기존 onClick 핸들러 실행
    if (onClick) {
      onClick();
    }
  };

  // 외부 링크인 경우 일반 <a> 태그 사용
  const isExternalLink =
    typeof href === "string" &&
    (href.startsWith("http") || href.startsWith("//"));

  if (isExternalLink) {
    const externalUrl =
      typeof urlWithUtm === "string" ? urlWithUtm : (href as string);
    return (
      <a
        href={externalUrl}
        className={className}
        target={target || "_blank"}
        rel={rel || "noopener noreferrer"}
        style={style}
        onClick={handleClick}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  // 내부 링크인 경우 Next.js Link 사용
  return (
    <Link
      href={urlWithUtm}
      className={className}
      target={target}
      rel={rel}
      style={style}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkWithUtm;
