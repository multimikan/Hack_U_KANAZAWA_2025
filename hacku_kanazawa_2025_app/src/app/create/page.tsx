/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import LogoButton from "@/components/header/LogoButton";
import SaveButton from "./components/SaveButton";
import PostButton from "./components/PostButton";
import Header, { EXTENTION_HEADER_HEIGHT } from "@/components/header/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Editor,
  ReadonlySharedStyleMap,
  Tldraw,
  TldrawUiA11yProvider,
  TldrawUiComponentsProvider,
  useTools,
} from "tldraw";
import CustomTldraw from "./components/CustomTldraw";
import { createContext, useEffect, useState } from "react";
import PresentationButton from "./components/PresentationButton";
import { ExternalToolbar } from "./components/ToolBar";
import "tldraw/tldraw.css";

const editorContext = createContext({} as { editor: Editor });

export default function Create() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [styles, setStyles] = useState<any>(null);

  useEffect(() => {
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
        <nav className="flex gap-4 text-sm sm:text-xs font-bold justify-items-center items-center h-10 sm:h-10 px-4 sm:px-3 sm:w-auto">
          <PresentationButton />
          <SaveButton />
          <PostButton />
        </nav>
      </Header>
      <div className="pb-8 px-4 pt-2">
        {editor && (
          <editorContext.Provider value={{ editor }}>
            <ExternalToolbar
              editor={editor}
              setEditor={setEditor}
              styles={styles}
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
          <SidebarTrigger />
          <CustomTldraw
            editor={editor}
            setEditor={setEditor}
            styles={styles}
            setStyles={setStyles}
          />
        </main>
      </SidebarProvider>
    </div>
  );
}
