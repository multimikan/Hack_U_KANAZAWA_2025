"use client";

import LogoButton from "./LogoButton";

type HeaderProps = {
  children?: React.ReactNode;
  shadow?: boolean;
};

export const EXTENTION_HEADER_HEIGHT = 156;

export function getHeaderHeight(hasExtension: boolean): number {
  return hasExtension ? 60 : 160;
}

export default function Header({ children, shadow }: HeaderProps) {
  const headerClass =
    " top-0 left-0 items-center w-full bg-white z-50 p-3 px-5" +
    (shadow ? "shadow" : shadow == null ? " shadow" : "");
  return (
    <header className={headerClass}>
      <div className="flex items-center justify-between">
        <LogoButton />
        <nav className="flex text-sm sm:text-xs font-bold justify-items-center items-center h-10 sm:h-10 px-4 sm:px-3 sm:w-auto">
          {children}
        </nav>
      </div>
    </header>
  );
}
