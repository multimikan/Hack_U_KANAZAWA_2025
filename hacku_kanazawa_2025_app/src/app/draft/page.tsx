"use client";
import { useSession, signOut } from "next-auth/react";
import Header from "@/components/header/Header";
import UserButton from "@/components/header/UserButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadData, PostDocument } from "@/lib/firebase/firebase";
import Create from "../create/page";

export default function Draft() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<PostDocument[]>([]);

  useEffect(() => {
    if (!session) return router.push("./");
    if (!session?.user?.email) return;
    const unsubscribe = loadData({
      email: session.user.email,
      setPosts,
    });
    return () => unsubscribe();
  }, [session?.user?.email]);

  return (
    <div>
      <Header>
        <div className="flex gap-4">
          <UserButton />
        </div>
      </Header>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-left justify-items-left min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-left sm:items-left">
          <h2 className="font-mono">下書き一覧</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <h3>{post.style.title}</h3>
                <p>公開: {post.style.public ? "Yes" : "No"}</p>
                <small>
                  作成: {post.createdAt.toDate().toLocaleString()}
                  {" / "}
                  更新: {post.updatedAt.toDate().toLocaleString()}
                </small>
                <button
                  onClick={() => {
                    router.push(`/create?id=${post.id}`);
                  }}
                >
                  エディターを開く
                </button>
              </li>
            ))}
          </ul>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
      </div>
    </div>
  );
}
