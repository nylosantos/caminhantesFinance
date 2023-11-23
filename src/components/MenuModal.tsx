type Props = {
  isMenu: boolean;
  isHomeFunction: () => void;
  isSettingsFunction: () => void;
  isCategorySettingsFunction: () => void;
  logoutFunction: () => void;
};

export function MenuModal({
  isMenu,
  isSettingsFunction,
  isCategorySettingsFunction,
  isHomeFunction,
  logoutFunction,
}: Props) {
  const classMenu = isMenu
    ? `flex flex-col h-screen fixed w-96 right-0 top-0 bg-red-950 transition-all duration-300 z-30`
    : `flex flex-col h-screen fixed w-96 right-0 -mr-[1024px] top-0 bg-red-950 transition-all duration-300 z-50`;
  return (
    <div className={classMenu}>
      <div className="flex flex-col mt-20 pr-20 pl-10 items-end justify-items-center gap-8">
        <p className="font-bold cursor-pointer" onClick={isHomeFunction}>
          Inizio 🏠
        </p>
        <p
          className="font-bold cursor-pointer"
          onClick={isCategorySettingsFunction}
        >
          Categorie 📑
        </p>
        <p className="font-bold cursor-pointer" onClick={isSettingsFunction}>
          Impostazioni ⚙️
        </p>
        <p className="font-bold cursor-pointer" onClick={logoutFunction}>
          Uscire 🔜
        </p>
        <hr className="w-full mt-20 border-spacing-0.5 border-gray-100/50" />
        <p className="text-sm">
          © 2023. Persan INC | Tutti i diritti riservati.
        </p>
      </div>
    </div>
  );
}
