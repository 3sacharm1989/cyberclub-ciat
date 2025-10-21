import { useEffect, useState } from "react";
import { db, fx } from "../firebase";

export default function useFirestoreList(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = fx.query(fx.collection(db, collectionName), fx.orderBy("createdAt", "desc"));
        const snapshot = await fx.getDocs(q);
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(docs);
      } catch (err) {
        console.error("Error fetching Firestore data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [collectionName]);

  return { data, loading };
}
