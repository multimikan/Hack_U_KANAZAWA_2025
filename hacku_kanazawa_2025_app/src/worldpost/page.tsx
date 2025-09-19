"use client";
import Header from "@/components/header/Header";
import UserButton from "@/components/header/UserButton";
import { useEffect, useState } from "react";
import { loadAllPublicPosts, PostDocument } from "@/lib/firebase/firebase";
import { ClockIcon, Eye } from "lucide-react";

export default function WorldPosts() {
  const [posts, setPosts] = useState<PostDocument[]>([]);

  useEffect(() => {
    // すべての公開投稿を取得
    const unsubscribe = loadAllPublicPosts({ setPosts });
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-pink-200 text-gray-900">
      <Header shadow={false}>
        <div className="flex gap-4">
          <UserButton />
        </div>
      </Header>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold font-mono mb-8">みんなの投稿</h2>

        <ul className="space-y-6">
          {posts.map((post) => {
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
                        作成: {created.toLocaleDateString()} {created.toLocaleTimeString()}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 rotate-180" />
                        更新: {updated.toLocaleDateString()} {updated.toLocaleTimeString()}
                      </div>
                    </div>
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
