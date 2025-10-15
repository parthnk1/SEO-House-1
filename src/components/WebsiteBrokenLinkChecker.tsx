'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { websiteBrokenLinkCheckerAction } from '@/app/actions';
import { type WebsiteBrokenLinkCheckerOutput } from '@/ai/flows/website-broken-link-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Unlink2, ExternalLink, ShieldAlert, FileWarning } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function WebsiteBrokenLinkChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebsiteBrokenLinkCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await websiteBrokenLinkCheckerAction(values);

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
        <CardTitle>Website Broken Link Checker</CardTitle>
        <CardDescription>Enter a URL to find and fix broken links on your site.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Find Links
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
            <p className="mt-2 text-muted-foreground">Scanning for broken links...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Found {result.brokenLinks.length} broken links after scanning {result.totalLinksScanned} total links.
            </h3>
            {result.brokenLinks.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Broken Link URL</TableHead>
                            <TableHead>Source Page</TableHead>
                            <TableHead className="text-right">HTTP Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.brokenLinks.map((link, index) => (
                            <TableRow key={index} className="bg-destructive/5">
                                <TableCell>
                                    <Link href={link.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                        <span className="truncate">{link.linkUrl}</span>
                                        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={link.sourcePage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                                        <span className="truncate">{link.sourcePage}</span>
                                        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="destructive">
                                        <ShieldAlert className="w-3 h-3 mr-1" />
                                        {link.httpStatusCode}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <Card className="flex flex-col items-center justify-center p-8 text-center">
                    <Unlink2 className="w-16 h-16 mb-4 text-green-500" />
                    <h4 className="text-lg font-semibold">No Broken Links Found!</h4>
                    <p className="text-muted-foreground">Congratulations! We didn't find any broken links on your website.</p>
                </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
