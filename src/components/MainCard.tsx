import React from "react";
import Image from "next/image";
import { LinkIcon, CssInstagramIcon } from "./IconComponents";

// 메인 페이지용 카드 Props 인터페이스
export interface MainCardProps {
  imageUrl?: string;
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
}

// 메인 페이지용 카드 컴포넌트
const MainCard: React.FC<MainCardProps> = ({
  imageUrl,
  imagePlaceholderText = "Image Area",
  imageAreaStyle,
  title,
  description,
  linkText,
  // linkHref,
  linkIconType,
  hasImageArea = true,
  cardBgClass = "bg-neutral-200", // from --background-card (originally gray-300)
  titleClass = "text-neutral-900 font-bold", // from --text-dark, Pretendard-Bold
  descriptionClass = "text-neutral-700", // from --text-gray, Pretendard-Regular
  linkTextClass = "text-neutral-700", // from --text-gray, Pretendard-Regular
}) => {
  return (
    <div
      className={`rounded-xl shadow-lg flex flex-row overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBgClass} cursor-pointer h-[110px] sm:h-[120px]`}
    >
      {hasImageArea && (
        <div
          className="w-1/2 flex-shrink-0 flex items-center justify-center self-stretch overflow-hidden"
          style={imageAreaStyle}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={256}
              height={256}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-neutral-100 text-center text-xs">
              {imagePlaceholderText}
            </span>
          )}
        </div>
      )}
      <div
        className={`p-3 sm:p-4 flex-grow flex flex-col justify-center ${
          !hasImageArea ? "items-start" : ""
        }`}
      >
        <h3 className={`text-[16px] sm:text-[18px] mb-1 ${titleClass}`}>{title}</h3>
        <p className={`text-[13px] mb-1.5 leading-snug ${descriptionClass}`}>
          {description}
        </p>
        <div
          className={`text-[13px] transition-colors duration-200 group inline-flex items-center mt-auto rounded px-1 py-0.5 ${linkTextClass}`}
        >
          {linkIconType === "link" && <LinkIcon />}
          {linkIconType === "instagram" && <CssInstagramIcon />}
          {linkText}
        </div>
      </div>
    </div>
  );
};

export default MainCard;
