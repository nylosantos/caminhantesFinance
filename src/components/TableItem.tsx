import { useEffect, useState } from "react";
import { Category, Item, PathFirebaseProps, windowSizeProps } from "../@types";
import { formatDate } from "../helpers/dateFilter";
import {
  deleteFirebaseData,
  getFirebaseDataFilterById,
} from "../helpers/firebaseFunctions";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { app } from "../db/Firebase";
import { HandleRadioCheckValueFunction } from "../App";
import { ConfirmDialog } from "primereact/confirmdialog";

type Props = {
  item?: Item;
  category?: Category;
  isSettings: boolean;
  isCategorySettings: boolean;
  windowSize: windowSizeProps;
  pathFirebase: PathFirebaseProps;
  userId: string;
  handleRadioChecked: ({
    redditoValue,
    spesaValue,
  }: HandleRadioCheckValueFunction) => void;
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
  handleRadioChecked,
}: Props) {
  const [visible, setVisible] = useState(false);
  if (isSettings) {
    null;
  } else if (isCategorySettings) {
    const bgColor = category?.expense ? "bg-red-700" : "bg-green-700";
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
          <ConfirmDialog
            className="bg-red-800 p-5 border border-red-800 rounded-3xl flex gap-5 items-center w-64"
            visible={visible}
            onHide={() => setVisible(false)}
            message={`Vuoi eliminare ${category!.title}?`}
            header="Conferma"
            icon={""}
            accept={() => {
              deleteFirebaseData(userId, "categories", category!.id),
                handleRadioChecked({ redditoValue: false, spesaValue: false });
            }}
            reject={() => setVisible(false)}
          />
          <div
            className="w-10 text-right py-1 text-lg cursor-pointer"
            onClick={() => {
              setVisible(true);
            }}
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
    const bgColor = itemCategory?.expense ? "bg-red-700" : "bg-green-700";
    const textColor = itemCategory?.expense ? "text-red-600" : "text-green-600";
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
          <ConfirmDialog
            className="bg-red-800 p-5 border border-red-800 rounded-3xl flex gap-5 items-center w-64"
            visible={visible}
            onHide={() => setVisible(false)}
            message={`Vuoi eliminare ${item!.title}?`}
            header="Conferma"
            icon={""}
            accept={() => {
              deleteFirebaseData(userId, "items", item!.id),
                handleRadioChecked({ redditoValue: false, spesaValue: false });
            }}
            reject={() => setVisible(false)}
          />
          <div
            className="w-10 text-right py-1 text-lg cursor-pointer"
            onClick={() => {
              setVisible(true);
            }}
          >
            ⛔
          </div>
        </td>
      </tr>
    );
  }
}
