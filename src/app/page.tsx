"use client"; // Add this at the top

// Helper components for Icons (can be moved to a separate file later)
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter

// LinkIcon 컴포넌트를 실제 이미지로 변경
const LinkIcon = (props: React.HTMLAttributes<HTMLDivElement>) => (
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

// New Instagram Icon based on provided CSS
const CssInstagramIcon = (props: React.HTMLAttributes<HTMLDivElement>) => (
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

interface CardProps {
  imagePlaceholderText?: string; // Text for the image placeholder area
  imageAreaStyle?: React.CSSProperties; // For background images/colors if needed
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  linkIconType: "link" | "instagram";
  hasImageArea?: boolean; // To control if the image area is rendered
  cardBgClass?: string; // e.g. bg-neutral-200 for --background-card
  titleClass?: string; // e.g. text-neutral-900 for --text-dark
  descriptionClass?: string; // e.g. text-neutral-700 for --text-gray
  linkTextClass?: string; // e.g. text-neutral-700 for --text-gray
  imageUrl?: string; // Add imageUrl property for actual images
}

const Card: React.FC<CardProps> = ({
  imagePlaceholderText = "Image Area",
  imageAreaStyle,
  title,
  description,
  linkText,
  linkHref,
  linkIconType,
  hasImageArea = true, // Default to having an image area
  cardBgClass = "bg-neutral-200", // from --background-card (originally gray-300)
  titleClass = "text-neutral-900 font-bold", // from --text-dark, Pretendard-Bold
  descriptionClass = "text-neutral-700", // from --text-gray, Pretendard-Regular
  linkTextClass = "text-neutral-700", // from --text-gray, Pretendard-Regular
  imageUrl,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (linkHref.startsWith("/")) {
      router.push(linkHref);
    } else if (linkHref.startsWith("http")) {
      window.open(linkHref, "_blank", "noopener,noreferrer");
    } else {
      //  만약 다른 종류의 링크가 있다면 여기에 처리 로직 추가
      console.warn(`Unhandled link type: ${linkHref}`);
    }
  };

  return (
    <div
      className={`rounded-xl shadow-lg flex flex-row overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBgClass} cursor-pointer h-24`}
      onClick={handleClick}
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
        <h3 className={`text-sm sm:text-base mb-1 ${titleClass}`}>{title}</h3>
        <p className={`text-xs mb-1.5 leading-snug ${descriptionClass}`}>
          {description}
        </p>
        <div
          className={`text-xs transition-colors duration-200 group inline-flex items-center mt-auto rounded px-1 py-0.5 ${linkTextClass}`}
        >
          {linkIconType === "link" && <LinkIcon />}
          {linkIconType === "instagram" && <CssInstagramIcon />}
          {linkText}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const solutionItems: CardProps[] = [
    {
      title: "Ssobig tool",
      description: "인터렉션 소통, 게임화 제작 툴",
      linkText: "about.ssobig.com",
      linkHref: "https://about.ssobig.com",
      linkIconType: "link",
      imageUrl: "/ssobig_assets/쏘빅카드로고.png",
      imageAreaStyle: { backgroundColor: "#000000" }, // Black background
    },
  ];

  const brandItems: CardProps[] = [
    {
      title: "러브버디즈",
      description: "매력있고 사람스러운 찐친 만드는 곳",
      linkText: "love___buddies", // Adjusted from love__buddies
      linkHref: "/brand/love_buddies", // Changed to internal link
      linkIconType: "instagram", // 링크 아이콘을 인스타그램 아이콘으로 변경
      imageUrl: "/ssobig_assets/러브버디즈.png",
      imageAreaStyle: { backgroundColor: "#000000" }, // Black background
    },
    {
      title: "N.O.W.seoul 나우서울",
      description: "퇴근 후 만나는 전문직 비즈니스 네트워킹 모임",
      linkText: "n.o.w.seoul",
      linkHref: "/brand/now_seoul",
      linkIconType: "instagram", // 링크 아이콘을 인스타그램 아이콘으로 변경
      imageUrl: "/ssobig_assets/나우서울.png",
      imageAreaStyle: {}, // Removed backgroundColor
    },
    {
      title: "게임오브",
      description: "TV속 게임을 만들고 플레이하는 커뮤니티",
      linkText: "game_orb",
      linkHref: "/brand/game_orb",
      linkIconType: "instagram", // 링크 아이콘을 인스타그램 아이콘으로 변경
      imageUrl: "/ssobig_assets/게임오브.png",
      imageAreaStyle: {}, // Removed backgroundColor
    },
  ];

  const communityItems: CardProps[] = [
    {
      title: "쏘빅 커뮤니티",
      description: "쏘빅 커뮤니티",
      linkText: "슬랙링크",
      linkHref: "https://dis.qa/hKclNB", // Placeholder
      linkIconType: "link",
      hasImageArea: false, // No image area for this card
      cardBgClass: "bg-neutral-200",
      titleClass: "text-neutral-900 font-bold",
      descriptionClass: "text-neutral-700",
      linkTextClass: "text-neutral-700",
    },
  ];

  // Using Pretendard and PlaywriteUsTrad requires font setup in layout.tsx or tailwind.config.js
  // For now, using system sans-serif or existing font settings.
  return (
    // bg-neutral-900 simulates the dark background if no image is set
    // The actual background image (https://ifh.cc/g/kFZATV.jpg) should be set via CSS for linktree-container
    <div
      className="min-h-screen text-neutral-100 font-sans relative flex flex-col items-center pt-[72px] px-4 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white"
      style={{
        backgroundImage: "url('/ssobig_assets/러브버디즈 배경.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Add this for a fixed background
      }}
    >
      {/* This div applies a dark overlay */}
      <div className="absolute inset-0 bg-black/80 z-[1]"></div>

      {/* Content Container */}
      <main className="w-full max-w-2xl mx-auto z-10 relative">
        {/* Profile Section */}
        <header className="text-center mb-8 md:mb-10">
          <div
            className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg border border-black overflow-hidden"
            // Simulating var(--primary-brand) which was black
          >
            {/* 쏘빅 로고 이미지 */}
            <Image
              src="/ssobig_assets/쏘빅 로고.png"
              alt="쏘빅 로고"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            ssobig 쏘빅
          </h1>
          <p className="text-sm sm:text-base text-neutral-300/90 max-w-md mx-auto leading-relaxed">
            인터렉션과 소통, 게임화를 통해
            <br />
            사람들을 연결하는 플랫폼 쏘빅입니다.
          </p>
        </header>

        {/* Solutions Section */}
        <section className="mb-10 md:mb-12">
          <div className="flex items-center gap-4 sm:gap-5 text-center mb-5 sm:mb-6">
            <hr className="flex-grow border-t border-neutral-500/80" />
            <h2
              className="text-lg sm:text-xl font-normal text-white shrink-0 px-2"
              style={{ fontFamily: "'Playwrite US Trad', cursive" }}
            >
              Solutions
            </h2>
            <hr className="flex-grow border-t border-neutral-500/80" />
          </div>
          <div className="space-y-4 sm:space-y-5">
            {solutionItems.map((item) => (
              <Card key={item.title} {...item} />
            ))}
          </div>
        </section>

        {/* Brands Section */}
        <section className="mb-10 md:mb-12">
          <div className="flex items-center gap-4 sm:gap-5 text-center mb-5 sm:mb-6">
            <hr className="flex-grow border-t border-neutral-500/80" />
            <h2
              className="text-lg sm:text-xl font-normal text-white shrink-0 px-2"
              style={{ fontFamily: "'Playwrite US Trad', cursive" }}
            >
              Brands
            </h2>
            <hr className="flex-grow border-t border-neutral-500/80" />
          </div>
          <div className="space-y-4 sm:space-y-5">
            {brandItems.map((item) => (
              <Card key={item.title} {...item} />
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section>
          <div className="flex items-center gap-4 sm:gap-5 text-center mb-5 sm:mb-6">
            <hr className="flex-grow border-t border-neutral-500/80" />
            <h2
              className="text-lg sm:text-xl font-normal text-white shrink-0 px-2"
              style={{ fontFamily: "'Playwrite US Trad', cursive" }}
            >
              Community
            </h2>
            <hr className="flex-grow border-t border-neutral-500/80" />
          </div>
          <div className="space-y-4 sm:space-y-5">
            {communityItems.map((item) => (
              <Card key={item.title} {...item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
