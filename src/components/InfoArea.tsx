import { formatCurrentMonth } from "../helpers/dateFilter";
import { ResumeItem } from "./ResumeItem";

type Props = {
  currentMonth: string;
  onMonthChange: (newMonth: string) => void;
  isHomeFunction: () => void;
  income: number;
  expense: number;
  isSettings: boolean;
  isCategorySettings: boolean;
};

export function InfoArea({
  currentMonth,
  onMonthChange,
  income,
  expense,
  isSettings,
  isCategorySettings,
  isHomeFunction,
}: Props) {
  function handlePreviousMonth() {
    let [year, month] = currentMonth.split("-");
    let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    currentDate.setMonth(currentDate.getMonth() - 1);
    onMonthChange(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
  }
  function handleNextMonth() {
    let [year, month] = currentMonth.split("-");
    let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    currentDate.setMonth(currentDate.getMonth() + 1);
    onMonthChange(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
  }
  return (
    <div className="menuBreak:flex items-center w-full -mt-10 p-4 px-5 shadow-2xl rounded-xl bg-red-950">
      {isSettings ? (
        <div className="flex items-center w-full">
          <div className="basis-3/6 w-full flex items-center">
            <p className="font-bold cursor-pointer text-sm menuBreak:text-base" onClick={isHomeFunction}>
              ⬅️ Inizio
            </p>
          </div>
          <div className="basis-4/6 flex w-full">
            <h1 className="font-assistant font-bold text-xl menuBreak:text-2xl m-0 py-3">
              Impostazioni
            </h1>
          </div>
        </div>
      ) : isCategorySettings ? (
        <div className="flex items-center w-full">
          <div className="basis-6/12 w-full flex items-center">
            <p className="font-bold cursor-pointer text-sm menuBreak:text-base" onClick={isHomeFunction}>
              ⬅️ Inizio
            </p>
          </div>
          <div className="basis-9/12 flex w-full">
            <h1 className="font-assistant font-bold text-xl menuBreak:text-2xl m-0 py-3">
              Impostazioni Categorie
            </h1>
          </div>
        </div>
      ) : (
        <>
          {/* MONTH AREA */}
          <div className="basis-1/3 w-full flex items-center pb-6 menuBreak:pb-0">
            <div
              className="w-10 text-center text-2xl cursor-pointer"
              onClick={handlePreviousMonth}
            >
              ⬅️
            </div>
            <div className="flex-1 text-center">
              {formatCurrentMonth(currentMonth)}
            </div>
            <div
              className="w-10 text-center text-2xl cursor-pointer"
              onClick={handleNextMonth}
            >
              ➡️
            </div>
          </div>
          {/* RESUME AREA */}
          <div className="basis-2/2 flex w-full">
            <ResumeItem title={"Receitas"} value={income} />
            <ResumeItem title={"Despesas"} value={expense} />
            <ResumeItem
              title={"Balanço"}
              value={parseFloat((income - expense).toFixed(2))}
            />
          </div>
        </>
      )}
    </div>
  );
}
