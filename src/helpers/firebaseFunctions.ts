import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { firebaseDateAdjusted } from "./dateFilter";
import { app } from "../db/Firebase";
import { toast } from "react-toastify";
import { Category } from "../@types";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

// GET DATA
export async function getFirebaseData(
  type: "item" | "category",
  querySnapshot: DocumentData
) {
  const firebaseData: any = [];
  if (type === "item") {
    await querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const promiseProvisional = doc.data();
      const promise = {
        ...promiseProvisional,
        date: firebaseDateAdjusted(
          promiseProvisional.date.toDate().toLocaleDateString()
        ),
      };
      firebaseData.push(promise);
    });
  } else if (type === "category") {
    await querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const promise = doc.data();
      firebaseData.push(promise);
    });
  }
  return firebaseData;
}

export async function getFirebaseDataFilterById(queryCategoryById: Query) {
  const promises: any = [];
  const getCategoryDetails = await getDocs(queryCategoryById);
  getCategoryDetails.forEach((doc) => {
    const promise = doc.data();
    promises.push(promise);
  });
  return promises;
}

// DELETE DATA
export async function deleteFirebaseData(userId: string, firebasePath: string, id: string) {
  // PATH GLOBAL TO ITEMS AND CATEGORIES
  const pathFirebase = {
    items: `users/${userId}/items`,
    categories: `users/${userId}/categories`,
  };

  if (firebasePath === "items") {
    try {
      await deleteDoc(doc(db, pathFirebase.items, id));
      toast.success(`Record eliminato correttamente! 👌`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    } catch {
      toast.error(`C'è stato un errore... 🤯`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    }
  } else if (firebasePath === "categories") {
    async function handleDetailsData() {
      const itemsFilterByCategoryId = query(
        collection(db, `users/${userId}/items`),
        where("categoryId", "==", id)
      );
      const existingItems: Category[] = await getFirebaseDataFilterById(
        itemsFilterByCategoryId
      );
      if (existingItems.length > 0) {
        toast.error(
          existingItems.length === 1
            ? `C'è 1 record registrato con la categoria selezionata, elimina il record prima di eliminare la categoria... 🤯`
            : `Sono presenti ${existingItems.length} record registrati con la categoria selezionata, eliminare i record prima di eliminare la categoria... 🤯`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          }
        );
      } else {
        try {
          await deleteDoc(doc(db, pathFirebase.categories, id));
          toast.success(`Record eliminato correttamente! 👌`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
        } catch {
          toast.error(`C'è stato un errore... 🤯`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            theme: "colored",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            autoClose: 3000,
          });
        }
      }
    }
    handleDetailsData();
  }
}
