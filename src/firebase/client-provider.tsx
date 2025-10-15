'use client';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, setServices] = useState<{
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const firebaseServices = initializeFirebase();
      setServices(firebaseServices);
    }
  }, []);

  if (!services) {
    return null; // Or a loading spinner
  }

  return (
    <FirebaseProvider
      app={services.app}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
