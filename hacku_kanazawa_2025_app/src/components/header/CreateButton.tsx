"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateButton() {
  const router = useRouter();

  return (
    <button
    className="
    text-background font-bold text-sm sm:text-xs items-center justify-center
    flex gap-4 h-10 sm:h-10 px-4 sm:px-3
    rounded-md border-2 border-transparent
    bg-gradient-to-r from-pink-400 hover:to-yellow-400
    hover:from-pink-400 to-purple-400 
    "

    onClick={() => router.push("/create")} // クリックで/createへ移動
    >
        プレゼンテーションの作成
        <Pencil className="w-5 h-5"/>
    </button>
  );
}