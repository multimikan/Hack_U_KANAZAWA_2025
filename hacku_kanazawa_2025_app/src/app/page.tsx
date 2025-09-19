"use client";

import CreateButton from "@/components/header/CreateButton";
import Header, { EXTENTION_HEADER_HEIGHT } from "@/components/header/Header";
import LoginButton from "@/components/header/LoginButton";
import LogoButton from "@/components/header/LogoButton";
import UserButton from "@/components/header/UserButton";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Pencil, Presentation } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import PresentationButton from "./create/components/PresentationButton";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    return;
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background:
          // 星空風のグラデーション（上から下に暗くなる）
          `linear-gradient(
        180deg,
        #fffbe9 0%,
        #e3e6f3 30%,
        #b6b8d6 60%,
        #23243a 100%
        )`,
      }}
    >
      <Header className="bg-transparent" shadow={false}>
        <nav className="flex gap-4 justify-items-center items-center  sm:w-auto">
          {status === "loading" ? ( // ロード中の場合
            <div />
          ) : !session ? ( // ログインしていない場合
            <LoginButton />
          ) : (
            // ログインしている場合
            <div className="flex gap-4">
              <UserButton />
            </div>
          )}
        </nav>
      </Header>

      <div className="font-sans grid grid-rows-[0px_1fr_128px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="font-xl items-left">
            <span className="text-6xl font-extrabold leading-tight">
              {`一夜の挑戦を、`}
              <br />
              {`一生の成果物に。`}
              <div className="p-2" />
            </span>
          </div>
          <div className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
            <div className="mb-2 tracking-[-.01em]">
              ハッカソンにでたけど、燃え尽きてしまう...?{" "}
              あなたの挑戦を他の人に見てもらいましょう。
            </div>
            <div className="mb-2 tracking-[-.01em]">
              方法は簡単です。プレゼンテーションを作成するだけ。
            </div>
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <CreateButton />
            <a
              className="rounded-md border border-solid border-black/[.08] dark:border-white/[.145] transition-colors text-gray-100 flex items-center justify-center bg-gray-400 hover:bg-gray-500 dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-10 px-4 sm:px-5 w-full sm:w-auto md:w-[166px]"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              投稿を見る
            </a>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-end w-full">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
          <a
            className="flex text-white items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/multimikan/Hack_U_KANAZAWA_2025"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubLogoIcon className="text-white w-8 h-8" />
            私たちのGitHubリポジトリ
          </a>
        </footer>
      </div>
    </div>
  );
}
