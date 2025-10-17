'use client';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { createContext, useContext } from 'react';

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | null;

const FirebaseContext = createContext<FirebaseContextValue>(null);

export function FirebaseProvider({
  children,
  ...services
}: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | {
  children: React.ReactNode;
  app: null;
  auth: null;
  firestore: null;
}) {
  const value = services.app ? services : null;
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const useFirebaseApp = () => {
  return useFirebase()?.app ?? null;
}
export const useAuth = () => {
    return useFirebase()?.auth ?? null;
};
export const useFirestore = () => {
    return useFirebase()?.firestore ?? null;
};
