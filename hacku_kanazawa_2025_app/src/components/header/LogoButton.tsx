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
      className="flex items-center font-sans font-bold text-base sm:text-xl tracking-tight cursor-pointer"
    >
      <img
        src="/hacku_l.PNG"
        alt="Hack U Kanazawa Icon"
        className="w-13 h-13"
      />
      <img
        src="/hackukanazawaicon.gif"
        alt="Hack U Kanazawa Icon"
        className="w-13 h-13"
      />
      <img
        src="/hacku_k.PNG"
        alt="Hack U Kanazawa Icon"
        className="w-13 h-13"
      />
      <img
        src="/hacku_u.PNG"
        alt="Hack U Kanazawa Icon"
        className="w-13 h-13"
      />
    </a>
  );
}
