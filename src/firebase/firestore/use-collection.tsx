
'use client';
import type {
    CollectionReference,
    DocumentData,
    Query,
    QuerySnapshot,
  } from 'firebase/firestore';
  import { onSnapshot } from 'firebase/firestore';
  import { useEffect, useState } from 'react';
  
  export const useCollection = (
    query: CollectionReference | Query | null
  ): {
    data: QuerySnapshot<DocumentData> | null;
    loading: boolean;
  } => {
    const [data, setData] = useState<QuerySnapshot | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!query) {
        setLoading(false);
        return;
      }
  
      setLoading(true);
      const unsubscribe = onSnapshot(query, (snapshot) => {
        setData(snapshot);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching collection:', error);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, [query]);
  
    return { data, loading };
  };
  