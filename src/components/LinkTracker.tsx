'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Plus, Trash2, Copy, BarChart, ExternalLink, Calendar } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth, useCollection, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp, doc, deleteDoc, runTransaction } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Please enter a valid URL'),
});

type FormData = z.infer<typeof formSchema>;

export default function LinkTracker() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const firestore = useFirestore();

  const linksCollection = user && firestore ? collection(firestore, 'users', user.uid, 'trackedLinks') : null;
  const { data: links, loading: linksLoading } = useCollection(linksCollection);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
    },
  });

  const onSubmit = async (values: FormData) => {
    if (!user || !firestore) {
        toast({ variant: "destructive", title: "You must be logged in to create a link."});
        return;
    }
    setIsLoading(true);

    try {
        await addDoc(linksCollection, {
            ...values,
            clicks: 0,
            createdAt: serverTimestamp(),
            userId: user.uid,
        });
        toast({ title: "Link added successfully!" });
        form.reset();
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error adding link", description: error.message });
    } finally {
        setIsLoading(false);
    }
  };

  const deleteLink = async (linkId: string) => {
    if (!user || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'users', user.uid, 'trackedLinks', linkId));
      toast({ title: "Link deleted successfully" });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error deleting link", description: error.message });
    }
  }

  const copyLink = (linkId: string) => {
    const url = `${window.location.origin}/track/${linkId}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Tracking URL copied to clipboard!" });
  }

  if (!user) {
    return (
        <Card className="shadow-lg bg-background">
            <CardHeader>
                <CardTitle>Link Tracker</CardTitle>
                <CardDescription>You need to be logged in to track links.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Please sign in to use this feature.</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg bg-background">
        <CardHeader>
          <CardTitle>Add a New Link to Track</CardTitle>
          <CardDescription>Create a short URL to track clicks on any link.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Summer Campaign" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-target-url.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Your Tracked Links</CardTitle>
            <CardDescription>Here are the links you are currently tracking. Share the tracking URL to count clicks.</CardDescription>
        </CardHeader>
        <CardContent>
            {linksLoading && <div className="text-center"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>}
            {!linksLoading && links && (
                <div className="space-y-4">
                    {links.docs.map(linkDoc => {
                        const link = linkDoc.data();
                        return (
                            <Card key={linkDoc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                                <div className="flex-grow mb-4 sm:mb-0">
                                    <h3 className="font-semibold text-lg">{link.name}</h3>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                        {link.url} <ExternalLink className="h-3 w-3"/>
                                    </a>
                                     <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Created {link.createdAt ? formatDistanceToNow(link.createdAt.toDate()) : '...'} ago
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                                    <div className="flex items-center gap-2 text-primary font-bold">
                                        <BarChart className="h-5 w-5" />
                                        <span>{link.clicks} Clicks</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => copyLink(linkDoc.id)}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy Tracking URL
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the link and its tracking data.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteLink(linkDoc.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                    {links.docs.length === 0 && <p className="text-muted-foreground text-center">You haven't added any links to track yet.</p>}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
