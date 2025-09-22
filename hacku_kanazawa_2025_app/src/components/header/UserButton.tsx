"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import * as Popover from "@radix-ui/react-popover";
import {
  EarthIcon,
  LogOut,
  NetworkIcon,
  Notebook,
  PodcastIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // セッション取得中はローディング表示
  if (status === "loading") {
    return <div>読み込み中…</div>;
  }

  // 未ログイン時は何も描画しない
  if (!session) {
    return null;
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button>
          <Image
            src={session.user?.image}
            alt="User Image"
            width={35}
            height={35}
            className="rounded-full"
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="text-sm sm:text-xs font-bold bg-white border border-gray-200 rounded-md shadow-md text-gray-600 p-1"
          sideOffset={5}
          align="end"
        >
          <div className="p-3">
            <p className="font-bold">{session.user?.name}</p>
            <p className="text-sm">{session.user?.email}</p>
          </div>
          <hr className="border-gray-200 my-1" />
          <button
            onClick={() => router.push("/worldpost")}
            className="p-3 rounded-xl flex w-full items-center justify-start hover:bg-gray-100"
          >
            <PodcastIcon className="mr-2 w-5 h-5" />
            みんなの投稿
          </button>
          <hr className="border-gray-200 my-1" />
          <div>
            <button
              onClick={() => router.push("/post")}
              className="p-3 rounded-xl flex w-full items-center justify-start hover:bg-gray-100"
            >
              <EarthIcon className="mr-2 w-5 h-5" />
              投稿一覧
            </button>
            <button
              onClick={() => router.push("/draft")}
              className="p-3 rounded-xl flex w-full items-center justify-start hover:bg-gray-100"
            >
              <Notebook className="mr-2 w-5 h-5" />
              下書き一覧
            </button>
            <hr className="border-gray-200 my-1" />
            <button
              onClick={() => signOut()}
              className="p-3 rounded-xl flex w-full items-center justify-start hover:bg-gray-100"
            >
              <LogOut className="mr-2 w-5 h-5" />
              ログアウト
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
