// Helper components for Icons (can be moved to a separate file later)
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656-5.656l-4-4a4 4 0 00-5.656 5.656l1.102 1.101"
    ></path>
  </svg>
);

// New Instagram Icon based on provided CSS
const CssInstagramIcon = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="w-4 h-4 flex items-center justify-center" {...props}>
    <div
      className="w-full h-full rounded-[4px] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      }}
    >
      <div className="w-2 h-2 border-[1.5px] border-white rounded-full relative">
        <div className="w-[2px] h-[2px] bg-white rounded-full absolute top-[0.5px] right-[0.5px]"></div>
      </div>
    </div>
  </div>
);

const HamburgerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    // Adjusted to match the new design (text-light from vars.css)
    className="w-8 h-8 text-neutral-100 hover:text-neutral-300 transition-colors"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
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
}) => (
  <div
    className={`rounded-xl shadow-lg flex flex-row overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cardBgClass}`}
  >
    {hasImageArea && (
      <div
        className="w-1/3 flex-shrink-0 bg-neutral-500/30 flex items-center justify-center p-3 self-stretch"
        style={imageAreaStyle}
      >
        <span className="text-neutral-100 text-center text-xs">
          {imagePlaceholderText}
        </span>
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
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xs transition-colors duration-200 group inline-flex items-center mt-auto rounded px-1 py-0.5 hover:bg-black/5 active:bg-black/10 ${linkTextClass}`}
      >
        {linkIconType === "link" && (
          <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-current" />
        )}
        {linkIconType === "instagram" && (
          <CssInstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
        )}
        {linkText}
      </a>
    </div>
  </div>
);

export default function Home() {
  const brandItems: CardProps[] = [
    {
      title: "Ssobig tool",
      description: "인터렉션 소통, 게임화 제작 툴",
      linkText: "about.ssobig.com",
      linkHref: "https://about.ssobig.com",
      linkIconType: "link",
      imagePlaceholderText: "Ssobig Tool Logo (div5.png)",
      imageAreaStyle: { backgroundColor: "#000000" }, // Simulating black background
    },
    {
      title: "러브버디즈1",
      description: "매력있고 사람스러운 찐친 만드는 곳",
      linkText: "love___buddies", // Adjusted from love__buddies
      linkHref: "/brand/love_buddies", // Changed to internal link
      linkIconType: "link", // Changed from "instagram" to "link"
      imagePlaceholderText: "Love Buddies Graphic (div11.png)",
      imageAreaStyle: { backgroundColor: "#000000" }, // Simulating black background
    },
    {
      title: "N.O.W.seoul 나우서울",
      description: "퇴근 후 만나는 전문직 비즈니스 네트워킹 모임",
      linkText: "n.o.w.seoul",
      linkHref: "https://www.instagram.com/n.o.w.seoul/",
      linkIconType: "instagram",
      imagePlaceholderText: "N.O.W.seoul Graphic (div17.png)",
      imageAreaStyle: { backgroundColor: "#1a237e" }, // Dark blue placeholder
    },
    {
      title: "게임오브",
      description: "TV속 게임을 만들고 플레이하는 커뮤니티",
      linkText: "game_orb",
      linkHref: "https://www.instagram.com/game_orb/",
      linkIconType: "instagram",
      imagePlaceholderText: "Game Orb Graphic (div23.png)",
      imageAreaStyle: { backgroundColor: "#4a148c" }, // Dark purple placeholder
    },
  ];

  const communityItems: CardProps[] = [
    {
      title: "쏘빅 커뮤니티",
      description: "쏘빅 커뮤니티",
      linkText: "슬랙링크",
      linkHref: "#", // Placeholder
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
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans relative flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white">
      {/* This div simulates the background image with an overlay from the HTML */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://ifh.cc/g/kFZATV.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black/80 z-[1]"></div>

      {/* Header Icon */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20">
        {/* The src for group-17074809980.svg needs to be added to /public */}
        {/* <img src="/group-17074809980.svg" alt="Menu Icon" className="w-8 h-8" /> */}
        <HamburgerIcon />
      </div>

      {/* Content Container */}
      <main className="w-full max-w-2xl mx-auto z-10 relative">
        {/* Profile Section */}
        <header className="text-center pt-8 sm:pt-12 mb-8 md:mb-10">
          <div
            className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg border border-black"
            // Simulating var(--primary-brand) which was black
          >
            {/* Placeholder for div2.svg (logo) */}
            <span className="text-4xl font-bold text-white">SB</span>
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

        {/* Brand Section */}
        <section className="mb-10 md:mb-12">
          <div className="flex items-center gap-4 sm:gap-5 text-center mb-5 sm:mb-6">
            <hr className="flex-grow border-t border-neutral-500/80" />
            {/* Using PlaywriteUsTrad font for section titles would require font setup */}
            <h2
              className="text-lg sm:text-xl font-normal text-white shrink-0 px-2"
              style={{ fontFamily: "'Playwrite US Trad', cursive" }}
            >
              Brand
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
