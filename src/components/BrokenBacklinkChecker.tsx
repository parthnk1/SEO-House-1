'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { brokenBacklinkCheckerAction } from '@/app/actions';
import { type BrokenBacklinkCheckerOutput } from '@/ai/flows/broken-backlink-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Unlink, ExternalLink, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  domain: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name (e.g., example.com).',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function BrokenBacklinkChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BrokenBacklinkCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { domain: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await brokenBacklinkCheckerAction(values);

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
        <CardTitle>Broken Backlink Checker</CardTitle>
        <CardDescription>Enter your domain to find broken backlinks pointing to your site.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Domain</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="your-domain.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Find Broken Links
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
            <p className="mt-2 text-muted-foreground">Scanning for broken backlinks...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Found {result.brokenBacklinks.length} broken backlinks for "{form.getValues('domain')}"
            </h3>
            {result.brokenBacklinks.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Source Page (Linking From)</TableHead>
                            <TableHead>Broken Link (Linking To)</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.brokenBacklinks.map((link, index) => (
                            <TableRow key={index} className="bg-destructive/5">
                                <TableCell>
                                    <Link href={link.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                                        <span className="truncate">{link.sourceUrl}</span>
                                        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={link.targetUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                        <span className="truncate">{link.targetUrl}</span>
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
                    <Unlink className="w-16 h-16 mb-4 text-green-500" />
                    <h4 className="text-lg font-semibold">No Broken Backlinks Found!</h4>
                    <p className="text-muted-foreground">Congratulations! We didn't find any broken backlinks pointing to your domain.</p>
                </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
