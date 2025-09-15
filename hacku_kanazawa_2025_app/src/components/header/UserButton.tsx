"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import * as Popover from "@radix-ui/react-popover";
import { LogOut } from "lucide-react";

export default function UserButton() {
  const { data: session, status } = useSession();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button>
          <Image src={session?.user?.image || ''} alt="User Image" width={35} height={35} className="rounded-full"/>
        </button>
      </Popover.Trigger>

      <Popover.Content
        className="text-sm sm:text-xs font-bold bg-white border border-gray-200 rounded-md shadow-md text-gray-600 p-1"
        sideOffset={5} // ボタンとの隙間
        align="end" // 右寄せ
      >
        <div className="p-3">
          <p className="font-bold">{session?.user?.name}</p>
          <p className="text-sm">{session?.user?.email}</p>
        </div>
        <hr className="border-gray-200 my-1" />
        <div className="">
          <button
            onClick={() => signOut()}
            className="p-3 rounded-xl flex w-full items-center justify-start hover:bg-gray-100"
          >
            <LogOut className="mr-2 w-5 h-5" />
            ログアウト
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}