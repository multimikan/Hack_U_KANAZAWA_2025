// すべての公開投稿を取得（accounts/*/posts から public: true のみ）
import { collectionGroup, getDocs, limit, where } from 'firebase/firestore';

/**
 * 全ユーザーの公開投稿のみを取得する
 * @param setPosts 投稿リストをセットするコールバック
 * @returns unsubscribe関数（ダミー）
 */
export const loadAllPublicPosts = async ({
  setPosts,
}: {
  setPosts: (posts: PostDocument[]) => void;
}):Promise<void> => {
  console.log("[loadRandomPublicPosts] start");

  try {
    // accounts/*/posts を横断して public=true のものを取得
    const q = query(
      collectionGroup(db, "posts"),
      where("style.public", "==", true),
      limit(50) // まず多めに取る（例: 50件）
    );

    const snap = await getDocs(q);
    console.log("[loadRandomPublicPosts] total found:", snap.size);

    const allPosts: PostDocument[] = snap.docs.map((doc) => {
      const data = doc.data() as PostDocument;
      return {
        id: doc.id,
        email: doc.ref.parent.parent?.id ?? "unknown", // 親の userId を取得
        style: {
          id: data.style.id,
          public: data.style.public,
          title: data.style.title,
          tldrawStore: data.style.tldrawStore,
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    // ランダムに10件選ぶ
    const shuffled = allPosts.sort(() => Math.random() - 0.5).slice(0, 10);

    console.log("[loadRandomPublicPosts] shuffled:", shuffled.map((p) => p.style.title));

    setPosts(shuffled);
  } catch (error) {
    console.error("[loadRandomPublicPosts] error:", error);
  }
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { setDoc, addDoc, getFirestore, Timestamp, collection, query, orderBy, onSnapshot, doc, getDoc} from 'firebase/firestore';
import { Store } from 'tldraw';
import { getSession, useSession } from "next-auth/react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app,"hacku-kanazawa-2025-database");

// PostStyle インターフェースを修正
export interface PostStyle {
  id: string
  public: boolean
  title: string
  tldrawStore: string
}

// ドキュメントから取得するデータの型
export interface PostDocument {
  id: string
  email: string
  style: PostStyle
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const addData = async ({ style }: { style: PostStyle }) => {
  const session = await getSession();
  if (!session || !session.user?.email) return;

  try {
    const payload = {
      style: {
        id: style.id,
        public: style.public ?? false,
        title: style.title,
        tldrawStore: style.tldrawStore,
      },
      email: session.user.email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    console.log("Firestore payload:", payload);

    // accounts/{email}/posts に doc を追加（自動ID）
    const postsRef = doc(db, "accounts", session.user.email, "posts",style.id);
    await setDoc(postsRef, payload);


  } catch (error: any) {
    console.error("Error adding document:", error);
    throw error;
  }
};


export const loadData = ({
  email,
  setPosts,
}: {
  email: string
  setPosts: (posts: PostDocument[]) => void
}) => {
  // サブコレクションへの参照を取得
  const postsRef = collection(db, 'accounts', email, 'posts')

  // updatedAt で降順ソート
  const q = query(postsRef, orderBy('updatedAt', 'desc'))

  // リアルタイム購読
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts: PostDocument[] = snapshot.docs.map((doc) => {
      const data = doc.data() as PostDocument
      return {
        id: doc.id,
        email,
        style: {
          id: data.style.id,
          public: data.style.public,
          title: data.style.title,
          tldrawStore: data.style.tldrawStore,
        },
        createdAt: data.createdAt as Timestamp,
        updatedAt: data.updatedAt as Timestamp,
      }
    })
    setPosts(posts)
  })

  // コンポーネントのクリーンアップ用に解除関数を返す
  return unsubscribe
}

export async function fetchPostById(params: {
  email: string;
  postId: string;
}): Promise<PostStyle | null> {
  const { email, postId } = params;
  const docRef = doc(db, "accounts", email, "posts", postId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;

  const raw = snap.data() as { style?: any };
  if (!raw.style) return null;

  const style: PostStyle = {
    id: snap.id, // または raw.style.id を優先しても可
    public: raw.style.public,
    title: raw.style.title,
    tldrawStore: raw.style.tldrawStore,
  };
  return style;
}