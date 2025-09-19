"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginDialog } from "./LoginButton";

export default function CreateButton() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            className="
    text-background font-bold text-sm sm:text-xs items-center justify-center
    flex gap-4 h-10 sm:h-10 px-4 sm:px-3
    rounded-md border-2 border-transparent
    bg-gradient-to-r from-pink-400 hover:to-yellow-400
    hover:from-pink-400 to-purple-400 
    "
            onClick={() => {}} // クリックで/createへ移動
          >
            プレゼンテーションの作成
            <Pencil className="w-5 h-5" />
          </button>
        </Dialog.Trigger>

        {/* モーダルを外部コンポーネントとして呼ぶ */}
        <LoginDialog />
      </Dialog.Root>
    );
  }

  return (
    <button
      className="
    text-background font-bold text-sm sm:text-xs items-center justify-center
    flex gap-4 h-10 sm:h-10 px-4 sm:px-3
    rounded-md border-2 border-transparent
    bg-gradient-to-r from-pink-400 hover:to-yellow-400
    hover:from-pink-400 to-purple-400 
    "
      onClick={() => {
        router.push("/create");
      }} // クリックで/createへ移動
    >
      プレゼンテーションの作成
      <Pencil className="w-5 h-5" />
    </button>
  );
}
