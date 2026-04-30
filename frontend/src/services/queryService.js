import { db } from "../config/firebase";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

export const createQuery = async (uid, question) => {
  return await addDoc(collection(db, "queries"), {
    userId: uid,
    question,
    status: "pending",
    createdAt: serverTimestamp()
  });
};

export const getUserQueries = async (uid) => {
  const q = query(
    collection(db, "queries"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};