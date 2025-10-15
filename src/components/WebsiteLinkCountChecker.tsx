'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { websiteLinkCountCheckerAction } from '@/app/actions';
import { type WebsiteLinkCountCheckerOutput } from '@/ai/flows/website-link-count-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Link as LinkIcon, ExternalLink, ArrowRightLeft, ListTree } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function WebsiteLinkCountChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebsiteLinkCountCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await websiteLinkCountCheckerAction(values);

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
        <CardTitle>Website Link Count Checker</CardTitle>
        <CardDescription>Enter a URL to count the total, internal, and external links on the page.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Count Links
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
            <p className="mt-2 text-muted-foreground">Counting links...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
             <h3 className="text-xl font-semibold font-headline">
              Link Analysis for "{form.getValues('url')}"
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <LinkIcon className="w-5 h-5 text-muted-foreground" />
                    Total Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">{result.totalLinks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <ListTree className="w-5 h-5 text-muted-foreground" />
                    Internal Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{result.internalLinks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-lg">
                    <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                    External Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{result.externalLinks}</p>
                </CardContent>
              </Card>
            </div>
            
            {result.links.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sample Links Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                        {result.links.map((link, index) => (
                            <li key={index} className="flex items-center justify-between p-2 rounded-md bg-card">
                                <Link href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group text-sm truncate">
                                    <span className="truncate">{link.url}</span>
                                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </Link>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${link.type === 'internal' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                    {link.type}
                                </span>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  );
}
