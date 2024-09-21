import { auth } from "../firebase/firebase.config";
import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    console.log("Error al crear el contexto");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  useEffect(() => {
    const mensaje = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        console.log("No hay usuario logueado");
        setUser("");
      } else {
        setUser(currentUser);
      }
    });
    return mensaje;
  }, []);

  const register = async (email, password) => {
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(response);
  };

  const logIn = async (email, password) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    console.log(response);
  };

  const logInWithGoogle = async () => {
    const responseGoogle = new GoogleAuthProvider();
    return await signInWithPopup(auth, responseGoogle);
  };

  const logOut = async () => {
    const response = await signOut(auth);
    console.log(response);
  };

  return (
    <authContext.Provider
      value={{ register, logIn, logInWithGoogle, logOut, user }}
    >
      {children}
    </authContext.Provider>
  );
}
