'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { googleCacheCheckerAction } from '@/app/actions';
import { type GoogleCacheCheckerOutput } from '@/ai/flows/google-cache-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function GoogleCacheChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GoogleCacheCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await googleCacheCheckerAction(values);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: response.error,
      });
    }

    setIsLoading(false);
  };
  
  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Google Cache Checker</CardTitle>
        <CardDescription>Enter a URL to see if it's cached by Google and when.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Check Cache
                        </>
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Checking Google's cache...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">Cache Status for "{form.getValues('url')}"</h3>
            {result.isCached && result.cacheDate && result.cacheUrl ? (
                <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 !text-green-500" />
                    <AlertTitle>Page is Cached by Google!</AlertTitle>
                    <AlertDescription>
                        <p>The last cache was on <strong>{new Date(result.cacheDate).toLocaleString()}</strong>.</p>
                        <Button asChild variant="link" className="p-0 h-auto mt-2 text-green-700 dark:text-green-400">
                            <Link href={result.cacheUrl} target="_blank" rel="noopener noreferrer">
                                View Cached Version <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Page Not Found in Cache</AlertTitle>
                    <AlertDescription>
                        Google has not cached this URL, or it is not publicly accessible.
                    </AlertDescription>
                </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
