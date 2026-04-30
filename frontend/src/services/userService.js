import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const createUser = async (uid, data) => {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};