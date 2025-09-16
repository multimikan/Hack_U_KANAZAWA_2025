/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AnyExtension, EditorEvents as TextEditorEvents } from "@tiptap/core";
import {
  DefaultActionsMenuContent,
  defaultAddFontsFromNode,
  DefaultColorStyle,
  DefaultFontStyle,
  DefaultRichTextToolbar,
  DefaultRichTextToolbarContent,
  DefaultStylePanelContent,
  DefaultTextAlignStyle,
  DefaultToolbar,
  Editor,
  EnumStyleProp,
  GeoShapeGeoStyle,
  HandToolbarItem,
  ReadonlySharedStyleMap,
  SelectTool,
  stopEventPropagation,
  tipTapDefaultExtensions,
  Tldraw,
  TldrawEditor,
  TLTextOptions,
  useRelevantStyles,
  useTools,
  useTranslation,
  useValue,
} from "tldraw";
import {
  Bold,
  BoldIcon,
  ItalicIcon,
  Pencil,
  PencilIcon,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  TextAlignStartIcon,
} from "lucide-react";
import "tldraw/tldraw.css";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { FontSize } from "../FontSizeExtension";
import { extensionFontFamilies } from "../fonts";
// There's a guide at the bottom of this file!

// [1]
const fontOptions = [
  { label: "Default", value: "DEFAULT" },
  { label: "Inter", value: "Inter" },
  { label: "Comic Sans MS", value: "Comic Sans MS" },
  { label: "serif", value: "serif" },
  { label: "monospace", value: "monospace" },
  { label: "cursive", value: "cursive" },
  { label: "Exo 2 (Google Font)", value: "'Exo 2'" },
];

const fontSizeOptions = [
  { label: "12", value: "12px" },
  { label: "16", value: "16px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "28", value: "28px" },
  { label: "32", value: "32px" },
];

// [4]
export const ExternalToolbar = ({
  editor,
  setEditor,
  styles,
  textEditor,
  setTextEditorState,
}: {
  editor?: any;
  setEditor?: any;
  styles?: any;
  textEditor?: any;
  setTextEditorState?: any;
}) => {
  const currentToolId = useValue(
    "current tool id",
    () => editor?.getCurrentToolId(),
    [editor]
  );

  return (
    <div className="external-toolbar">
      <FontTools
        textEditor={textEditor}
        setTextEditorState={setTextEditorState}
      />
      <AlignTools editor={editor} styles={styles} />
    </div>
  );
};

const FontTools = ({
  textEditor,
  setTextEditorState,
}: {
  textEditor?: any;
  setTextEditorState?: any;
}) => {
  const currentBold = textEditor?.isActive("bold") ?? false;
  const currentItalic = textEditor?.isActive("italic") ?? false;
  const currentFontFamily =
    textEditor?.getAttributes("textStyle").fontFamily ?? "DEFAULT";
  const currentFontSize =
    textEditor?.getAttributes("textStyle").fontSize ?? "16px";

  const handleFontFamilyChange = (value: string) => {
    textEditor?.chain().focus().setFontFamily(value).run();
    setTextEditorState?.(textEditor.state);
  };

  const handleFontSizeChange = (value: string) => {
    textEditor?.chain().focus().setFontSize(value).run();
    setTextEditorState?.(textEditor.state);
  };

  const toggleBold = () => {
    if (!textEditor) return;
    const selectionEmpty = textEditor.state.selection.empty;
    if (selectionEmpty) {
      const nextMarks = textEditor.state.storedMarks || {};
      nextMarks.bold
        ? textEditor.chain().unsetBold().focus().run()
        : textEditor.chain().setBold().focus().run();
    } else {
      textEditor.chain().focus().toggleBold().run();
    }
    setTextEditorState?.(textEditor.state);
  };

  const toggleItalic = () => {
    if (!textEditor) return;
    const selectionEmpty = textEditor.state.selection.empty;
    if (selectionEmpty) {
      const nextMarks = textEditor.state.storedMarks || {};
      nextMarks.italic
        ? textEditor.chain().unsetItalic().focus().run()
        : textEditor.chain().setItalic().focus().run();
    } else {
      textEditor.chain().focus().toggleItalic().run();
    }
    setTextEditorState?.(textEditor.state);
  };

  return (
    <div className="flex gap-2 items-center">
      {/* フォントファミリー */}
      <select
        value={currentFontFamily}
        onPointerDown={stopEventPropagation}
        onChange={(e) => handleFontFamilyChange(e.target.value)}
      >
        {fontOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* フォントサイズ */}
      <select
        value={currentFontSize}
        onPointerDown={stopEventPropagation}
        onChange={(e) => handleFontSizeChange(e.target.value)}
      >
        {fontSizeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Bold */}
      <button
        className={`external-button ${currentBold ? "active" : ""}`}
        onPointerDown={stopEventPropagation}
        onClick={toggleBold}
      >
        <BoldIcon />
      </button>

      {/* Italic */}
      <button
        className={`external-button ${currentItalic ? "active" : ""}`}
        onPointerDown={stopEventPropagation}
        onClick={toggleItalic}
      >
        <ItalicIcon />
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
      <StyleButton
        editor={editor}
        styles={styles}
        defaultStyle={DefaultTextAlignStyle}
        value="start"
      >
        <TextAlignStartIcon />
      </StyleButton>

      <StyleButton
        editor={editor}
        styles={styles}
        defaultStyle={DefaultTextAlignStyle}
        value="middle"
      >
        <TextAlignCenter />
      </StyleButton>

      <StyleButton
        editor={editor}
        styles={styles}
        defaultStyle={DefaultTextAlignStyle}
        value="end"
      >
        <TextAlignEnd />
      </StyleButton>
    </div>
  );
};

const StyleButton = ({
  editor,
  styles,
  defaultStyle,
  value,
  children,
}: {
  editor?: any;
  styles?: ReadonlySharedStyleMap | null;
  defaultStyle: any; //DefaultStyle
  value: string;
  children?: React.ReactNode;
}) => {
  if (styles === undefined) return null;

  return (
    <button
      className="external-button"
      data-isactive={
        // SharedStyle オブジェクトを取得
        (() => {
          const sharedStyle = styles?.get(defaultStyle);
          // sharedStyle が undefined でなく、かつ type が "shared" で value が "start" の場合のみ "true"
          return sharedStyle?.type === "shared" && sharedStyle.value === value
            ? "true"
            : "false";
        })()
      }
      data-can-click={
        styles && Array.from(styles.keys()).includes(defaultStyle)
          ? "true"
          : "false"
      }
      onClick={() => {
        editor.run(() => {
          editor.setStyleForNextShapes(defaultStyle, value);
          editor.setStyleForSelectedShapes(defaultStyle, value);
          // editor.setCurrentTool("textAlign");
        });
      }}
    >
      {children}
    </button>
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
