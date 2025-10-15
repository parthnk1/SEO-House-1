
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
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
      return () => unsubscribe();
    }, [auth]);
  
    const login = async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error('Error signing in with Google', error);
      }
    };
  
    return { user, login };
  };
  