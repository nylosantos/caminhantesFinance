type HeaderProps = {
  isMenu: boolean;
  logged: boolean;
  isMenuFunction: () => void;
  username: string;
};

export function Header({
  isMenu,
  logged,
  isMenuFunction,
  username,
}: HeaderProps) {
  return (
    <div className="flex flex-col w-full bg-red-900 h-40 menuBreak:h-40">
      {logged ? (
        <div className="absolute flex w-full justify-between px-20 z-50">
          <div
            className={
              isMenu
                ? "left-0 py-3 justify-end font-bold text-white z-20 opacity-0 menuBreak:opacity-100 transition-all"
                : "left-0 py-3 justify-end font-bold text-white z-20"
            }
          >
            <p>Ciao, {username}!</p>
          </div>
          <div className="right-0 py-3 justify-end font-bold text-white z-50">
            {isMenu ? (
              <p className="cursor-pointer" onClick={isMenuFunction}>
                Close ❌
              </p>
            ) : (
              <p className="cursor-pointer" onClick={isMenuFunction}>
                Menu 🧮
              </p>
            )}
          </div>
        </div>
      ) : null}
      <div className="flex w-full justify-center">
        <h1 className="font-assistant font-bold text-4xl menuBreak:text-5xl m-0 p-0 menuBreak:-mt-3 pt-12">
          Persan Finance
        </h1>
      </div>
    </div>
  );
}
