"use client";
import Header from "@/components/header/Header";
import UserButton from "@/components/header/UserButton";
import { useEffect, useState } from "react";
import { loadAllPublicPosts, PostDocument } from "@/lib/firebase/firebase";
import { ClockIcon, Eye } from "lucide-react";

export default function WorldPosts() {
  const [posts, setPosts] = useState<PostDocument[]>([]);

  useEffect(() => {
    loadAllPublicPosts({ setPosts });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-fuchsia-200 selection:text-fuchsia-900">
      {/* 背景：動きのあるグラデーションと淡い発光ブロブ */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(60%_60%_at_20%_20%,#e9d5ff_0%,transparent_60%),radial-gradient(60%_60%_at_80%_0%,#bae6fd_0%,transparent_60%),radial-gradient(60%_60%_at_100%_80%,#fecaca_0%,transparent_60%)]" />
      <div className="absolute -z-10 inset-0 bg-gradient-to-br from-white/60 via-white/20 to-white/10 backdrop-blur-0" />

      <Header shadow={false}>
        <div className="flex gap-4">
          <UserButton />
        </div>
      </Header>

      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900/90">
            みんなの投稿
          </h2>
          <p className="mt-2 text-slate-600">
            世界のアイデアが流れる、マソンリ・ストリーム
          </p>
        </div>

        {/* Masonry風：CSS Columnsベース */}
        <ul className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {posts.map((post) => {
            const created = post.createdAt.toDate();
            const updated = post.updatedAt.toDate();

            return (
              <li key={post.id} className="mb-6 break-inside-avoid">
                {/* 3Dティルト＋グラスカード */}
                <div
                  className="
                    group relative rounded-2xl
                    border border-white/30
                    bg-white/50 backdrop-blur-xl
                    shadow-lg ring-1 ring-black/5
                    transition-all duration-300
                    [transform:perspective(1000px)_rotateX(0deg)_rotateY(0deg)]
                    hover:[transform:perspective(1000px)_rotateX(2deg)_rotateY(-2.5deg)]
                    will-change-transform
                  "
                >
                  {/* 角のグロウ・デコレーション */}
                  <div className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-gradient-to-tr from-fuchsia-400/35 to-cyan-400/35 blur-2xl" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        title={post.style.title}
                        className="text-xl font-semibold text-slate-900 tracking-tight leading-snug line-clamp-3"
                      >
                        {post.style.title}
                      </h3>

                      <span
                        className="
                          inline-flex items-center gap-1 shrink-0
                          rounded-full px-2 py-1 text-xs font-medium
                          bg-emerald-500/10 text-emerald-700
                          ring-1 ring-emerald-500/20
                        "
                      >
                        <Eye className="h-4 w-4" />
                        公開中
                      </span>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

                    <div className="flex flex-col gap-2 text-sm text-slate-700">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 text-slate-500" />
                        作成: {created.toLocaleDateString()}{" "}
                        {created.toLocaleTimeString()}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 rotate-180 text-slate-500" />
                        更新: {updated.toLocaleDateString()}{" "}
                        {updated.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {/* 下部のライトバー演出 */}
                  <div className="pointer-events-none absolute inset-x-6 bottom-3 h-px bg-gradient-to-r from-fuchsia-400/40 via-cyan-400/40 to-emerald-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
