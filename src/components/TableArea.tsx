import { useState } from "react";
import { Category, Item, PathFirebaseProps, windowSizeProps } from "../@types";
import { HandleRadioCheckValueFunction } from "../App";
import { TableItem } from "./TableItem";

type Props = {
  isCategorySettings: boolean;
  isSettings: boolean;
  isHome: boolean;
  list: Item[];
  allList?: Item[];
  currentMonth: string;
  income: number;
  categoriesList: Category[];
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

export function TableArea({
  list,
  allList,
  isHome,
  isSettings,
  isCategorySettings,
  categoriesList,
  windowSize,
  pathFirebase,
  userId,
  currentMonth,
  categoryListDetails,
  handleRadioChecked,
  handleCategoryItemsList,
}: Props) {
  const [isSpesa, setIsSpesa] = useState(true);
  return (
    <>
      {isCategorySettings ? (
        <table className="w-full shadow-2xl rounded-xl bg-red-950 border-collapse">
          <thead>
            <tr className="flex w-full px-5 p-3 items-center">
              <th className="flex w-2/3 py-3 menuBreak:px-2 text-left">
                Nome della Categoria
              </th>
              <th className="flex w-3/6 py-3 menuBreak:px-2 justify-center">
                Reddito o Spese?
              </th>
              <th className="flex w-1/6 py-3 menuBreak:px-2 justify-end">🗑️</th>
            </tr>
          </thead>
          <tbody className="[&>*:nth-child(odd)]:bg-red-900/20">
            <>
              {categoriesList.map((category, index) => (
                <TableItem
                  key={index}
                  isHome
                  isSpesa={isSpesa}
                  allList={allList}
                  category={category}
                  currentMonth={currentMonth}
                  isSettings={isSettings}
                  isCategorySettings={isCategorySettings}
                  windowSize={windowSize}
                  pathFirebase={pathFirebase}
                  userId={userId}
                  categoryListDetails={categoryListDetails}
                  handleRadioChecked={handleRadioChecked}
                  handleCategoryItemsList={handleCategoryItemsList}
                />
              ))}
            </>
          </tbody>
        </table>
      ) : isSettings ? (
        <table className="w-full shadow-2xl rounded-xl bg-red-950 border-collapse">
          <thead>
            <tr className="flex w-full px-10 p-3">
              <th className="flex w-full py-3 px-2 font-thin justify-center">
                Altre impostazioni in arrivo
              </th>
            </tr>
          </thead>
          {/* ADD HERE FUTURE SETTINGS */}
          {/* <tbody className="[&>*:nth-child(odd)]:bg-red-950/60">
            <>
              {list.map((item, index) => (
                <TableItem key={index} item={item} />
              ))}
            </>
          </tbody> */}
        </table>
      ) : isHome ? (
        <>
          {/* Switch Reddito / Spesa */}
          <div className="flex w-full items-center justify-center gap-9">
            <p>Reddito</p>
            <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
              <input
                id="switch-component"
                type="checkbox"
                className="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-gray-900 border-gray-900 before:bg-gray-900"
                defaultChecked
                onChange={() => setIsSpesa(!isSpesa)}
              />
              <label
                htmlFor="switch-component"
                className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-gray-900 peer-checked:before:bg-gray-900"
              >
                <div
                  className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4"
                  data-ripple-dark="true"
                ></div>
              </label>
            </div>
            <p>Spesa</p>
          </div>
          <table className="w-full shadow-2xl rounded-xl bg-red-950 border-collapse">
            {/* Cabeçalho Tabela */}
            <thead>
              <tr className="flex w-full px-5 p-3 justify-between items-center">
                <th className="hidden w-4/12 menuBreak:flex py-3 px-0 menuBreak:px-2 text-left">
                  Categoria
                </th>
                <th className="flex w-3/12 py-3 px-0 menuBreak:px-2 justify-end">
                  {isSpesa ? "Valore Atteso" : "Totale"}
                </th>
                {isSpesa ? (
                  <th className="flex w-3/12 py-3 px-0 menuBreak:px-2 justify-end">
                    Valore Speso
                  </th>
                ) : null}
              </tr>
            </thead>
            {/* Tabela */}
            <tbody className="[&>*:nth-child(odd)]:bg-red-950/60">
              <>
                {categoriesList.map((item, index) =>
                  isSpesa ? (
                    item.expense ? (
                      <TableItem
                        key={index}
                        isHome
                        isSpesa={isSpesa}
                        category={item}
                        allList={allList}
                        currentMonth={currentMonth}
                        isSettings={isSettings}
                        isCategorySettings={isCategorySettings}
                        windowSize={windowSize}
                        pathFirebase={pathFirebase}
                        userId={userId}
                        categoryListDetails={categoryListDetails}
                        handleRadioChecked={handleRadioChecked}
                        handleCategoryItemsList={handleCategoryItemsList}
                      />
                    ) : null
                  ) : !item.expense ? (
                    <TableItem
                      key={index}
                      isHome
                      isSpesa={isSpesa}
                      category={item}
                      allList={allList}
                      currentMonth={currentMonth}
                      isSettings={isSettings}
                      isCategorySettings={isCategorySettings}
                      windowSize={windowSize}
                      pathFirebase={pathFirebase}
                      userId={userId}
                      categoryListDetails={categoryListDetails}
                      handleRadioChecked={handleRadioChecked}
                      handleCategoryItemsList={handleCategoryItemsList}
                    />
                  ) : null
                )}
              </>
            </tbody>
          </table>
        </>
      ) : (
        <table className="w-full shadow-2xl rounded-xl bg-red-950 border-collapse">
          <thead>
            <tr className="flex w-full px-5 p-3 justify-between items-center">
              <th className="flex w-2/12 py-3 px-0 menuBreak:px-2 text-left">
                Data
              </th>
              <th className="hidden menuBreak:flex w-2/12 py-3 px-0 menuBreak:px-2 text-left">
                Categoria
              </th>
              <th className="flex w-3/12 menuBreak:w-4/12 py-3 px-0 menuBreak:px-2 text-left">
                Titolo
              </th>
              <th className="flex w-3/12 py-3 px-0 menuBreak:px-2 justify-end">
                Valore
              </th>
              <th className="flex w-1/12 py-3 px-0 menuBreak:px-2">
                <div className="w-full text-right text-lg">🗑️</div>
              </th>
            </tr>
          </thead>
          <tbody className="[&>*:nth-child(odd)]:bg-red-950/60">
            <>
              {list.map((item, index) => (
                <TableItem
                  key={index}
                  allList={allList}
                  isHome={false}
                  isSpesa={isSpesa}
                  item={item}
                  currentMonth={currentMonth}
                  isSettings={isSettings}
                  isCategorySettings={isCategorySettings}
                  windowSize={windowSize}
                  pathFirebase={pathFirebase}
                  userId={userId}
                  categoryListDetails={categoryListDetails}
                  handleRadioChecked={handleRadioChecked}
                  handleCategoryItemsList={handleCategoryItemsList}
                />
              ))}
            </>
          </tbody>
        </table>
      )}
    </>
  );
}
