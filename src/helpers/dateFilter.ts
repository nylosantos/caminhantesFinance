import { Category, Item } from "../@types";

// GET CURRENT MONTH
export function getCurrentMonth() {
  let now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

// FILTER ITEMS FROM CURRENT MONTH
export function filterListByMonth(list: Item[], date: string): Item[] {
  let newList: Item[] = [];
  let [year, month] = date.split("-");

  for (let i in list) {
    if (
      list[i].date.getFullYear() === parseInt(year) &&
      list[i].date.getMonth() + 1 === parseInt(month)
    ) {
      newList.push(list[i]);
    }
  }

  return newList;
}

// FILTER ITEMS FROM CURRENT MONTH AND CATEGORY
export function filterListByMonthAndCategory(list: Item[], date: string, categoryListDetails: Category): Item[] {
  let newList: Item[] = [];
  let [year, month] = date.split("-");

  for (let i in list) {
    if (
      list[i].date.getFullYear() === parseInt(year) &&
      list[i].date.getMonth() + 1 === parseInt(month) &&
      list[i].categoryId === categoryListDetails.id
    ) {
      newList.push(list[i]);
    }
  }

  return newList;
}

// FORMAT DATE
export function formatDate(date: Date): string {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  return `${addZeroToDate(day)}/${addZeroToDate(month)}/${year}`;
}

// ADD ZERO TO <10 NUMBERS
export function addZeroToDate(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// FORMAT CURRENT MONTH
export function formatCurrentMonth(currentMonth: string): string {
  let [year, month] = currentMonth.split("-");
  let months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];
  return `${months[parseInt(month) - 1]} / ${year}`;
}

export function newDateAdjusted(dateField: string) {
  let [year, month, day] = dateField.split("-");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function firebaseDateAdjusted(dateField: string) {
  let [day, month, year] = dateField.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}