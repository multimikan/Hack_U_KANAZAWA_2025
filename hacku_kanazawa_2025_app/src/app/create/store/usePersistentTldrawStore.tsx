"use client";
// usePersistentTldrawStore.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, useMemo, useState } from "react";
import { createTLStore, getSnapshot, loadSnapshot } from "tldraw";
import { throttle } from "lodash";

export function usePersistentTldrawStore(
  persistenceKey: string,
  initialSnapshotJson?: string // ← 外部から受け取る JSON 文字列
) {
  const store = useMemo(() => createTLStore(), []);
  const [loadingState, setLoadingState] = useState<
    | { status: "loading" }
    | { status: "ready" }
    | { status: "error"; error: string }
  >({ status: "loading" });

  useLayoutEffect(() => {
    const initializeStore = async () => {
      try {
        setLoadingState({ status: "loading" });

        // ① まず引数で渡された JSON を優先的にロード
        if (initialSnapshotJson) {
          const snapshot = JSON.parse(initialSnapshotJson);
          loadSnapshot(store, snapshot);
        } else {
          // ② fallback: localStorage を参照
          const persistedSnapshot = localStorage.getItem(persistenceKey);
          if (persistedSnapshot) {
            const snapshot = JSON.parse(persistedSnapshot);
            loadSnapshot(store, snapshot);
          }
        }

        setLoadingState({ status: "ready" });
      } catch (error: any) {
        setLoadingState({ status: "error", error: error.message });
      }
    };

    initializeStore();

    // 変更監視（throttled 保存）
    const cleanupFn = store.listen(
      throttle(() => {
        const snapshot = getSnapshot(store);
        localStorage.setItem(persistenceKey, JSON.stringify(snapshot));
      }, 500)
    );

    return () => {
      cleanupFn();
    };
  }, [store, persistenceKey, initialSnapshotJson]); // ← initialSnapshotJson を依存に追加

  return { store, loadingState };
}
