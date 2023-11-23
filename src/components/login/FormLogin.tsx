import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import { systemSignInClosed } from "../../custom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ButtonSignSubmit } from "./ButtonSignSubmit";
//@ts-ignore
import { ButtonSignInGoogle } from "./ButtonSignInGoogle";
import { SubmitLoading } from "../SubmitLoading";

type LoginWithEmailAndPasswordProps = {
  email: string;
  password: string;
};

export function FormLogin() {
  // USER LOGIN STATE
  const [userLogin, setUserLogin] = useState<LoginWithEmailAndPasswordProps>({
    email: "",
    password: "",
  });

  // INITIALIZING FIREBASE AUTH
  const auth = getAuth();

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFields = () => {
    setUserLogin({
      email: "",
      password: "",
    });
  };

  // SIGN IN WITH EMAIL AND PASSWORD
  async function handleSignInWithEmailAndPassword(event: FormEvent) {
    event.preventDefault();
    const errors: string[] = [];
    // recupero il valore della email indicata nel form
    // @ts-ignore
    const userEmail = document.forms["login"].email.value;
    // @ts-ignore
    const userPassword = document.forms["login"].password.value;

    // se non ho inserito nulla nel campo
    if (userPassword == "") {
      errors.push("Devi indicare un password");
    }
    if (userEmail == "") {
      errors.push("Devi indicare un indirizzo email");
    }
    // verifico se è un indirizzo valido
    // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)) {
    //   errors.push("L'indirizzo email che hai inserito e' valido");
    // } else {
    //   errors.push("L'indirizzo email che hai inserito non e' valido");
    // }
    // VALIDATE E-MAIL TEST
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)) {
      errors.push("L'indirizzo email che hai inserito non e' valido");
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
      setIsSubmitting(true);
      await signInWithEmailAndPassword(auth, userEmail, userPassword)
        .then(async (userCredential) => {
          clearFields();
          setIsSubmitting(false);
          // @ts-ignore Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          setIsSubmitting(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/user-not-found") {
            toast.error(`Nome utente e/o password errati o mancanti...`, {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
          } else if (errorCode === "auth/wrong-password") {
            toast.error(`Nome utente e/o password errati o mancanti...`, {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
          } else {
            toast.error(errorMessage, {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: "colored",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
          }
        });
    }
  }

  return (
    <>
      {/* TOAST CONTAINER */}
      <ToastContainer limit={2} />

      <div className="flex flex-col w-96 p-8 gap-6 border border-transparent dark:border-gray-100/30 rounded-3xl bg-klOrange-500/80 dark:bg-transparent">
        {/* SUBMIT LOADING */}
        <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="entrando" />

        {/* SIGN LOGIN TITLE */}
        <h1 className="font-bold text-xl text-center">Login</h1>

        {/* FORM */}
        <form
          name="login"
          onSubmit={handleSignInWithEmailAndPassword}
          className="flex flex-col w-full gap-8 justify-evenly"
        >
          {/* E-MAIL */}
          <input
            type="text"
            name="email"
            disabled={systemSignInClosed ? true : isSubmitting}
            placeholder="E-mail"
            className="w-full px-4 py-2 dark:bg-red-950 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm"
            value={userLogin.email}
            onChange={(e) => {
              setUserLogin({ ...userLogin, email: e.target.value });
            }}
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            disabled={systemSignInClosed ? true : isSubmitting}
            placeholder="Password"
            className="w-full px-4 py-2 dark:bg-red-950 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm"
            value={userLogin.password}
            onChange={(e) => {
              setUserLogin({ ...userLogin, password: e.target.value });
            }}
          />

          {/* SUBMIT BUTTON */}
          <ButtonSignSubmit
            isSubmitting={isSubmitting}
            signType="signIn"
            isClosed={systemSignInClosed}
          />
        </form>

        {/* SIGN IN WITH GOOGLE BUTTON */}
        {/* <ButtonSignInGoogle
          isSubmitting={isSubmitting}
          signType="signIn"
          isClosed={systemSignInClosed}
        /> */}
      </div>
    </>
  );
}
