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
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useFirebaseApp = () => {
  const context = useFirebase();
  if (!context) throw new Error('Firebase not initialized');
  return context.app;
}
export const useAuth = () => {
    const context = useFirebase();
    if (!context) throw new Error('Firebase not initialized');
    return context.auth;
};
export const useFirestore = () => {
    const context = useFirebase();
    if (!context) throw new Error('Firebase not initialized');
    return context.firestore;
};
