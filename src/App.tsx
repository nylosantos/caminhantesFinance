import { getAuth, signOut } from "firebase/auth";
import {
  Timestamp,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Category, CategoryFormatted, Item, windowSizeProps } from "./@types";
import { Header } from "./components/Header";
import { InfoArea } from "./components/InfoArea";
import { InputArea } from "./components/InputArea";
import { MenuModal } from "./components/MenuModal";
import { SubmitLoading } from "./components/SubmitLoading";
import { TableArea } from "./components/TableArea";
import { LoginPage } from "./components/login/LoginPage";
import { app, initFirebase } from "./db/Firebase";
import {
  filterListByMonth,
  filterListByMonthAndCategory,
  getCurrentMonth,
} from "./helpers/dateFilter";
import { getFirebaseData } from "./helpers/firebaseFunctions";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

// GET SCREEN SIZE FUNCTION
function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

// TYPE RADIO CHECK VALUE
export type HandleRadioCheckValueFunction = {
  redditoValue: boolean;
  spesaValue: boolean;
};

function App() {
  // INITIALIZING FIREBASE AND FIREBASE ADMIN
  initFirebase();

  // INITIALIZING FIREBASE AUTH
  const auth = getAuth();

  // USER AUTH STATE
  const [user, loading] = useAuthState(auth);

  // LOGIN/REGISTER STATE
  const [login, setLogin] = useState(true);

  // USER LOGGED STATE
  const [logged, setLogged] = useState(true);

  const [isSettings, setIsSettings] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const [isCategorySettings, setIsCategorySettings] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [list, setList] = useState<Item[]>();
  const [filteredList, setFilteredList] = useState<Item[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [categoryAspectedExpense, setCategoryAspectedExpense] = useState(0);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categoryFormatted, setCategoryFormatted] = useState<
    CategoryFormatted | Record<string, never>
  >({});
  const [categoryListDetails, setCategoryListDetails] = useState<Category>();

  // PATH GLOBAL TO ITEMS AND CATEGORIES
  const pathFirebase = {
    items: `users/${user?.uid}/items`,
    categories: `users/${user?.uid}/categories`,
  };

  // GET SCREEN SIZE HOOK
  const [windowSize, setWindowSize] = useState<windowSizeProps>(
    getWindowSize()
  );

  // GETTING WINDOW RESIZE
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // GET DATA
  const handleData = async () => {
    const itemsQuery = query(
      collection(db, pathFirebase.items),
      orderBy("date")
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore for itemsListener
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemsListener = onSnapshot(itemsQuery, async (querySnapshot) => {
      const firebaseItems = await getFirebaseData("item", querySnapshot);
      setList(firebaseItems);
    });
    const categoriesQuery = query(
      collection(db, pathFirebase.categories),
      orderBy("title")
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore for categoriesListener
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const categoriesListener = onSnapshot(
      categoriesQuery,
      async (querySnapshot) => {
        const firebaseCategoriesItems = await getFirebaseData(
          "category",
          querySnapshot
        );
        setCategoryList(firebaseCategoriesItems);
      }
    );
  };

  // MONITORING USER LOGIN
  useEffect(() => {
    if (user !== null) {
      setLogged(true);
      handleData();
    } else {
      setLogged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // LOGOUT FUNCTION
  function logoutFunction() {
    signOut(auth);
    setIsMenu(false);
    setLogin(true);
  }

  // RESET CURRENT MONTH
  // useEffect(() => {
  //   if (isHome) {
  //     const itemsQuery = query(collection(db, pathFirebase.items));
  //     //@ts-ignore for itemsListener
  //     const itemsListener = onSnapshot(itemsQuery, async (querySnapshot) => {
  //       const firebaseItems = await getFirebaseData("item", querySnapshot);
  //       setList(firebaseItems);
  //     });
  //   } else {
  //     const itemsQuery = query(
  //       collection(db, pathFirebase.items),
  //       orderBy("date")
  //     );
  //     //@ts-ignore for itemsListener
  //     const itemsListener = onSnapshot(itemsQuery, async (querySnapshot) => {
  //       const firebaseItems = await getFirebaseData("item", querySnapshot);
  //       setList(firebaseItems);
  //     });
  //   }
  //   setCurrentMonth(getCurrentMonth);
  // }, [isHome]);

  // MONITORING CURRENT MONTH

  useEffect(() => {
    if (isHome) {
      if (list) {
        setFilteredList(filterListByMonth(list, currentMonth));
      }
    } else {
      if (list) {
        setFilteredList(
          filterListByMonthAndCategory(list, currentMonth, categoryListDetails!)
        );
      }
    }
  }, [list, currentMonth, isHome, categoryListDetails]);

  // GET CATEGORY LIST
  useEffect(() => {
    let categoryExpenseCount = 0;
    if (categoryList) {
      categoryList.forEach((category: Category) => {
        category.valueExpected
          ? (categoryExpenseCount += category.valueExpected)
          : null,
          setCategoryFormatted((prevData) => ({
            ...prevData,
            [category.id]: {
              id: category.id,
              color: category.color,
              title: category.title,
              expense: category.expense,
              valueExpected: category.valueExpected,
            },
          }));
      });
    }
  }, [categoryList]);

  // GET INCOME/EXPENSE/CATEGORY ASPECTED EXPENSE
  useEffect(() => {
    const categoryMonthIds: string[] = [];
    let incomeCount = 0;
    let expenseCount = 0;
    let categoryMonthAspectedExpense = 0;
    if (isHome) {
      for (const i in filteredList) {
        if (categoryFormatted[filteredList[i].categoryId].expense) {
          expenseCount += filteredList[i].value;
        } else {
          incomeCount += filteredList[i].value;
        }
        categoryMonthIds.includes(filteredList[i].categoryId)
          ? null
          : categoryMonthIds.push(filteredList[i].categoryId);
      }
      setIncome(incomeCount);
      setExpense(expenseCount);
      categoryMonthIds.forEach((id: string) => {
        const categoriesQuery = query(
          collection(db, pathFirebase.categories),
          where("id", "==", id)
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore for categoriesListener
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const categoriesListener = onSnapshot(
          categoriesQuery,
          async (querySnapshot) => {
            const firebaseCategoriesItems: Category[] = await getFirebaseData(
              "category",
              querySnapshot
            );
            firebaseCategoriesItems[0].valueExpected
              ? (categoryMonthAspectedExpense +=
                  firebaseCategoriesItems[0].valueExpected)
              : null;
            setCategoryAspectedExpense(categoryMonthAspectedExpense);
          }
        );
      });
    } else if (categoryListDetails !== undefined) {
      for (const i in filteredList) {
        if (categoryListDetails.expense) {
          expenseCount += filteredList[i].value;
        } else {
          incomeCount += filteredList[i].value;
        }
      }
      setIncome(incomeCount);
      setExpense(expenseCount);
    } else {
      setIncome(999999999);
      setExpense(999999998);
    }
  }, [
    categoryFormatted,
    categoryListDetails,
    filteredList,
    isHome,
    pathFirebase.categories,
  ]);

  function handleMonthChange(newMonth: string) {
    setCurrentMonth(newMonth);
  }

  function handleIsSettings() {
    setIsSettings(true);
    setIsCategorySettings(false);
    setIsMenu(false);
  }

  function handleIsCategorySettings() {
    setIsCategorySettings(true);
    setIsSettings(false);
    setIsMenu(false);
  }

  function handleIsHome() {
    setIsCategorySettings(false);
    setIsSettings(false);
    setIsMenu(false);
    setIsHome(true);
  }

  function handleCategoryItemsList(categoryListDetails: Category) {
    setCategoryListDetails(categoryListDetails);
    setIsHome(false);
  }

  function handleIsMenu() {
    setIsMenu(!isMenu);
    setRadioChecked({ reddito: false, spesa: false });
  }

  const [radioChecked, setRadioChecked] = useState({
    reddito: false,
    spesa: false,
  });

  function handleRadioChecked({
    redditoValue,
    spesaValue,
  }: HandleRadioCheckValueFunction) {
    setRadioChecked({ reddito: redditoValue, spesa: spesaValue });
  }

  const handleAddItem = async (item: Item) => {
    try {
      await setDoc(doc(db, pathFirebase.items, item.id), {
        id: item.id,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        date: Timestamp.fromDate(new Date(item.date)),
        title: item.title,
        value: item.value,
      });
      toast.success(`Record aggiunto con successo! 👌`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    } catch (error) {
      console.log("ESSE É O ERROR", error);
      toast.error(`C'è stato un errore... 🤯`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    }
  };

  const handleAddCategory = async (category: Category) => {
    try {
      await setDoc(doc(db, pathFirebase.categories, category.id), {
        id: category.id,
        title: category.title,
        color: category.color,
        expense: category.expense,
        valueExpected: category.valueExpected,
      });
      toast.success(`Categoria aggiunta con successo! 👌`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    } catch (error) {
      console.log("ESSE É O ERROR", error);
      toast.error(`C'è stato un errore... 🤯`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "colored",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 3000,
      });
    }
  };
  return (
    <div>
      {/* SUBMIT LOADING */}
      <SubmitLoading
        isSubmitting={
          loading ? true : filteredList ? false : categoryList ? false : true
        }
        whatsGoingOn="caricamento"
      />
      {/* MENU */}
      <MenuModal
        isMenu={isMenu}
        isHomeFunction={handleIsHome}
        isSettingsFunction={handleIsSettings}
        isCategorySettingsFunction={handleIsCategorySettings}
        logoutFunction={logoutFunction}
      />
      {/* TOAST CONTAINER */}
      <ToastContainer limit={5} />
      {/* HEADER */}
      <Header
        isMenu={isMenu}
        logged={logged}
        isMenuFunction={handleIsMenu}
        username={user?.displayName ? user.displayName : "Utente"}
      />
      {/* BODY */}
      {loading ? null : !logged ? (
        <LoginPage login={login} setLogin={setLogin} />
      ) : (
        <div className="flex flex-col gap-4 m-auto max-w-[1280px] mb-14">
          {/* INFORMAÇÕES */}
          <InfoArea
            isHomeFunction={handleIsHome}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            income={income}
            expense={expense}
            isSettings={isSettings}
            isCategorySettings={isCategorySettings}
            isHome={isHome}
            categoryListDetails={categoryListDetails!}
            categoryAspectedExpense={categoryAspectedExpense}
          />
          {/* INSERÇÃO */}
          {isSettings ? null : (
            <InputArea
              onAddItem={handleAddItem}
              onAddCategory={handleAddCategory}
              isSettings={isSettings}
              isCategorySettingsFunction={handleIsCategorySettings}
              categoryList={categoryList}
              isCategorySettings={isCategorySettings}
              pathFirebase={pathFirebase}
              radioChecked={radioChecked}
              handleRadioChecked={handleRadioChecked}
            />
          )}
          {/* ITENS */}
          <TableArea
            list={filteredList}
            allList={list}
            isHome={isHome}
            currentMonth={currentMonth}
            income={income}
            categoriesList={categoryList}
            isSettings={isSettings}
            isCategorySettings={isCategorySettings}
            windowSize={windowSize}
            pathFirebase={pathFirebase}
            userId={user ? user?.uid : "fail"}
            categoryListDetails={categoryListDetails!}
            handleRadioChecked={handleRadioChecked}
            handleCategoryItemsList={handleCategoryItemsList}
          />
        </div>
      )}
    </div>
  );
}

export default App;
