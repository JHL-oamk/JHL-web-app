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

export const createResult = async (queryId, answer, sources = []) => {
  return await addDoc(collection(db, "results"), {
    queryId,
    answer,
    sources,
    createdAt: serverTimestamp()
  });
};

export const getResultsByQueryId = async (queryId) => {
  const q = query(
    collection(db, "results"),
    where("queryId", "==", queryId)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};