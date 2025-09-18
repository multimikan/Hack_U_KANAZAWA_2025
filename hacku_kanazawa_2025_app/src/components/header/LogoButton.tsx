"use client";

import { loadData, PostDocument } from "@/lib/firebase/firebase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoButton() {
  const router = useRouter();

  return (
    <a
      onClick={() => {
        router.push("./");
      }}
      className="font-sans font-bold text-base sm:text-xl tracking-tight"
    >
      Hack U KANAZAWA 2025
    </a>
  );
}
