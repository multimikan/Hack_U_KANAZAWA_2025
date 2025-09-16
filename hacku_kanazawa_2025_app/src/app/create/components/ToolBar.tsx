/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useState } from "react";
import {
  DefaultColorStyle,
  DefaultStylePanelContent,
  DefaultTextAlignStyle,
  DefaultToolbar,
  Editor,
  GeoShapeGeoStyle,
  HandToolbarItem,
  SelectTool,
  Tldraw,
  useRelevantStyles,
  useTools,
  useTranslation,
  useValue,
} from "tldraw";
import { Pencil, PencilIcon } from "lucide-react";
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
      <AlignTools editor={editor} />
    </div>
  );
};

function TextTools() {}

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

const ColorTools = ({ editor }: { editor?: any }) => {};

const AlignTools = ({ editor }: { editor?: any }) => {
  const textAlign = editor?.getSelectedShapeIds();
  const styles = useRelevantStyles();

  if (textAlign === undefined) return null;
  console.log(textAlign);
  return (
    <button
      className="external-button"
      data-isactive={textAlign === "start"}
      onClick={() => {
        editor.run(() => {
          editor.setStyleForNextShapes(DefaultTextAlignStyle, "start");
          // editor.setCurrentTool("textAlign");
        });
      }}
    >
      black
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
