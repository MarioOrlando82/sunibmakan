import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const USERS_COLLECTION = "users";

export const getUserPoints = async (): Promise<number> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User must be logged in to get points");

  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const data = userDoc.data();
    return data.points || 0;
  } else {
    return 0;
  }
};
