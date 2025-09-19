"use client";
import { useSession } from "next-auth/react";
import Header from "@/components/header/Header";
import UserButton from "@/components/header/UserButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadData, PostDocument } from "@/lib/firebase/firebase";
import { ClockIcon, EyeOff, PencilIcon } from "lucide-react";

export default function Draft() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-blue-50 to-gray-200 text-gray-900">
      <Header shadow={false}>
        <div className="flex gap-4">
          <UserButton />
        </div>
      </Header>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-mono mb-8">下書き一覧</h2>

        <ul className="space-y-6">
          {posts
            .filter((post) => !post.style.public)
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
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${
                            post.style.public
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {post.style.public ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-1" />
                              公開中
                            </>
                          ) : (
                            <>
                              <PencilIcon className="h-4 w-4 mr-1" />
                              下書き
                            </>
                          )}
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
                        className="mt-4 inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-150"
                      >
                        エディターを開く
                      </button>
                    </div>
                    {/* カードに微妙なグラデーションオーバーレイ */}
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
