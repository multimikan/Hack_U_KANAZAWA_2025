"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import SaveButton from "./components/SaveButton";
import PostButton from "./components/PostButton";
import Header, { EXTENTION_HEADER_HEIGHT } from "@/components/header/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { v4 as uuidv4 } from "uuid";
import { EditorState as TextEditorState } from "@tiptap/pm/state";
import { Editor, useValue } from "tldraw";
import CustomTldraw from "./components/CustomTldraw";
import {
  createContext,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PresentationButton from "./components/PresentationButton";
import { ExternalToolbar } from "./components/ToolBar";
import "tldraw/tldraw.css";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPostById, PostStyle } from "@/lib/firebase/firebase";
import { usePersistentTldrawStore } from "./store/usePersistentTldrawStore";

const editorContext = createContext({} as { editor: Editor });

export function CreateParams() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postIdParam = searchParams.get("id") ?? null; // URL の id を使用［web:21］

  // 1) ページキーは URL の id があればそれを優先、なければ初回だけ uuid を固定
  const initialUuidRef = useRef<string>(uuidv4()); // 初回だけ固定の uuid［web:17］
  const persistenceKey = useMemo(
    () => postIdParam ?? initialUuidRef.current, // 安定したキーを使って再初期化を避ける
    [postIdParam]
  ); // ［web:17］

  // 2) 取得した PostStyle を保持（レンダー中に setState しない）
  const [postStyle, setPostStyle] = useState<PostStyle | null>(null); // ［web:17］

  // 3) Firestore からの取得は useEffect に集約
  useEffect(() => {
    if (!session) {
      router.push("./");
      return;
    }
    let ignore = false;
    (async () => {
      try {
        if (postIdParam) {
          const style = await fetchPostById({
            email: session.user?.email ?? "",
            postId: postIdParam,
          }); // ［web:21］
          if (!ignore) {
            setPostStyle(
              style ?? {
                id: persistenceKey,
                public: false,
                title: "",
                tldrawStore: "",
              }
            ); // ［web:17］
          }
        } else {
          if (!ignore) {
            setPostStyle({
              id: persistenceKey,
              public: false,
              title: "",
              tldrawStore: "",
            });
          }
        }
      } catch (e) {
        if (!ignore) {
          setPostStyle({
            id: persistenceKey,
            public: false,
            title: "",
            tldrawStore: "",
          });
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, [session, router, postIdParam, persistenceKey]); // ［web:17］

  // 4) tldraw の初期スナップショットは「文字列のまま」渡す（hook の型に合わせる）
  const initialSnapshotJson = postStyle?.tldrawStore || undefined; // ここで JSON.parse しない［web:21］

  // 5) ストア初期化（キーと初期スナップショットは安定化）
  const { store, loadingState } = usePersistentTldrawStore(
    persistenceKey,
    initialSnapshotJson
  ); // 毎レンダーで別参照を渡さない（文字列は不変）［web:17］

  // 6) 残りの UI 状態
  const [editor, setEditor] = useState<Editor | null>(null); // ［web:17］
  const textEditor = useValue("textEditor", () => editor?.getRichTextEditor(), [
    editor,
  ]); // ［web:17］
  const [styles, setStyles] = useState<any>(null); // ［web:17］
  const [_, setTextEditorState] = useState<TextEditorState | null>(
    textEditor?.state ?? null
  ); // ［web:17］

  useEffect(() => {
    if (textEditor) setTextEditorState(textEditor.state);
  }, [textEditor]); // ［web:17］

  // 7) まだ postStyle が未確定なら簡易ローディング
  if (!postStyle) return <div>loading...</div>; // レンダー中に setState しないための待機［web:17］

  return (
    <div className="tldraw__editor" style={{ overflow: "hidden" }}>
      <Header shadow={false}>
        <nav className="flex gap-2 text-sm sm:text-xs font-bold justify-items-center items-center px-4 sm:px-3 sm:w-auto">
          <PresentationButton />
          <SaveButton style={postStyle} store={store} />
          <PostButton style={postStyle} store={store} />
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
            postStyle={postStyle}
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

export default function Create() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <CreateParams />
    </Suspense>
  );
}
