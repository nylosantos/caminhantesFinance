import { Category, Item, PathFirebaseProps, windowSizeProps } from "../@types";
import { HandleRadioCheckValueFunction } from "../App";
import { TableItem } from "./TableItem";

type Props = {
  isCategorySettings: boolean;
  isSettings: boolean;
  list: Item[];
  categoriesList: Category[];
  windowSize: windowSizeProps;
  pathFirebase: PathFirebaseProps;
  userId: string;
  handleRadioChecked: ({
    redditoValue,
    spesaValue,
  }: HandleRadioCheckValueFunction) => void;
};

export function TableArea({
  list,
  isSettings,
  isCategorySettings,
  categoriesList,
  windowSize,
  pathFirebase,
  userId,
  handleRadioChecked,
}: Props) {
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
                  category={category}
                  isSettings={isSettings}
                  isCategorySettings={isCategorySettings}
                  windowSize={windowSize}
                  pathFirebase={pathFirebase}
                  userId={userId}
                  handleRadioChecked={handleRadioChecked}
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
                  item={item}
                  isSettings={isSettings}
                  isCategorySettings={isCategorySettings}
                  windowSize={windowSize}
                  pathFirebase={pathFirebase}
                  userId={userId}
                  handleRadioChecked={handleRadioChecked}
                />
              ))}
            </>
          </tbody>
        </table>
      )}
    </>
  );
}
