'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { valuableBacklinkCheckerAction } from '@/app/actions';
import { type ValuableBacklinkCheckerOutput } from '@/ai/flows/valuable-backlink-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Gem, ExternalLink, Shield, Star } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function ValuableBacklinkChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValuableBacklinkCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await valuableBacklinkCheckerAction(values);

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
        <CardTitle>Valuable Backlink Checker</CardTitle>
        <CardDescription>Enter a URL to identify its most powerful and valuable backlinks.</CardDescription>
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
                          <Gem className="mr-2 h-5 w-5" /> Find Gems
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
            <p className="mt-2 text-muted-foreground">Searching for valuable backlinks...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Top Valuable Backlinks for "{form.getValues('url')}"
            </h3>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Source URL & Relevance</TableHead>
                          <TableHead className="text-center">Domain Authority</TableHead>
                          <TableHead className="text-right">Value Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.valuableBacklinks.map((backlink, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link href={backlink.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group font-medium">
                                    <span className="truncate">{backlink.sourceUrl}</span>
                                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </Link>
                                <p className="text-xs text-muted-foreground mt-1">{backlink.relevance}</p>
                            </TableCell>
                            <TableCell className="text-center font-medium">
                                <div className="flex items-center justify-center gap-2">
                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                    {backlink.domainAuthority}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <span className="font-bold text-primary">{backlink.valueScore}</span>
                                    <Star className="w-4 h-4 text-yellow-500" />
                                </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
