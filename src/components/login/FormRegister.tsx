import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { app } from "../../db/Firebase";
import { systemSignUpClosed } from "../../custom";
import { SubmitLoading } from "../SubmitLoading";
import { ButtonSignSubmit } from "./ButtonSignSubmit";
//@ts-ignore
import { ButtonSignInGoogle } from "./ButtonSignInGoogle";

// INITIALIZING FIRESTORE DB
const db = getFirestore(app);

type SignUpWithEmailAndPasswordProps = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function FormRegister() {
  // USER SIGNUP STATE
  const [userSignUp, setUserSignUp] = useState<SignUpWithEmailAndPasswordProps>(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  );

  // INITIALIZING FIREBASE AUTH
  const auth = getAuth();

  // SUBMITTING STATE
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SIGN UP WITH EMAIL AND PASSWORD
  const handleSignUpWithEmailAndPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSubmitting(true);
    const errors: string[] = [];
    // recupero il valore della email indicata nel form
    // @ts-ignore
    const userName = document.forms["register"].name.value;
    // @ts-ignore
    const userEmail = document.forms["register"].email.value;
    // @ts-ignore
    const userPassword = document.forms["register"].password.value;
    const userConfirmPassword =
      // @ts-ignore
      document.forms["register"].confirmPassword.value;

    // se non ho inserito nulla nel campo
    if (userName == "") {
      errors.push("Devi indicare un Nome");
    }
    // se non ho inserito nulla nel campo
    if (userPassword == "") {
      errors.push("Devi indicare un password");
    }
    // se non ho inserito nulla nel campo
    if (userPassword == "") {
      errors.push("Devi confermare la password");
    }
    if (userPassword !== userConfirmPassword) {
      errors.push("Passwords non sono uguale");
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
      setIsSubmitting(false);
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
      // @ts-ignore SIGN UP FUNCTION
      const result = await createUserWithEmailAndPassword(
        auth,
        userSignUp.email,
        userSignUp.password
      )
        .then(async (userCredential) => {
          const user = userCredential.user;
          await updateProfile(user, { displayName: userSignUp.name });
          // CHECKING IF USER EXISTS ON DATABASE
          const userRef = collection(db, "users");
          const q = query(userRef, where("id", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const promises: any = [];
          querySnapshot.forEach((doc) => {
            const promise = doc.data();
            promises.push(promise);
          });
          Promise.all(promises).then((results) => {
            // IF USER NOT EXISTS, CREATE
            if (!results.length) {
              // ADD USER FUNCTION
              const addUser = async () => {
                try {
                  await setDoc(doc(db, "users", user.uid), {
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    phone: null,
                    photo: null,
                    role: "user",
                    timestamp: serverTimestamp(),
                  });
                } catch (error) {
                  console.log("ESSE É O ERROR", error);
                  toast.error(`C'è stato un errore... 🤯`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    theme: "colored",
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    autoClose: 3000,
                  });
                }
              };
              addUser();
            }
          });
          setIsSubmitting(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (errorCode === "auth/weak-password") {
            toast.error(
              `Errore: la password deve contenere almeno 6 caratteri...`,
              {
                position: toast.POSITION.BOTTOM_RIGHT,
                theme: "colored",
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                autoClose: 3000,
              }
            );
            setIsSubmitting(false);
          } else {
            toast.error(`Erro: ${errorMessage}...`, {
              theme: "colored",
              position: toast.POSITION.BOTTOM_RIGHT,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              autoClose: 3000,
            });
            setIsSubmitting(false);
          }
        });
    }
  };

  return (
    <>
      {/* TOAST CONTAINER */}
      <ToastContainer limit={4} />

      <div className="flex flex-col w-96 p-8 gap-6 border border-transparent dark:border-gray-100/30 rounded-3xl bg-gray-700/20 dark:bg-transparent">
        {/* SUBMIT LOADING */}
        <SubmitLoading isSubmitting={isSubmitting} whatsGoingOn="logando" />

        {/* SIGN REGISTER TITLE */}
        <h1 className="font-bold text-xl text-center">Creare un account</h1>

        {/* FORM */}
        <form
          name="register"
          onSubmit={handleSignUpWithEmailAndPassword}
          className="flex flex-col w-full gap-8 justify-evenly"
        >
          <div className="flex flex-col items-start">
            {/* NAME */}
            <input
              type="text"
              name="name"
              disabled={systemSignUpClosed ? true : isSubmitting}
              placeholder="Nome"
              className="w-full px-4 pb-2 dark:bg-red-950 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
              value={userSignUp.name}
              onChange={(e) => {
                setUserSignUp({ ...userSignUp, name: e.target.value });
              }}
            />
          </div>

          {/* E-MAIL */}
          <input
            type="text"
            name="email"
            disabled={systemSignUpClosed ? true : isSubmitting}
            placeholder="E-mail"
            className="w-full px-4 pb-2 dark:bg-red-950 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
            value={userSignUp.email}
            onChange={(e) => {
              setUserSignUp({ ...userSignUp, email: e.target.value });
            }}
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            disabled={systemSignUpClosed ? true : isSubmitting}
            placeholder="Password"
            className="w-full px-4 pb-2 dark:bg-red-950 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
            value={userSignUp.password}
            onChange={(e) => {
              setUserSignUp({ ...userSignUp, password: e.target.value });
            }}
          />

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            name="confirmPassword"
            disabled={systemSignUpClosed ? true : isSubmitting}
            placeholder="Conferma la password"
            className="w-full px-4 pb-2 dark:bg-red-950 border border-transparent dark:border-transparent dark:text-gray-100 rounded-3xl cursor-default placeholder:text-sm disabled:opacity-70"
            value={userSignUp.confirmPassword}
            onChange={(e) => {
              setUserSignUp({ ...userSignUp, confirmPassword: e.target.value });
            }}
          />

          {/* SUBMIT BUTTON */}
          <ButtonSignSubmit
            isSubmitting={isSubmitting}
            isClosed={systemSignUpClosed}
            signType="signUp"
          />
        </form>

        {/* SIGN UP WITH GOOGLE BUTTON */}
        {/* <ButtonSignInGoogle
          isSubmitting={isSubmitting}
          isClosed={systemSignUpClosed}
          signType="signUp"
        /> */}
      </div>
    </>
  );
}
