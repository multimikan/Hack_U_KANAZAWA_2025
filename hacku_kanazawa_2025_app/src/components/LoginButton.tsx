// src/components/LoginButton.tsx
"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="rounded-md border border-transparent transition-colors bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-bold text-sm sm:text-xs flex items-center justify-center h-10 sm:h-10 px-4 sm:px-3 sm:w-auto"
    >
      会員登録
    </button>
  );
}
