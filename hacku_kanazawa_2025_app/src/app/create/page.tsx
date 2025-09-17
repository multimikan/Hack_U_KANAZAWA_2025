/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import LogoButton from "@/components/header/LogoButton";
import SaveButton from "./components/SaveButton";
import PostButton from "./components/PostButton";
import Header, { EXTENTION_HEADER_HEIGHT } from "@/components/header/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { EditorEvents as TextEditorEvents } from "@tiptap/core";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { EditorState as TextEditorState } from "@tiptap/pm/state";
import {
  Editor,
  ReadonlySharedStyleMap,
  Tldraw,
  TldrawUiA11yProvider,
  TldrawUiComponentsProvider,
  useTools,
  useValue,
} from "tldraw";
import CustomTldraw from "./components/CustomTldraw";
import { createContext, useEffect, useState } from "react";
import PresentationButton from "./components/PresentationButton";
import { ExternalToolbar } from "./components/ToolBar";
import "tldraw/tldraw.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const editorContext = createContext({} as { editor: Editor });

export default function Create() {
  const { data: session, status } = useSession();
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
    // ① マウント時にスクロール禁止
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // ② アンマウント時に元に戻す
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!session) return router.push("./");

  return (
    <div className="tldraw__editor">
      <Header shadow={false}>
        <nav className="flex gap-2 text-sm sm:text-xs font-bold justify-items-center items-center px-4 sm:px-3 sm:w-auto">
          <PresentationButton />
          <SaveButton />
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
            editor={editor}
            setEditor={setEditor}
            styles={styles}
            setStyles={setStyles}
            textEditor={textEditor}
            setTextEditorState={setTextEditorState}
          />
        </main>
      </SidebarProvider>
    </div>
  );
}
