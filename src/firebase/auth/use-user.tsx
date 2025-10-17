
'use client';
import {
    type User,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
  } from 'firebase/auth';
  import { useEffect, useState } from 'react';
  import { useAuth } from '@/firebase';
  
  export const useUser = () => {
    const auth = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const firebaseAvailable = !!auth;
  
    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    }, [auth]);
  
    const login = async () => {
        if (!auth) {
            console.error('Firebase Auth is not available.');
            return;
        }
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error('Error signing in with Google', error);
      }
    };
  
    return { user, loading, firebaseAvailable, login };
  };
  
