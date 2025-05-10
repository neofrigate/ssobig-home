import React from "react";

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
}) => {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`flex p-4 justify-center items-center gap-4 w-full max-w-[580px] rounded-full bg-[#FF7EF7] text-white font-semibold text-lg sm:text-xl shadow-[0px_0px_20px_0px_rgba(255,255,255,0.50)] transform transition-all hover:scale-105 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 aspect-[145/14] ${className}`}
    >
      {children}
    </a>
  );
};

export default ActionButton;
