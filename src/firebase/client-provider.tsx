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
    // Only initialize Firebase if the API key is present.
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_KEY) {
      try {
        const firebaseServices = initializeFirebase();
        setServices(firebaseServices);
      } catch (error) {
        console.error("Firebase initialization failed:", error);
      }
    }
  }, []);

  if (!services) {
    // Render children without Firebase context if services are not available.
    // This allows the rest of the app to function without crashing.
    return <>{children}</>;
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
