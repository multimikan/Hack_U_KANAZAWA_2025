/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SaveButton from "./components/SaveButton";
import PostButton from "./components/PostButton";
import Header, { EXTENTION_HEADER_HEIGHT } from "@/components/header/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { v4 as uuidv4 } from "uuid";
import { EditorState as TextEditorState } from "@tiptap/pm/state";
import { Editor, useValue } from "tldraw";
import CustomTldraw from "./components/CustomTldraw";
import { createContext, useEffect, useState } from "react";
import PresentationButton from "./components/PresentationButton";
import { ExternalToolbar } from "./components/ToolBar";
import "tldraw/tldraw.css";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPostById, PostStyle } from "@/lib/firebase/firebase";
import { usePersistentTldrawStore } from "./store/usePersistentTldrawStore";

const editorContext = createContext({} as { editor: Editor });

export default function Create() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const postIdParam = searchParams.get("id");
  let postId: string | null = null;
  const [postStyle, setPostStyleState] = useState<PostStyle | null>(null);
  if (postIdParam) {
    try {
      postId = postIdParam;
      const doc = fetchPostById({
        email: session?.user.email ?? "",
        postId: postId,
      })
        .then((post) => {
          if (post) {
            console.log("取得データ:", post);
            setPostStyleState(post);
          } else {
            console.log("ドキュメントが見つかりません");
          }
        })
        .catch((error) => {
          console.error("取得エラー:", error);
        });
    } catch (e) {
      console.error("Failed to parse postStyle:", e);
    }
  }

  const [tldrawid] = useState(() => postStyle?.id ?? uuidv4());
  const idToUse = postStyle == null ? tldrawid : postStyle.id;
  const p: PostStyle = {
    id: idToUse,
    public: false,
    title: "",
    tldrawStore: "",
  };
  if (!postStyle) setPostStyleState(p);
  let restoredStore = null;
  if (postStyle?.tldrawStore) {
    try {
      restoredStore = JSON.parse(postStyle.tldrawStore);
    } catch (e) {
      console.error("Invalid tldrawStore JSON:", e);
      restoredStore = null;
    }
  }
  const { store, loadingState } = usePersistentTldrawStore(
    idToUse,
    restoredStore
  );

  const router = useRouter();
  const [editor, setEditor] = useState<Editor | null>(null);
  const [styles, setStyles] = useState<any>(null);
  const textEditor = useValue("textEditor", () => editor?.getRichTextEditor(), [
    editor,
  ]);
  const [_, setTextEditorState] = useState<TextEditorState | null>(
    textEditor?.state ?? null
  );
  useEffect(() => {
    if (!session) return router.push("./");

    // ① マウント時にスクロール禁止
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // ② アンマウント時に元に戻す
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="tldraw__editor">
      <Header shadow={false}>
        <nav className="flex gap-2 text-sm sm:text-xs font-bold justify-items-center items-center px-4 sm:px-3 sm:w-auto">
          <PresentationButton />
          <SaveButton style={postStyle!} store={store} />
          <PostButton />
        </nav>
      </Header>
      <div className="pb-2 px-4 pt-2">
        {editor && (
          <editorContext.Provider value={{ editor }}>
            <ExternalToolbar
              editor={editor}
              setEditor={setEditor}
              styles={styles}
              textEditor={textEditor}
              setTextEditorState={setTextEditorState}
            />
          </editorContext.Provider>
        )}
      </div>

      <SidebarProvider>
        <AppSidebar />
        <main
          className="w-full"
          style={{
            display: "flex",
            flexDirection: "column",
            height: `calc(100vh - ${EXTENTION_HEADER_HEIGHT}px)`,
            overflow: "hidden",
          }}
        >
          <CustomTldraw
            postStyle={postStyle!}
            editor={editor}
            setEditor={setEditor}
            styles={styles}
            setStyles={setStyles}
            textEditor={textEditor}
            setTextEditorState={setTextEditorState}
            store={store}
            loadingState={loadingState}
          />
        </main>
      </SidebarProvider>
    </div>
  );
}
