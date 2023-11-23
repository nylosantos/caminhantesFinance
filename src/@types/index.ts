// ITEM DESCRIPTION
export type Item = {
  id: string;
  date: Date;
  categoryId: string;
  categoryName: string;
  title: string;
  value: number;
};

// CATEGORIES DESCRIPTION
export type CategoryFormatted = {
  [tag: string]: {
    title: string;
    color: string;
    expense: Boolean;
  };
};

// CATEGORIES DESCRIPTION
export type Category = {
  id: string;
  color: string;
  title: string;
  expense: Boolean;
};

export type windowSizeProps = {
  innerWidth: number;
  innerHeight: number;
};

export type ButtonSignProps = {
  isSubmitting: boolean;
  signType: "signIn" | "signUp";
  isClosed?: boolean;
};

export type PathFirebaseProps = {
  items: string;
  categories: string;
};
