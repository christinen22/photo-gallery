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
  reloadUser: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  setEmail: (email: string) => Promise<void>;
  setDisplayName: (displayName: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  setPhotoUrl: (photoURL: string) => Promise<void>;
  userEmail: string | null;
  userName: string | null;
  userPhotoUrl: string | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProps = {
  children: React.ReactNode;
};

const AuthContextProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const reloadUser = async () => {
    if (!auth.currentUser) {
      return false;
    }
    setUserName(auth.currentUser.displayName);
    setUserEmail(auth.currentUser.email);
    setUserPhotoUrl(auth.currentUser.photoURL);

    return true;
  };

  const forgotPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const setEmail = (email: string) => {
    if (!currentUser) {
      throw new Error("Current User is null!");
    }
    return firebaseUpdateEmail(currentUser, email);
  };

  const setPassword = (password: string) => {
    if (!currentUser) {
      throw new Error("Current User is null!");
    }
    return firebaseUpdatePassword(currentUser, password);
  };

  const setDisplayName = (displayName: string) => {
    if (!currentUser) {
      throw new Error("Current User is null!");
    }
    return firebaseUpdateProfile(currentUser, { displayName });
  };

  const setPhotoUrl = (photoURL: string) => {
    if (!currentUser) {
      throw new Error("Current User is null!");
    }
    return firebaseUpdateProfile(currentUser, { photoURL });
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
        reloadUser,
        signup,
        forgotPassword,
        setDisplayName,
        setEmail,
        setPassword,
        setPhotoUrl,
        userEmail,
        userName,
        userPhotoUrl,
      }}
    >
      <>{children}</>
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
