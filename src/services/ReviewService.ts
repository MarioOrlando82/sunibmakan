import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { Review } from "../types/Review";

const COLLECTION_NAME = "restaurants";

export const addReview = async (
  review: Omit<Review, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), review);
  return docRef.id;
};

export const updateReview = async (
  id: string,
  review: Partial<Omit<Review, "id">>
): Promise<void> => {
  const reviewRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(reviewRef, review);
};

export const deleteReview = async (id: string): Promise<void> => {
  const reviewRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(reviewRef);
};

export const getReviews = async (): Promise<Review[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Review)
  );
};

export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
