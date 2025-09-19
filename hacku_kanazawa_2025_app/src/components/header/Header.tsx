"use client";

import LogoButton from "./LogoButton";

type HeaderProps = {
  children?: React.ReactNode;
  shadow?: boolean;
  className?: string;
};

export const EXTENTION_HEADER_HEIGHT = 164;

export function getHeaderHeight(hasExtension: boolean): number {
  return hasExtension ? 60 : 160;
}

export default function Header({ children, className, shadow }: HeaderProps) {
  const headerClass =
    " top-0 left-0 items-center w-full z-50 p-3 px-5" +
    (shadow ? " shadow " : shadow == null ? " shadow " : " ") +
    (className ? className : " ");
  return (
    <header className={headerClass}>
      <div className="flex items-center justify-between">
        <LogoButton />
        <nav className="flex text-sm sm:text-xs font-bold justify-items-center items-center h-8 sm:h-8 px-4 sm:px-3 sm:w-auto">
          {children}
        </nav>
      </div>
    </header>
  );
}
