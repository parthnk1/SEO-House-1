
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { doc, getDoc, runTransaction, serverTimestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function TrackPage() {
  const { linkId } = useParams();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    const trackClick = async () => {
      if (!firestore || typeof linkId !== 'string') return;

      try {
        // This is a workaround to find the link without knowing the user ID.
        // It's inefficient and not scalable.
        // A better schema would be a root `trackedLinks` collection with the linkId as the document ID.
        const usersCollectionRef = collection(firestore, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);
        let linkRef = null;
        let linkOwnerId = null;

        for (const userDoc of usersSnapshot.docs) {
          const trackedLinksRef = collection(userDoc.ref, "trackedLinks");
          const q = query(trackedLinksRef, where("__name__", "==", linkId), limit(1));
          const linkSnapshot = await getDocs(q);

          if (!linkSnapshot.empty) {
            linkRef = linkSnapshot.docs[0].ref;
            linkOwnerId = userDoc.id;
            break;
          }
        }
        
        // The above loop is a hack.
        // Let's assume a root collection `trackedLinks` for the fix.
        const newLinkRef = doc(firestore, "trackedLinks", linkId);

        let destinationUrl = null;

        await runTransaction(firestore, async (transaction) => {
            const linkDoc = await transaction.get(newLinkRef);
            if (!linkDoc.exists()) {
                throw new Error("Link not found");
            }
            const data = linkDoc.data();
            destinationUrl = data.url;
            const newClicks = (data.clicks || 0) + 1;
            transaction.update(newLinkRef, { clicks: newClicks });
        });

        if (destinationUrl) {
            router.replace(destinationUrl);
        } else {
            console.error("Link not found or has no URL.");
            router.replace('/404');
        }

      } catch (error) {
        console.error("Error tracking click:", error);
        // Redirect to a 404 or an error page
        router.replace('/404');
      }
    };

    trackClick();
  }, [linkId, firestore, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Redirecting...</p>
    </div>
  );
}
