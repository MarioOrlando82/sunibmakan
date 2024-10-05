import { db } from "../firebase";
import { Comment } from "../types/Comment";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const COMMENTS_COLLECTION = "comments";

export const addComment = async (comment: Comment): Promise<void> => {
  await addDoc(collection(db, COMMENTS_COLLECTION), comment);
};

export const getComments = async (reviewId: string): Promise<Comment[]> => {
  const comments: Comment[] = [];
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where("reviewId", "==", reviewId)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() } as Comment);
  });

  return comments;
};
