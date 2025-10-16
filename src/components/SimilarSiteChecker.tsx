
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { similarSiteCheckerAction } from '@/app/actions';
import { type SimilarSiteCheckerOutput } from '@/ai/flows/schemas/similar-site-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Copy, ExternalLink, Info } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function SimilarSiteChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimilarSiteCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await similarSiteCheckerAction(values);

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
        <CardTitle>Similar Site Checker</CardTitle>
        <CardDescription>Find websites similar to a given URL for competitive analysis.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Find Sites
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
            <p className="mt-2 text-muted-foreground">Finding similar websites...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Sites Similar to "{form.getValues('url')}"
            </h3>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Similar Website</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.similarSites.map((site, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group font-medium">
                                    <span className="truncate">{site.url}</span>
                                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </Link>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <span>{site.reason}</span>
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
