"use client";
import { useSession, signOut } from "next-auth/react";
import Header from "@/components/header/Header";
import UserButton from "@/components/header/UserButton";
import { useRouter } from "next/navigation";

export default function Draft() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (!session) return router.push("./");
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
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
      </div>
    </div>
  );
}
