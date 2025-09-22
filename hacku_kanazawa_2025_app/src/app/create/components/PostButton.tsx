"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { addData, PostStyle } from "@/lib/firebase/firebase";
import { TLStore, getSnapshot } from "tldraw";
import { useRouter } from "next/navigation";

export default function PostButton({
  style,
  store,
}: {
  style: PostStyle;
  store: TLStore;
}) {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    const snapshot = getSnapshot(store);
    const json = JSON.stringify(snapshot);

    const updatedStyle = {
      ...style,
      title: title.trim(),
      tldrawStore: json,
      public: true, // ← 公開フラグを追加
    };

    await addData({ style: updatedStyle });
    setTitle("");
    router.push("./post"); // 公開後の遷移先
  };

  return (
    <Dialog.Root>
      {/* 投稿ボタン */}
      <Dialog.Trigger asChild>
        <button className="w-full px-4 items-center justify-start bg-green-500 p-2 rounded-md hover:bg-green-600 transition-colors text-white font-bold">
          投稿
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* ← 全画面を覆う半透明の黒 */}
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm data-[state=open]:animate-fadeIn z-500" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 
                     rounded-xl bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-scaleIn z-600"
        >
          <Dialog.Title className="text-lg font-bold mb-2 text-center text-red-600">
            プレゼンテーションを公開しますか？
          </Dialog.Title>
          <Dialog.Description className="text-gray-700 mb-4 text-center">
            投稿すると、全世界のユーザーに公開されます
          </Dialog.Description>

          <label className="block mb-2 font-semibold">
            タイトルを入力してください
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 私のプレゼン資料"
            className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition">
                キャンセル
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
              >
                公開する
              </button>
            </Dialog.Close>
          </div>

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
