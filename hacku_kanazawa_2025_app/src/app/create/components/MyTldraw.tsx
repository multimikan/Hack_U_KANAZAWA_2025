import { useEffect } from "react";
import { TLCameraOptions, Tldraw, track, useEditor } from "tldraw";
import "tldraw/tldraw.css";

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
  editor,
  setEditor,
}: {
  editor?: any;
  setEditor?: any;
}) {
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
        onMount={(editor) => {
          setEditor(editor);
          editor.setCameraOptions(CAMERA_OPTIONS);
          editor.setCamera(editor.getCamera(), { reset: true });
        }}
        // components={{ Toolbar: null }}
      >
        {/* FitToContentをTldraw内に配置 */}
        <FitToContent />
      </Tldraw>
    </div>
  );
}
