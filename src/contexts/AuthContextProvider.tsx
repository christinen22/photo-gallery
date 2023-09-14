/* eslint-disable @typescript-eslint/no-empty-function */

import { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebase.config";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
} from "firebase/auth";

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (
    user: User,
    displayName: string,
    photoURL: string
  ) => Promise<void>;
  updateEmail: (user: User, email: string) => Promise<void>;
  updatePassword: (user: User, newPassword: string) => Promise<void>;

  userEmail: string | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProps = {
  children: React.ReactNode;
};

const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const forgotPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateProfile = async (
    currentUser: User,
    displayName: string,
    photoURL: string
  ) => {
    if (currentUser) {
      return firebaseUpdateProfile(currentUser, { displayName, photoURL });
    }
  };

  const updateEmail = async (user: User, email: string) => {
    return firebaseUpdateEmail(user, email);
  };

  const updatePassword = async (user: User, newPassword: string) => {
    return firebaseUpdatePassword(user, newPassword);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // User is logged in
        setUserEmail(user.email);
      } else {
        // No user is logged in
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        signup,
        forgotPassword,
        updateProfile,
        updateEmail,
        updatePassword,
        userEmail,
      }}
    >
      <>{children}</>
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
