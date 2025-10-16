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
    // This check is important to ensure Firebase only initializes on the client side.
    if (typeof window !== 'undefined') {
      try {
        const firebaseServices = initializeFirebase();
        setServices(firebaseServices);
      } catch (error) {
        console.error("Firebase initialization failed:", error);
        // We can choose to not set services, letting the app gracefully degrade.
      }
    }
  }, []);

  if (!services) {
    // Render children without Firebase context while services are loading or if initialization fails.
    // This prevents a crash and allows non-Firebase parts of the app to render.
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
