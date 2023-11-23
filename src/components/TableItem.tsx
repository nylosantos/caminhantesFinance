import { useEffect, useState } from "react";
import { Category, Item, PathFirebaseProps, windowSizeProps } from "../@types";
import { formatDate } from "../helpers/dateFilter";
import {
  deleteFirebaseData,
  getFirebaseDataFilterById,
} from "../helpers/firebaseFunctions";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { app } from "../db/Firebase";

type Props = {
  item?: Item;
  category?: Category;
  isSettings: boolean;
  isCategorySettings: boolean;
  windowSize: windowSizeProps;
  pathFirebase: PathFirebaseProps;
  userId: string;
};

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function TableItem({
  item,
  category,
  isSettings,
  isCategorySettings,
  windowSize,
  pathFirebase,
  userId,
}: Props) {
  if (isSettings) {
    null;
  } else if (isCategorySettings) {
    const bgColor = category?.expense ? "bg-red-500" : "bg-green-500";
    return (
      <tr className="flex w-full px-5 p-3 items-center">
        <td className="flex w-2/3 py-3 menuBreak:px-2 text-left">
          {category!.title}
        </td>
        <td className="flex w-3/6 py-3 menuBreak:px-2 justify-center">
          <div
            className={`inline-block w-7/12 menuBreak:w-2/6 mr-0 py-2 px-2 rounded ${bgColor} text-center`}
          >
            {category!.expense ? "Spese" : "Reddito"}
          </div>
        </td>
        <td className="flex w-1/6 py-3 menuBreak:px-2 justify-end">
          <div
            className="w-10 text-right py-1 text-lg cursor-pointer"
            onClick={() =>
              deleteFirebaseData(userId, "categories", category!.id)
            }
          >
            ⛔
          </div>
        </td>
      </tr>
    );
  } else {
    const [itemCategory, setItemCategory] = useState<Category>({
      id: "",
      color: "",
      title: "",
      expense: false,
    });
    useEffect(() => {
      if (item!.categoryId !== "") {
        async function handleDetailsData() {
          const queryItemById = query(
            collection(db, pathFirebase.categories),
            where("id", "==", item?.categoryId)
          );
          const categoryDetails: Category[] = await getFirebaseDataFilterById(
            queryItemById
          );
          setItemCategory(categoryDetails[0]);
        }
        handleDetailsData();
      } else {
        setItemCategory({
          id: "",
          color: "",
          title: "",
          expense: false,
        });
      }
    }, [item]);
    const bgColor = itemCategory?.expense ? "bg-red-500" : "bg-green-500";
    const textColor = itemCategory?.expense ? "text-red-500" : "text-green-500";
    return (
      <tr className="flex px-5 justify-between items-center">
        <td className="flex w-2/12 py-3 px-0 menuBreak:px-2 text-left">
          {windowSize.innerWidth <= 857
            ? formatDate(item!.date).slice(0, 5)
            : formatDate(item!.date)}
        </td>
        <td className="hidden menuBreak:flex w-2/12 py-3 px-0 menuBreak:px-2 text-left">
          <div
            className={`inline-block w-full mr-0 py-2 px-0 menuBreak:px-2 rounded ${bgColor}`}
          >
            {item!.categoryName}
          </div>
        </td>
        <td className="flex w-3/12 menuBreak:w-4/12 py-3 px-0 menuBreak:px-2 text-left">
          {item!.title}
        </td>
        <td className="flex w-3/12 py-3 px-0 menuBreak:px-2 text-right">
          <div className={`inline-block w-full py-2 rounded ${textColor}`}>
            {item!.value.toLocaleString("ita", {
              style: "currency",
              currency: "EUR",
            })}
          </div>
        </td>
        <td className="flex w-1/12 py-3 px-0 menuBreak:px-2 text-left ">
          <div
            className="w-full text-right py-1 text-lg cursor-pointer"
            onClick={() => deleteFirebaseData(userId, "items", item!.id)}
          >
            ⛔
          </div>
        </td>
      </tr>
    );
  }
}
