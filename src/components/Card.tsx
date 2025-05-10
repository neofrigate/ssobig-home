"use client";

import React, { useEffect, useState } from "react";
import { LinkIcon, CssInstagramIcon } from "./IconComponents";
import { appendUtmParams } from "../utils/utm";

// Card 컴포넌트의 Props 인터페이스
export interface CardProps {
  imagePlaceholderText?: string;
  imageAreaStyle?: React.CSSProperties;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  linkIconType: "link" | "instagram";
  hasImageArea?: boolean;
  cardBgClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  linkTextClass?: string;
  fullImageCard?: boolean; // 전체 이미지 카드 여부
}

// 재사용 가능한 Card 컴포넌트
const Card: React.FC<CardProps> = ({
  imagePlaceholderText = "Image Area",
  imageAreaStyle,
  title,
  description,
  linkText,
  linkHref,
  linkIconType,
  hasImageArea = true,
  cardBgClass = "bg-neutral-900", // Near black for card
  titleClass = "text-neutral-100 font-bold",
  descriptionClass = "text-neutral-300",
  linkTextClass = "text-neutral-300 hover:text-white",
  fullImageCard = false, // 기본값은 false
}) => {
  const [urlWithUtm, setUrlWithUtm] = useState(linkHref);

  useEffect(() => {
    // 클라이언트 사이드에서만 UTM 파라미터 추가
    setUrlWithUtm(appendUtmParams(linkHref));
  }, [linkHref]);

  return fullImageCard ? (
    // 전체 이미지 카드 스타일
    <a
      href={urlWithUtm}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className="rounded-[28px] shadow-lg overflow-hidden hover:shadow-xl flex flex-col w-full"
        style={{
          boxShadow: "0px 0px 20px 0px rgba(255, 255, 255, 0.50)",
          aspectRatio: "580/326.25",
        }}
      >
        <div
          className="flex-1"
          style={{
            ...imageAreaStyle,
            backgroundImage: imageAreaStyle?.backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="bg-white px-4 py-3 text-black">
          <h3 className="text-base font-bold mb-1">{title}</h3>
          <div className="flex items-center">
            <div className="text-xs text-neutral-600 group inline-flex items-center">
              {linkIconType === "link" && (
                <LinkIcon className="text-neutral-600" />
              )}
              {linkIconType === "instagram" && (
                <CssInstagramIcon className="text-neutral-600" />
              )}
              {linkText}
            </div>
          </div>
        </div>
      </div>
    </a>
  ) : (
    // 기존 카드 스타일
    <div
      className={`rounded-xl shadow-lg flex flex-col sm:flex-row overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBgClass}`}
    >
      {hasImageArea && (
        <div
          className="w-full sm:w-1/3 h-48 sm:h-auto flex-shrink-0 bg-neutral-700/50 flex items-center justify-center p-3 self-stretch"
          style={imageAreaStyle}
        >
          {!imageAreaStyle?.backgroundImage && (
            <span className="text-neutral-100 text-center text-xs">
              {imagePlaceholderText}
            </span>
          )}
        </div>
      )}
      <div
        className={`p-4 flex-grow flex flex-col justify-center ${
          !hasImageArea ? "items-start" : ""
        }`}
      >
        <h3 className={`text-base sm:text-lg mb-2 ${titleClass}`}>{title}</h3>
        <p
          className={`text-xs sm:text-sm mb-3 leading-relaxed ${descriptionClass}`}
          dangerouslySetInnerHTML={{
            __html: description.replace(/\n/g, "<br />"),
          }}
        ></p>
        <a
          href={urlWithUtm}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs transition-colors duration-200 group inline-flex items-center mt-auto rounded px-1 py-0.5 hover:bg-white/10 active:bg-white/20 ${linkTextClass}`}
        >
          {linkIconType === "link" && <LinkIcon />}
          {linkIconType === "instagram" && <CssInstagramIcon />}
          {linkText}
        </a>
      </div>
    </div>
  );
};

export default Card;
