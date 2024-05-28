import { ConfirmDialog } from "primereact/confirmdialog";
import { useEffect, useState } from "react";
import { Category, Item, PathFirebaseProps, windowSizeProps } from "../@types";
import { HandleRadioCheckValueFunction } from "../App";
import { filterListByMonth, formatDate } from "../helpers/dateFilter";
import { deleteFirebaseData } from "../helpers/firebaseFunctions";

type Props = {
  item?: Item;
  allList?: Item[];
  isHome: boolean;
  isSpesa: boolean;
  category?: Category;
  currentMonth: string;
  isSettings: boolean;
  isCategorySettings: boolean;
  windowSize: windowSizeProps;
  pathFirebase: PathFirebaseProps;
  userId: string;
  categoryListDetails: Category;
  handleRadioChecked: ({
    redditoValue,
    spesaValue,
  }: HandleRadioCheckValueFunction) => void;
  handleCategoryItemsList: (categoryListDetails: Category) => void;
};

export function TableItem({
  item,
  allList,
  isHome,
  isSpesa,
  category,
  isSettings,
  isCategorySettings,
  windowSize,
  userId,
  currentMonth,
  categoryListDetails,
  handleRadioChecked,
  handleCategoryItemsList,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [filteredCategoryItemsList, setFilteredCategoryItemsList] = useState<
    Item[]
  >([]);
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);

  // MONITORING CURRENT MONTH
  useEffect(() => {
    if (isHome) {
      if (allList) {
        setFilteredCategoryItemsList(filterListByMonth(allList, currentMonth));
      }
    }
  }, [allList, currentMonth, categoryListDetails, isHome]);

  // GET INCOME/EXPENSE/CATEGORY ASPECTED EXPENSE
  useEffect(() => {
    let incomeCount = 0;
    let expenseCount = 0;
    if (isHome && allList) {
      for (const i in filteredCategoryItemsList) {
        if (
          category!.expense &&
          filteredCategoryItemsList[i].categoryId === category!.id
        ) {
          expenseCount += filteredCategoryItemsList[i].value;
        } else {
          if (filteredCategoryItemsList[i].categoryId === category!.id) {
            incomeCount += filteredCategoryItemsList[i].value;
          }
        }
        setIncome(incomeCount);
        setExpense(expenseCount);
      }
    }
  }, [filteredCategoryItemsList, isHome, category, allList, currentMonth]);

  if (isSettings) {
    // APP SETTINGS
    null;
  } else if (isCategorySettings) {
    // CATEGORY SETTINGS
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
    //   const [itemCategory, setItemCategory] = useState<Category>({
    //     id: "",
    //     color: "",
    //     title: "",
    //     expense: false,
    //     valueExpected: 0
    //   });
    //   // useEffect(() => {
    //   //   if (item!.categoryId !== "") {
    //   //     async function handleDetailsData() {
    //   //       const queryItemById = query(
    //   //         collection(db, pathFirebase.categories),
    //   //         where("id", "==", item?.categoryId)
    //   //       );
    //   //       const categoryDetails: Category[] = await getFirebaseDataFilterById(
    //   //         queryItemById
    //   //       );
    //   //       setItemCategory(categoryDetails[0]);
    //   //     }
    //   //     handleDetailsData();
    //   //   } else {
    //   //     setItemCategory({
    //   //       id: "",
    //   //       color: "",
    //   //       title: "",
    //   //       expense: false,
    //   //       valueExpected: 0
    //   //     });
    //   //   }
    //   // }, [item]);
    //   const bgColor = itemCategory?.expense ? "bg-red-700" : "bg-green-700";
    //   const textColor = itemCategory?.expense ? "text-red-600" : "text-green-600";
    //   return (
    //     <tr className="flex px-5 justify-between items-center">
    //       {/* <td className="flex w-2/12 py-3 px-0 menuBreak:px-2 text-left">
    //         {windowSize.innerWidth <= 857
    //           ? formatDate(item!.date).slice(0, 5)
    //           : formatDate(item!.date)}
    //       </td> */}
    //       {/* <td className="hidden menuBreak:flex w-2/12 py-3 px-0 menuBreak:px-2 text-left">
    //         <div
    //           className={`inline-block w-full mr-0 py-2 px-0 menuBreak:px-2 rounded ${bgColor}`}
    //         >
    //           {item!.categoryName}
    //         </div>
    //       </td> */}
    //       <td className="flex w-3/12 menuBreak:w-4/12 py-3 px-0 menuBreak:px-2 text-left" onClick={() => { alert(`NÃO É CULPA MINHA, ESTOU MANDANDO: ${category!.id}`),handleCategoryItemsList(category!.id) }}>

    //         {category!.title}

    //       </td>
    //       {/* Valor esperado */}
    //       <td className="flex w-3/12 py-3 px-0 menuBreak:px-2 text-right">
    //         <div className={`inline-block w-full py-2 rounded ${textColor}`}>
    //           {category?.valueExpected === undefined ? teste.toLocaleString("ita", {
    //             style: "currency",
    //             currency: "EUR",
    //           }) : category!.valueExpected.toLocaleString("ita", {
    //             style: "currency",
    //             currency: "EUR",
    //           })}
    //         </div>
    //       </td>
    //       {/* Valor Gasto */}
    //       <td className="flex w-3/12 py-3 px-0 menuBreak:px-2 text-right">
    //         <div className={`inline-block w-full py-2 rounded text-red-500`}>
    //           {category?.expense ? category?.valueExpected === undefined ? teste.toLocaleString("ita", {
    //             style: "currency",
    //             currency: "EUR",
    //           }) : category!.valueExpected.toLocaleString("ita", {
    //             style: "currency",
    //             currency: "EUR",
    //           }) : "-"}
    //         </div>
    //       </td>
    //       {/* <td className="flex w-1/12 py-3 px-0 menuBreak:px-2 text-left ">
    //         <ConfirmDialog
    //           className="bg-red-800 p-5 border border-red-800 rounded-3xl flex gap-5 items-center w-64"
    //           visible={visible}
    //           onHide={() => setVisible(false)}
    //           message={`Vuoi eliminare ${category!.title}?`}
    //           header="Conferma"
    //           icon={""}
    //           accept={() => {
    //             deleteFirebaseData(userId, "category", item!.id),
    //               handleRadioChecked({ redditoValue: false, spesaValue: false });
    //           }}
    //           reject={() => setVisible(false)}
    //         />
    //         <div
    //           className="w-10 text-right py-1 text-lg cursor-pointer"
    //           onClick={() => {
    //             setVisible(true);
    //           }}
    //         >
    //           ⛔
    //         </div>
    //       </td> */}
    //     </tr>
    //   );
  } else if (isHome) {
    // CATEGORY LIST
    if (filteredCategoryItemsList.length !== 0 && category !== undefined) {
      const textColor = category.expense ? "text-red-600" : "text-green-600";
      return expense !== 0 || income !== 0 ? (
        <tr className="flex px-5 justify-between items-center">
          {/* Nome Categoria */}
          <td
            className="flex w-3/12 menuBreak:w-4/12 py-3 px-0 menuBreak:px-2 text-left"
            onClick={() => {
              handleCategoryItemsList(category);
            }}
          >
            {category.title}
          </td>
          {/* Valor esperado */}
          <td className="flex w-3/12 py-3 px-0 menuBreak:px-2 text-right">
            <div className={`inline-block w-full py-2 rounded ${textColor}`}>
              {category.valueExpected === undefined
                ? income.toLocaleString("ita", {
                    style: "currency",
                    currency: "EUR",
                  })
                : category.valueExpected.toLocaleString("ita", {
                    style: "currency",
                    currency: "EUR",
                  })}
            </div>
          </td>
          {/* Valor Gasto */}
          {isSpesa ? (
            <td className="flex w-3/12 py-3 px-0 menuBreak:px-2 text-right">
              <div
                className={`inline-block w-full py-2 rounded ${
                  expense > category.valueExpected
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {category.expense
                  ? category.valueExpected === undefined
                    ? income.toLocaleString("ita", {
                        style: "currency",
                        currency: "EUR",
                      })
                    : expense.toLocaleString("ita", {
                        style: "currency",
                        currency: "EUR",
                      })
                  : "-"}
              </div>
            </td>
          ) : null}
        </tr>
      ) : null;
    } else {
      null;
    }
  } else {
    // CATEGORY ITEMS LIST
    const textColor = categoryListDetails?.expense
      ? "text-red-600"
      : "text-green-600";
    return (
      <tr className="flex px-5 justify-between items-center">
        <td className="flex w-2/12 py-3 px-0 menuBreak:px-2 text-left">
          {windowSize.innerWidth <= 857
            ? formatDate(item!.date).slice(0, 5)
            : formatDate(item!.date)}
        </td>
        <td className="hidden menuBreak:flex w-2/12 py-3 px-0 menuBreak:px-2 text-left">
          <div
            className={`inline-block w-full mr-0 py-2 px-0 menuBreak:px-2 rounded ${textColor}`}
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
        <td className="flex w-1/12 py-3 px-0 menuBreak:px-2 text-left">
          <ConfirmDialog
            className="flex gap-16 items-center w-1/4 p-5 border bg-red-800 border-red-800 rounded-3xl"
            visible={visible}
            onHide={() => setVisible(false)}
            message={`Vuoi eliminare: ${item!.title}?`}
            header="Conferma"
            icon={"pi pi-check"}
            accept={() => {
              deleteFirebaseData(userId, "items", item!.id),
                handleRadioChecked({ redditoValue: false, spesaValue: false });
            }}
            reject={() => setVisible(false)}
          />
          <div
            className="w-full text-right py-1 text-lg cursor-pointer"
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
