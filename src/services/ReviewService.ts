import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  increment,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { Review } from "../types/Review";

const COLLECTION_NAME = "restaurants";
const USERS_COLLECTION = "users";

export const addReview = async (
  review: Omit<Review, "id" | "likedBy" | "dislikedBy">
): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to add a review");

  const newReview: Review = {
    ...review,
    id: "",
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
    userId: user.uid,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newReview);

  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    await updateDoc(userRef, {
      points: increment(1),
    });
  } else {
    await setDoc(userRef, { points: 1 });
  }

  return docRef.id;
};

export const updateReview = async (
  id: string,
  review: Partial<Omit<Review, "id">>
): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to update a review");

  const reviewRef = doc(db, COLLECTION_NAME, id);
  const reviewDoc = await getDoc(reviewRef);

  if (reviewDoc.exists() && reviewDoc.data().userId === user.uid) {
    await updateDoc(reviewRef, review);
  } else {
    throw new Error("You don't have permission to update this review");
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to delete a review");

  const reviewRef = doc(db, COLLECTION_NAME, id);
  const reviewDoc = await getDoc(reviewRef);

  if (reviewDoc.exists() && reviewDoc.data().userId === user.uid) {
    await deleteDoc(reviewRef);
  } else {
    throw new Error("You don't have permission to delete this review");
  }
};

export const getReviews = async (): Promise<Review[]> => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Review;
    return {
      ...data,
      id: doc.id,
      likedBy: data.likedBy || [],
      dislikedBy: data.dislikedBy || [],
    };
  });
};

export const getUserReviews = async (): Promise<Review[]> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User must be logged in to get their reviews");

  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", user.uid)
  );
  const querySnapshot = await getDocs(q);
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

export const likeReview = async (id: string): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User must be logged in to like a review");

  const reviewRef = doc(db, "restaurants", id);
  const reviewDoc = await getDoc(reviewRef);

  if (reviewDoc.exists()) {
    const reviewData = reviewDoc.data() as Review;

    const likedBy = reviewData.likedBy || [];
    if (!likedBy.includes(user.uid)) {
      try {
        await updateDoc(reviewRef, {
          likes: increment(1),
          likedBy: [...likedBy, user.uid],
        });
      } catch (error) {
        console.error("Error updating review:", error);
        throw new Error("Failed to like the review. Please try again later.");
      }
    } else {
      throw new Error("You have already liked this review");
    }
  } else {
    throw new Error("Review does not exist");
  }
};

export const dislikeReview = async (id: string): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User must be logged in to dislike a review");

  const reviewRef = doc(db, "restaurants", id);
  const reviewDoc = await getDoc(reviewRef);

  if (reviewDoc.exists()) {
    const reviewData = reviewDoc.data() as Review;

    const dislikedBy = reviewData.dislikedBy || [];
    if (!dislikedBy.includes(user.uid)) {
      await updateDoc(reviewRef, {
        dislikes: increment(1),
        dislikedBy: [...dislikedBy, user.uid],
      });
    } else {
      throw new Error("You have already disliked this review");
    }
  }
};
