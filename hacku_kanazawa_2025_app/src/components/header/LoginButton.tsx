// src/components/LoginButton.tsx
"use client";

import { signIn } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Google from "next-auth/providers/google";

export default function LoginButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="h-10 sm:h-10 px-1 sm:px-2 sm:w-auto rounded-md border border-transparent transition-colors bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-bold text-sm sm:text-xs flex items-center justify-center"
        >
          会員登録
        </button>
      </Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-fadeIn" />

        {/* モーダル本体 */}
        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 
                     rounded-lg bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-scaleIn"
        >
          <Dialog.Title className="text-lg font-bold">
            ログイン
          </Dialog.Title>
          <Dialog.Description className="text-gray-500 mb-4">
            {/* モーダルの説明やサブテキストをここに入れます。 */}
          </Dialog.Description>

          <p className="mb-4">ログインをしましょう</p>

          <Dialog.Description className="text-gray-500 mb-4">
            <button
              onClick={() => signIn("google")}
              className="flex w-full p-2 border rounded-md items-center justify-start hover:bg-gray-100 transition-colors"
            >
              
              Sign in with Google
            </button>
          </Dialog.Description>


          {/* 右上の ✕ ボタン */}
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
              aria-label="閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
