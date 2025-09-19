"use client";
import { useSession } from "next-auth/react";
import Header from "@/components/header/Header";
import UserButton from "@/components/header/UserButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadData, PostDocument } from "@/lib/firebase/firebase";
import { ClockIcon, Eye, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export default function Posts() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<PostDocument[]>([]);

  useEffect(() => {
    if (!session) return router.push("./");
    if (!session.user?.email) return;
    const unsubscribe = loadData({
      email: session.user.email,
      setPosts,
    });
    return () => unsubscribe();
  }, [session?.user?.email]);

  const handleUnpublish = (id: string) => {
    // TODO: Firestore で公開停止の処理をここに書く
    console.log("公開停止:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-pink-200 text-gray-900">
      <Header shadow={false}>
        <div className="flex gap-4">
          <UserButton />
        </div>
      </Header>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-mono mb-8">公開投稿一覧</h2>

        <ul className="space-y-6">
          {posts
            .filter((post) => post.style.public) // 公開済みだけに絞る
            .map((post) => {
              const created = post.createdAt.toDate();
              const updated = post.updatedAt.toDate();
              return (
                <li key={post.id}>
                  <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800 truncate">
                          {post.style.title}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800">
                          <Eye className="h-4 w-4 mr-1" />
                          公開中
                        </span>
                      </div>

                      <div className="flex flex-wrap text-sm text-gray-500 gap-4">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          作成: {created.toLocaleDateString()}{" "}
                          {created.toLocaleTimeString()}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1 rotate-180" />
                          更新: {updated.toLocaleDateString()}{" "}
                          {updated.toLocaleTimeString()}
                        </div>
                      </div>

                      <button
                        onClick={() => router.push(`/create?id=${post.id}`)}
                        className="mt-4 inline-block bg-green-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-green-700 transition-colors duration-150"
                      >
                        エディターを開く
                      </button>

                      {/* 公開停止ボタン → モーダル付き */}
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <button className="mt-4 mx-2 inline-block bg-red-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-red-700 transition-colors duration-150">
                            公開停止
                          </button>
                        </Dialog.Trigger>

                        <Dialog.Portal>
                          {/* 背景オーバーレイ */}
                          <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-fadeIn" />

                          {/* モーダル本体 */}
                          <Dialog.Content
                            className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 
                                       rounded-lg bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-scaleIn"
                          >
                            <Dialog.Title className="text-lg font-bold text-center mb-4 text-red-600">
                              本当に公開停止しますか？
                            </Dialog.Title>
                            <Dialog.Description className="text-gray-700 text-center mb-6">
                              公開を停止すると、他のユーザーからは見えなくなります。
                            </Dialog.Description>

                            <div className="flex justify-center gap-3">
                              <Dialog.Close asChild>
                                <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition">
                                  キャンセル
                                </button>
                              </Dialog.Close>
                              <Dialog.Close asChild>
                                <button
                                  onClick={() => handleUnpublish(post.id)}
                                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                  公開停止する
                                </button>
                              </Dialog.Close>
                            </div>

                            {/* 右上の✕ボタン */}
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
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-5"></div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
