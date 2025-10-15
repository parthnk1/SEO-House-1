'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { backlinksCompetitorsAction } from '@/app/actions';
import { type BacklinksCompetitorsOutput } from '@/ai/flows/backlinks-competitors';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Swords, ExternalLink, Shield, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  domain: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name (e.g., example.com).',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function BacklinksCompetitors() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BacklinksCompetitorsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { domain: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await backlinksCompetitorsAction(values);

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
        <CardTitle>Backlinks Competitors</CardTitle>
        <CardDescription>Enter a competitor's domain to analyze their backlink profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitor Domain</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="competitor.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Swords className="mr-2 h-5 w-5" /> Analyze
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
            <p className="mt-2 text-muted-foreground">Analyzing competitor backlinks...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Backlink Profile for "{form.getValues('domain')}"
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center justify-center gap-2">
                            <LinkIcon className="w-5 h-5 text-muted-foreground" />
                            Total Backlinks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-primary">{result.totalBacklinks.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center justify-center gap-2">
                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
                            Referring Domains
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{result.referringDomains.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Backlinks</CardTitle>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Source URL</TableHead>
                          <TableHead>Anchor Text</TableHead>
                          <TableHead className="text-right">Domain Authority</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.topBacklinks.map((backlink, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link href={backlink.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                    <span className="truncate">{backlink.sourceUrl}</span>
                                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium text-muted-foreground">"{backlink.anchorText}"</TableCell>
                            <TableCell className="text-right font-medium flex justify-end items-center gap-2">
                                <Shield className="w-4 h-4 text-muted-foreground" />
                                {backlink.domainAuthority}
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
