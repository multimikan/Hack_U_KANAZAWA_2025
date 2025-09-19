"use client";

import { useState } from "react";
import { addData, PostStyle } from "@/lib/firebase/firebase";
import { TLStore, getSnapshot } from "tldraw";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function SaveButton({
  style,
  store,
}: {
  style: PostStyle;
  store: TLStore;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    const snapshot = getSnapshot(store);
    const json = JSON.stringify(snapshot);

    // titleが空の場合はモーダル表示
    if (!style.title || style.title.trim() === "") {
      setIsModalOpen(true);
      return;
    }

    // titleがある場合は直接保存
    const updatedStyle = {
      ...style,
      tldrawStore: json,
    };
    await addData({ style: updatedStyle });
    router.push("./draft");
  };

  const handleModalSave = async () => {
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
    };

    await addData({ style: updatedStyle });
    setIsModalOpen(false);
    setTitle("");
    router.push("./draft");
  };

  return (
    <>
      <button
        className="p-2 sm:p-2 sm:w-auto border border-gray-300 rounded-md hover:bg-gray-100 whitespace-nowrap font-bold"
        onClick={handleSave}
      >
        下書き保存
      </button>

      {/* モーダル */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm data-[state=open]:animate-fadeIn z-500" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 
                       rounded-xl bg-white p-6 shadow-xl focus:outline-none data-[state=open]:animate-scaleIn z-600"
          >
            <Dialog.Title className="text-lg font-bold mb-4">
              タイトルを入力してください
            </Dialog.Title>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="タイトルを入力..."
              autoFocus
            />

            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={() => {
                    setIsModalOpen(false);
                    setTitle("");
                  }}
                >
                  キャンセル
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleModalSave}
                >
                  保存
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
    </>
  );
}
