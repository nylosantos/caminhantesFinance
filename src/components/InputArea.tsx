import { useEffect, useState } from "react";
import { Category, Item, PathFirebaseProps } from "../@types";
import { newDateAdjusted } from "../helpers/dateFilter";
import { v4 as uuidv4 } from "uuid";
import CurrencyInput from "react-currency-input-field";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { app } from "../db/Firebase";
import { getFirebaseDataFilterById } from "../helpers/firebaseFunctions";
import { toast } from "react-toastify";
import { HandleRadioCheckValueFunction } from "../App";

type Props = {
  isCategorySettingsFunction: () => void;
  onAddItem: (item: Item) => void;
  onAddCategory: (category: Category) => void;
  handleRadioChecked: ({
    redditoValue,
    spesaValue,
  }: HandleRadioCheckValueFunction) => void;
  radioChecked: { reddito: boolean; spesa: boolean };
  isSettings: boolean;
  categoryList?: Category[];
  isCategorySettings: boolean;
  pathFirebase: PathFirebaseProps;
};

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

export function InputArea({
  onAddItem,
  onAddCategory,
  isCategorySettingsFunction,
  categoryList,
  isCategorySettings,
  isSettings,
  pathFirebase,
  radioChecked,
  handleRadioChecked,
}: Props) {
  const [dateField, setDateField] = useState("");
  const [categoryField, setCategoryField] = useState("");
  const [categoryNameField, setCategoryNameField] = useState("");
  const [titleField, setTitleField] = useState("");
  const [valueField, setValueField] = useState(0);
  const [provisoryValueField, setProvisoryValueField] = useState("0");
  const [provisoryCategoryValueField, setProvisoryCategoryValueField] = useState("0");
  const [newCategory, setNewCategory] = useState<Category>({
    id: "",
    title: "",
    color: "",
    expense: false,
    valueExpected: 0,
  });
  useEffect(() => {
    if (categoryField !== "") {
      async function handleDetailsData() {
        const queryCategoryById = query(
          collection(db, pathFirebase.categories),
          where("id", "==", categoryField)
        );
        const categoryDetails: Category[] = await getFirebaseDataFilterById(
          queryCategoryById
        );
        setCategoryNameField(categoryDetails[0].title);
      }
      handleDetailsData();
    } else {
      setCategoryNameField("");
    }
  }, [categoryField]);

  // let categoryKeys: string[] = Object.keys(categories);
  
  const handleAddItem = () => {
    let errors: string[] = [];

    if (isNaN(new Date(dateField).getTime())) {
      errors.push("Data non valida!");
    }
    if (categoryField === "") {
      errors.push("Categoria non valida!");
    }
    if (categoryNameField === "") {
      errors.push("Categoria non valida!");
    }
    if (titleField === "") {
      errors.push("Titolo vuoto!");
    }
    if (valueField <= 0) {
      errors.push("Valore non valido!");
    }

    if (errors.length > 0) {
      errors.map((fieldError) => {
        toast.error(fieldError, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
      });
    } else {
      onAddItem({
        id: uuidv4(),
        date: newDateAdjusted(dateField),
        categoryId: categoryField,
        categoryName: categoryNameField,
        title: titleField,
        value: valueField,
      });
      clearFields();
    }
  };

  const handleAddCategory = () => {
    let errors: string[] = [];

    if (newCategory.title === "") {
      errors.push("Titolo vuoto!");
    }
    if (newCategory.color === "") {
      errors.push("Sceglere Reddito o Spesa!");
    }
    if (newCategory.expense && newCategory.valueExpected === 0) {
      errors.push("Sceglere il valore atteso!");
    }
    if (errors.length > 0) {
      errors.map((fieldError) => {
        toast.error(fieldError, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "colored",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 3000,
        });
      });
    } else {
      onAddCategory({
        id: uuidv4(),
        title: newCategory.title,
        color: newCategory.color,
        expense: newCategory.expense,
        valueExpected: newCategory.valueExpected,
      });
      clearFields();
    }
  };

  const clearFields = () => {
    setDateField("");
    setCategoryField("");
    setTitleField("");
    setProvisoryValueField("");
    setValueField(0);
    setNewCategory({
      id: "",
      title: "",
      color: "",
      expense: false,
      valueExpected: 0
    });
    handleRadioChecked({ redditoValue: false, spesaValue: false });
  };

  useEffect(() => {
    clearFields();
  }, [isCategorySettings, isSettings]);

  if (isCategorySettings) {
    return (
      <div className="menuBreak:flex items-center mt-5 p-5 shadow-2xl rounded-xl bg-red-950">
        <div className="basis-2/2 flex w-full items-center">
          <div className="flex-1 m-3">
            <div className="font-bold mb-1">Titolo</div>
            <input
              className="w-full h-7 py-0 px-1 bg-[#242424] rounded"
              type="text"
              value={newCategory.title}
              onChange={(e) =>
                setNewCategory({ ...newCategory, title: e.target.value })
              }
            />
          </div>
          <div className="flex-1 m-3">
            <div className="font-bold mb-1">Valore Atteso</div>
            <CurrencyInput
              className="w-full h-7 py-0 px-1 rounded bg-[#242424]"
              id="input-example"
              name="input-name"
              placeholder="Immettere un valore"
              value={provisoryCategoryValueField}
              decimalsLimit={2}
              decimalScale={2}
              allowDecimals
              decimalSeparator=","
              intlConfig={{ locale: "ita", currency: "EUR" }}
              onValueChange={(value) => {
                if (value) {
                  {
                    setProvisoryCategoryValueField(value);
                    setNewCategory({ ...newCategory, valueExpected: parseFloat(value.replace(",", ".")) });
                  }
                }
              }}
            />
          </div>
          <div className="flex-1 m-3">
            <div className="font-bold mb-1">Reddito o Spesa?</div>
            <div className="flex gap-5 items-center">
              <div className="flex gap-1 items-center">
                <input
                  type="radio"
                  id="Reddito"
                  name="categoryType"
                  value="Reddito"
                  checked={radioChecked.reddito}
                  onClick={() => {
                    handleRadioChecked({
                      redditoValue: true,
                      spesaValue: false,
                    });
                    setNewCategory({
                      ...newCategory,
                      expense: false,
                      color: "green",
                    });
                  }}
                />
                <label htmlFor="Reddito">Reddito</label>
              </div>
              <div className="flex gap-1 items-center">
                <input
                  type="radio"
                  id="Spesa"
                  name="categoryType"
                  value="Spesa"
                  checked={radioChecked.spesa}
                  onClick={() => {
                    handleRadioChecked({
                      redditoValue: false,
                      spesaValue: true,
                    });
                    setNewCategory({
                      ...newCategory,
                      expense: true,
                      color: "red",
                    });
                  }}
                />
                <label htmlFor="Spesa">Spesa</label>
              </div>
            </div>
          </div>

        </div>
        <div className="basis-4/12 m-3">
          <div className="font-bold mb-1">&nbsp;</div>
          <button
            className="w-full h-7 py-0 px-1 font-assistant rounded bg-red-700 hover:bg-red-800"
            onClick={handleAddCategory}
          >
            Aggiungere Categoria
          </button>
        </div>
      </div>
    );
  } else if (isSettings) {
    return null;
  } else {
    return (
      <div className="menuBreak:flex items-center mt-5 p-5 shadow-2xl rounded-xl bg-red-950">
        <div className="basis-2/2 flex w-full items-center">
          <div className="flex-1 m-3">
            <div className="font-bold mb-1">Data</div>
            <input
              className="w-full h-7 py-0 px-1 bg-[#242424] rounded"
              type="date"
              value={dateField}
              onChange={(e) => setDateField(e.target.value)}
            />
          </div>
          <div className="flex-1 m-3">
            <div className="flex items-center font-bold mb-1">
              Categoria{" "}
              <div className="w-10 text-center text-lg">
                <span data-tooltip="Clique para criar uma nova categoria">
                  <span
                    className="text-lg cursor-pointer"
                    onClick={isCategorySettingsFunction}
                  >
                    ❓
                  </span>
                </span>
              </div>
            </div>
            <select
              className="w-full h-7 py-0 px-1 bg-[#242424] rounded"
              value={categoryField}
              onChange={(e) => setCategoryField(e.target.value)}
            >
              <>
                <option></option>
                {categoryList
                  ? categoryList.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))
                  : null}
              </>
            </select>
          </div>
        </div>
        <div className="basis-2/2 flex w-full items-center">
          <div className="flex-1 m-3">
            <div className="font-bold mb-1">Titolo</div>
            <input
              className="w-full h-7 py-0 px-1 bg-[#242424] rounded"
              type="text"
              value={titleField}
              onChange={(e) => setTitleField(e.target.value)}
            />
          </div>
          <div className="flex-1 m-3">
            <div className="font-bold mb-1">Valore</div>
            <CurrencyInput
              className="w-full h-7 py-0 px-1 rounded bg-[#242424]"
              id="input-example"
              name="input-name"
              placeholder="Please enter a number"
              value={provisoryValueField}
              decimalsLimit={2}
              decimalScale={2}
              allowDecimals
              decimalSeparator=","
              intlConfig={{ locale: "ita", currency: "EUR" }}
              onValueChange={(value) => {
                if (value) {
                  {
                    setProvisoryValueField(value);
                    setValueField(parseFloat(value.replace(",", ".")));
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="basis-4/12 m-3">
          <div className="font-bold mb-1">&nbsp;</div>
          <button
            className="w-full h-7 py-0 px-1 font-assistant rounded bg-red-700 hover:bg-red-800"
            onClick={handleAddItem}
          >
            Aggiungere
          </button>
        </div>
      </div>
    );
  }
}
