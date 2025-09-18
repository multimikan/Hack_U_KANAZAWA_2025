"use client";

import { useState } from "react";
import { addData, PostStyle } from "@/lib/firebase/firebase";
import { TLStore, getSnapshot } from "tldraw";
import { useRouter } from "next/navigation";

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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              タイトルを入力してください
            </h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="タイトルを入力..."
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setIsModalOpen(false);
                  setTitle("");
                }}
              >
                キャンセル
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleModalSave}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
