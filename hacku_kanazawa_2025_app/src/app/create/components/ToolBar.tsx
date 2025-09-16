/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState } from "react";
import {
  DefaultColorStyle,
  DefaultStylePanelContent,
  DefaultTextAlignStyle,
  DefaultToolbar,
  Editor,
  EnumStyleProp,
  GeoShapeGeoStyle,
  HandToolbarItem,
  ReadonlySharedStyleMap,
  SelectTool,
  Tldraw,
  useRelevantStyles,
  useTools,
  useTranslation,
  useValue,
} from "tldraw";
import {
  Pencil,
  PencilIcon,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
} from "lucide-react";
import "tldraw/tldraw.css";
// There's a guide at the bottom of this file!

// [1]

// [4]
export const ExternalToolbar = ({
  editor,
  setEditor,
  styles,
}: {
  editor?: any;
  setEditor?: any;
  styles?: any;
}) => {
  const currentToolId = useValue(
    "current tool id",
    () => editor?.getCurrentToolId(),
    [editor]
  );

  return (
    <div className="external-toolbar">
      <button
        className="external-button"
        data-isactive={currentToolId === "draw"}
        onClick={() => editor.setCurrentTool("draw")}
      >
        <PencilIcon />
      </button>
      <button
        className="external-button"
        data-isactive={
          currentToolId === "geo" &&
          editor?.getStyleForNextShape(GeoShapeGeoStyle) === "oval"
        }
        onClick={() => {
          editor.run(() => {
            editor.setStyleForNextShapes(GeoShapeGeoStyle, "oval");
            editor.setCurrentTool("geo");
          });
        }}
      >
        Oval
      </button>
      <AlignTools editor={editor} styles={styles} />
    </div>
  );
};

const FontTools = ({
  editor,
  styles,
}: {
  editor?: any;
  styles?: ReadonlySharedStyleMap | null;
}) => {
  if (styles === undefined) return null;

  return (
    <div className="flex gap-1">
      <button
        className="external-button"
        data-isactive={
          // SharedStyle オブジェクトを取得
          (() => {
            const sharedStyle = styles?.get(DefaultTextAlignStyle);
            // sharedStyle が undefined でなく、かつ type が "shared" で value が "start" の場合のみ "true"
            return sharedStyle?.type === "shared" &&
              sharedStyle.value === "start"
              ? "true"
              : "false";
          })()
        }
        data-can-click={
          styles && Array.from(styles.keys()).includes(DefaultTextAlignStyle)
            ? "true"
            : "false"
        }
        onClick={() => {
          editor.run(() => {
            editor.setStyleForNextShapes(DefaultTextAlignStyle, "start");
            editor.setStyleForSelectedShapes(DefaultTextAlignStyle, "start");
            // editor.setCurrentTool("textAlign");
          });
        }}
      >
        <TextAlignStart />
      </button>

      <button
        className="external-button"
        data-isactive={
          // SharedStyle オブジェクトを取得
          (() => {
            const sharedStyle = styles?.get(DefaultTextAlignStyle);
            // sharedStyle が undefined でなく、かつ type が "shared" で value が "start" の場合のみ "true"
            return sharedStyle?.type === "shared" &&
              sharedStyle.value === "middle"
              ? "true"
              : "false";
          })()
        }
        data-can-click={
          styles && Array.from(styles.keys()).includes(DefaultTextAlignStyle)
            ? "true"
            : "false"
        }
        onClick={() => {
          editor.run(() => {
            editor.setStyleForNextShapes(DefaultTextAlignStyle, "middle");
            editor.setStyleForSelectedShapes(DefaultTextAlignStyle, "middle");
            // editor.setCurrentTool("textAlign");
          });
        }}
      >
        <TextAlignCenter />
      </button>

      <button
        className="external-button"
        data-isactive={
          // SharedStyle オブジェクトを取得
          (() => {
            const sharedStyle = styles?.get(DefaultTextAlignStyle);
            // sharedStyle が undefined でなく、かつ type が "shared" で value が "start" の場合のみ "true"
            return sharedStyle?.type === "shared" && sharedStyle.value === "end"
              ? "true"
              : "false";
          })()
        }
        data-can-click={
          styles && Array.from(styles.keys()).includes(DefaultTextAlignStyle)
            ? "true"
            : "false"
        }
        onClick={() => {
          editor.run(() => {
            editor.setStyleForNextShapes(DefaultTextAlignStyle, "end");
            editor.setStyleForSelectedShapes(DefaultTextAlignStyle, "end");
            // editor.setCurrentTool("textAlign");
          });
        }}
      >
        <TextAlignEnd />
      </button>
    </div>
  );
};
const ParagraphTools = ({ editor }: { editor?: any }) => {
  const currentToolId = useValue(
    "current tool id",
    () => editor?.getCurrentToolId(),
    [editor]
  );

  return (
    <div>
      <button
        className="external-button"
        data-isactive={currentToolId === "draw"}
        onClick={() => editor.setCurrentTool("draw")}
      >
        <PencilIcon />
      </button>
    </div>
  );
};

const ColorTools = ({ editor, styles }: { editor?: any; styles?: any }) => {};

const AlignTools = ({
  editor,
  styles,
}: {
  editor?: any;
  styles?: ReadonlySharedStyleMap | null;
}) => {
  if (styles === undefined) return null;

  return (
    <div className="flex gap-1">
      <button
        className="external-button"
        data-isactive={
          // SharedStyle オブジェクトを取得
          (() => {
            const sharedStyle = styles?.get(DefaultTextAlignStyle);
            // sharedStyle が undefined でなく、かつ type が "shared" で value が "start" の場合のみ "true"
            return sharedStyle?.type === "shared" &&
              sharedStyle.value === "start"
              ? "true"
              : "false";
          })()
        }
        data-can-click={
          styles && Array.from(styles.keys()).includes(DefaultTextAlignStyle)
            ? "true"
            : "false"
        }
        onClick={() => {
          editor.run(() => {
            editor.setStyleForNextShapes(DefaultTextAlignStyle, "start");
            editor.setStyleForSelectedShapes(DefaultTextAlignStyle, "start");
            // editor.setCurrentTool("textAlign");
          });
        }}
      >
        <TextAlignStart />
      </button>

      <button
        className="external-button"
        data-isactive={
          // SharedStyle オブジェクトを取得
          (() => {
            const sharedStyle = styles?.get(DefaultTextAlignStyle);
            // sharedStyle が undefined でなく、かつ type が "shared" で value が "start" の場合のみ "true"
            return sharedStyle?.type === "shared" &&
              sharedStyle.value === "middle"
              ? "true"
              : "false";
          })()
        }
        data-can-click={
          styles && Array.from(styles.keys()).includes(DefaultTextAlignStyle)
            ? "true"
            : "false"
        }
        onClick={() => {
          editor.run(() => {
            editor.setStyleForNextShapes(DefaultTextAlignStyle, "middle");
            editor.setStyleForSelectedShapes(DefaultTextAlignStyle, "middle");
            // editor.setCurrentTool("textAlign");
          });
        }}
      >
        <TextAlignCenter />
      </button>

      <button
        className="external-button"
        data-isactive={
          // SharedStyle オブジェクトを取得
          (() => {
            const sharedStyle = styles?.get(DefaultTextAlignStyle);
            // sharedStyle が undefined でなく、かつ type が "shared" で value が "start" の場合のみ "true"
            return sharedStyle?.type === "shared" && sharedStyle.value === "end"
              ? "true"
              : "false";
          })()
        }
        data-can-click={
          styles && Array.from(styles.keys()).includes(DefaultTextAlignStyle)
            ? "true"
            : "false"
        }
        onClick={() => {
          editor.run(() => {
            editor.setStyleForNextShapes(DefaultTextAlignStyle, "end");
            editor.setStyleForSelectedShapes(DefaultTextAlignStyle, "end");
            // editor.setCurrentTool("textAlign");
          });
        }}
      >
        <TextAlignEnd />
      </button>
    </div>
  );
};

/*

[1] 
Use React context to store the editor at a higher place in the React component tree. 

[2] 
Use the `onMount` prop to get the editor instance and store it in state.

[3]
When we have an editor in state, render the context provider and its descendants.

[4]
You can access the editor from any of the provider's descendants.
*/
