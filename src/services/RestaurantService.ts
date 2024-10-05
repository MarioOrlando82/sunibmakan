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
import { Restaurant } from "../types/Restaurant";

const COLLECTION_NAME = "restaurants";

export const addRestaurant = async (
  restaurant: Omit<Restaurant, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), restaurant);
  return docRef.id;
};

export const updateRestaurant = async (
  id: string,
  restaurant: Partial<Omit<Restaurant, "id">>
): Promise<void> => {
  const restaurantRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(restaurantRef, restaurant);
};

export const deleteRestaurant = async (id: string): Promise<void> => {
  const restaurantRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(restaurantRef);
};

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Restaurant)
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
