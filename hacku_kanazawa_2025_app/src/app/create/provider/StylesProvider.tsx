"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import { DefaultTextAlignStyle, useRelevantStyles } from "tldraw";

export default function StylesProvider({
  onStylesChange,
}: {
  onStylesChange: (styles: any) => void;
}) {
  const styles = useRelevantStyles();
  useEffect(() => {
    onStylesChange(styles);
  }, [styles, onStylesChange]);

  return null; // UIは出さず、stateを親に渡すだけ
}
