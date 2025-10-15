'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function TrackPage() {
  const { linkId } = useParams();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    const trackClick = async () => {
      if (!firestore || typeof linkId !== 'string') return;

      try {
        // This is a simplification. In a real app, you'd need to find the user ID.
        // This implementation will not work without knowing the user who created the link.
        // For now, we will assume a fixed user ID for demonstration purposes, but this is not secure.
        // A proper implementation would involve a root collection of links with user IDs.
        
        // Let's find the link across all users. This is inefficient and not scalable.
        // A better schema would be a root `trackedLinks` collection.
        
        // This is a placeholder to demonstrate the concept.
        // We will try to get the document from a hypothetical path.
        // This will likely fail, as we don't know the userId.
        
        // A more robust solution would be needed in a production app.
        // For now, we'll simulate a failure and then a redirect.
        
        // The following logic is for demonstration and will likely not find the document
        // unless you manually construct the Firestore database with a known user and link.

        // A proper solution would be:
        // 1. Create a root collection `trackedLinks`.
        // 2. Each document in `trackedLinks` has a `userId` and the `url`.
        // 3. The `[linkId]` would be the ID of the document in this root collection.
        
        const linkRef = doc(firestore, "trackedLinks", linkId); // This assumes a root collection
        
        let destinationUrl = null;

        await runTransaction(firestore, async (transaction) => {
            const linkDoc = await transaction.get(linkRef);
            if (!linkDoc.exists()) {
                throw new Error("Link not found");
            }
            const data = linkDoc.data();
            destinationUrl = data.url;
            const newClicks = (data.clicks || 0) + 1;
            transaction.update(linkRef, { clicks: newClicks });
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
