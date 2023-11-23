import { ButtonSignProps } from "../../@types";

export function ButtonSignSubmit({
  isSubmitting,
  isClosed = false,
  signType,
}: ButtonSignProps) {
  return (
    // SUBMIT BUTTON
    <button
      type="submit"
      disabled={isClosed ? true : isSubmitting}
      className="w-full px-4 py-2 mt-4 border rounded-3xl border-green-900/10 bg-red-900 disabled:bg-klgreen-700/70 disabled:dark:bg-slate-500/40 disabled:border-green-900/10 font-bold text-sm text-white disabled:dark:text-white/50 uppercase"
    >
      {isClosed
        ? signType === "signIn"
          ? // IF SYSTEM IS CLOSED TO LOGIN
            "Sistema attualmente non disponibile"
          : // IF SYSTEM IS CLOSED TO REGISTER
            "Iscrizioni momentaneamente chiuse"
        : !isSubmitting
        ? signType === "signIn"
          ? // IF SIGN IN
            "Accedi"
          : // IF SIGN UP
            "Creare un account"
        : signType === "signIn"
        ? // SUBMITTING SIGN IN
          "Connessione"
        : // SUBMITTING SIGN UP
          "Creando"}
    </button>
  );
}
