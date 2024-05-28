import { useEffect, useState } from "react";
import { Header } from "./Header";
import { filterListByMonth, getCurrentMonth } from "../helpers/dateFilter";
import { Category, CategoryFormatted, Item, windowSizeProps } from "../@types";
import { TableArea } from "./TableArea";
import { InfoArea } from "./InfoArea";
import { InputArea } from "./InputArea";
import {
  Timestamp,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import { app, initFirebase } from "../db/Firebase";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { getFirebaseData } from "../helpers/firebaseFunctions";
import { MenuModal } from "./MenuModal";
import { SubmitLoading } from "./SubmitLoading";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { LoginPage } from "./login/LoginPage";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

// GET SCREEN SIZE FUNCTION
function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

export type HandleRadioCheckValueFunction = {
  redditoValue: boolean;
  spesaValue: boolean;
};

type Props = { categoryPageId: string }

function CategoryListPage({ categoryPageId }: Props) {
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
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categoryFormatted, setCategoryFormatted] = useState<
    CategoryFormatted | Record<string, never>
  >({});

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
    const itemsQuery = query(collection(db, pathFirebase.items));
    //@ts-ignore for itemsListener
    const itemsListener = onSnapshot(itemsQuery, async (querySnapshot) => {
      const firebaseItems = await getFirebaseData("item", querySnapshot);
      setList(firebaseItems);
    });
    const categoriesQuery = query(collection(db, pathFirebase.categories));
    //@ts-ignore for categoriesListener
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
  }, [user]);

  function logoutFunction() {
    signOut(auth);
    setIsMenu(false);
    setLogin(true);
  }

  useEffect(() => {
    list ? setFilteredList(filterListByMonth(list, currentMonth)) : null;
  }, [list, currentMonth]);

  useEffect(() => {
    if (categoryList) {
      categoryList.forEach((category: Category) => {
        setCategoryFormatted((prevData) => ({
          ...prevData,
          [category.id]: {
            id: category.id,
            color: category.color,
            title: category.title,
            expense: category.expense,
          },
        }));
      });
    }
  }, [categoryList]);

  useEffect(() => {
    let incomeCount = 0;
    let expenseCount = 0;

    for (let i in filteredList) {
      if (categoryFormatted[filteredList[i].categoryId].expense) {
        expenseCount += filteredList[i].value;
      } else {
        incomeCount += filteredList[i].value;
      }
    }
    setIncome(incomeCount);
    setExpense(expenseCount);
  }, [filteredList]);

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
            isHome={isHome}
            categoriesList={categoryList}
            isSettings={isSettings}
            isCategorySettings={isCategorySettings}
            windowSize={windowSize}
            pathFirebase={pathFirebase}
            userId={user ? user?.uid : "fail"}
            handleRadioChecked={handleRadioChecked}
          />
        </div>
      )}
    </div>
  );
}

export default CategoryListPage;
