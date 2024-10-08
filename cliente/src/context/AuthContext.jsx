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
  sendPasswordResetEmail,
  updateProfile,
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
  const [user, setUser] = useState(null); // Cambiado a null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("usuario logueado: " + currentUser.email); // Usar currentUser
      } else {
        console.log("No hay usuario logueado");
        setUser(null); // Cambiado a null
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfile = async (displayName, photoURL) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL,
        });
        console.log("Perfil actualizado con éxito");
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
      }
    } else {
      console.log("No hay ningún usuario autenticado.");
    }
  };

  const register = async (email, password) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
    } catch (error) {
      console.error("Error al registrar:", error);
      throw error; // Lanzar error para manejo
    }
  };

  const logIn = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw new Error("Usuario no reconocido");
    }
  };

  const logInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error; // Lanzar error para manejo
    }
  };

  const logOut = async () => {
    try {
      const response = await signOut(auth);
      console.log(response);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error; // Lanzar error para manejo
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Correo de recuperación enviado exitosamente");
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      throw error;
    }
  };

  return (
    <authContext.Provider
      value={{
        register,
        logIn,
        loading,
        resetPassword,
        logInWithGoogle,
        logOut,
        updateUserProfile,
        user,
      }}
    >
      {!loading && children}
    </authContext.Provider>
  );
}
