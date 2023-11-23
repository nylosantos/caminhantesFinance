import { FormLogin } from "./FormLogin";
import { FormRegister } from "./FormRegister";

type Props = {
  login: boolean;
  setLogin: (login: boolean) => void;
};

export function LoginPage({ login, setLogin }: Props) {
  return (
    <div className="flex flex-col gap-4 m-auto max-w-[1280px] items-center mb-14">
      {login ? <FormLogin /> : <FormRegister />}
      <p className="flex gap-1 text-sm text-gray-400">
        {login ? "Per creare un account" : "Hai già un account?"}
        <span
          className="dark:text-white text-gray-500 underline cursor-pointer"
          onClick={() => setLogin(login ? false : true)}
        >
          {login ? "clicca qui" : "Clicca qui"}
        </span>
      </p>
    </div>
  );
}
