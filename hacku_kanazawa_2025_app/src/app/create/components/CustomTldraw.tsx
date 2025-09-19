"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import {
  DefaultSpinner,
  Editor,
  ReadonlySharedStyleMap,
  TLCameraOptions,
  Tldraw,
  track,
  useEditor,
  useRelevantStyles,
} from "tldraw";
import "tldraw/tldraw.css";
import StylesProvider from "../provider/StylesProvider";
import { usePersistentTldrawStore } from "../store/usePersistentTldrawStore";
import { UUIDTypes } from "uuid";
import { PostStyle } from "@/lib/firebase/firebase";

const FitToContent = track(() => {
  const editor = useEditor();

  useEffect(() => {
    if (!editor) return;

    // 初回フィット
    const fit = () => {
      const bounds = editor.getCurrentPageBounds();
      if (bounds) {
        editor.zoomToBounds(bounds, {
          targetZoom: 1,
          animation: { duration: 200 },
        });
      }
    };

    fit();

    const handleResize = () => fit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [editor]);

  return null;
});

export default function CustomTldraw({
  postStyle,
  editor,
  styles,
  setEditor,
  setStyles,
  textEditor,
  setTextEditorState,
  store,
  loadingState,
}: {
  postStyle: PostStyle;
  editor?: any;
  styles?: any;
  setEditor?: any;
  setStyles?: any;
  textEditor?: any;
  setTextEditorState?: any;
  store?: any;
  loadingState?: any;
}) {
  if (loadingState.status === "loading") {
    return (
      <div className="tldraw__editor">
        <DefaultSpinner />
      </div>
    );
  }
  if (loadingState.status === "error") {
    return (
      <div className="tldraw__editor">
        <h2>Error!</h2>
        <p>{loadingState.error}</p>
      </div>
    );
  }

  const CAMERA_OPTIONS: TLCameraOptions = {
    constraints: {
      initialZoom: "fit-min",
      baseZoom: "fit-min",
      bounds: {
        x: 0,
        y: 0,
        w: 1600,
        h: 2147483647,
      },
      behavior: {
        x: "inside",
        y: "inside",
      },
      padding: { x: 0, y: 0 },
      origin: { x: 0, y: 0 },
    },
    isLocked: false,
    panSpeed: 1,
    zoomSpeed: 0,
    zoomSteps: [1],
    wheelBehavior: "pan",
  };

  return (
    <div className="w-full h-full">
      <Tldraw
        onMount={(editor: Editor) => {
          setEditor(editor);
          editor.setCameraOptions(CAMERA_OPTIONS);
          editor.setCamera(editor.getCamera(), { reset: true });
          setTextEditorState(textEditor ?? null);
        }}
        // components={{ Toolbar: null }}
        store={store}
      >
        {/* FitToContentをTldraw内に配置 */}
        <FitToContent />
        <StylesProvider onStylesChange={setStyles} />
      </Tldraw>
    </div>
  );
}
