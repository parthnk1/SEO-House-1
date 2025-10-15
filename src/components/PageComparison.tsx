'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { pageComparisonAction } from '@/app/actions';
import { type PageComparisonOutput } from '@/ai/flows/page-comparison';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Diff, FileText, ImageIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  url1: z.string().url({ message: 'Please enter a valid URL.' }),
  url2: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function PageComparison() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PageComparisonOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url1: '', url2: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await pageComparisonAction(values);

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
  
  const ComparisonRow = ({ label, value1, value2 }: { label: string; value1: string | number; value2: string | number }) => {
    const isWinner1 = typeof value1 === 'number' && typeof value2 === 'number' ? value1 > value2 : false;
    const isWinner2 = typeof value1 === 'number' && typeof value2 === 'number' ? value2 > value1 : false;

    return (
        <div className="grid grid-cols-3 items-center text-center border-b last:border-b-0 py-4">
            <div className={`font-semibold ${isWinner1 ? 'text-primary' : ''}`}>{value1.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground font-medium">{label}</div>
            <div className={`font-semibold ${isWinner2 ? 'text-primary' : ''}`}>{value2.toLocaleString()}</div>
        </div>
    );
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Page Comparison Tool</CardTitle>
        <CardDescription>Compare two web pages side-by-side to analyze their on-page SEO metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="url1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL 1</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example-a.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL 2</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example-b.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Diff className="mr-2 h-5 w-5" />
              )}
              Compare Pages
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Comparing pages...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Comparison Results</h3>
            <Card>
                <CardContent className="p-0">
                    <div className="grid grid-cols-3 items-center text-center bg-card-foreground/5 p-4">
                        <div className="font-bold text-lg text-left truncate">
                            <Link href={form.getValues('url1')} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                               {new URL(form.getValues('url1')).hostname} <ExternalLink className="h-4 w-4" />
                            </Link>
                        </div>
                        <div></div>
                        <div className="font-bold text-lg text-right truncate">
                            <Link href={form.getValues('url2')} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center justify-end gap-2">
                               {new URL(form.getValues('url2')).hostname} <ExternalLink className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y">
                        <ComparisonRow label="Word Count" value1={result.page1.wordCount} value2={result.page2.wordCount} />
                        <ComparisonRow label="Image Count" value1={result.page1.imageCount} value2={result.page2.imageCount} />
                    </div>
                     <div className="grid grid-cols-3 items-start text-left border-t p-4 gap-4">
                        <div className="col-span-1">
                             <p className="text-sm text-muted-foreground font-semibold">Title</p>
                             <p>{result.page1.title}</p>
                        </div>
                         <div className="col-span-1"></div>
                        <div className="col-span-1 text-right">
                            <p className="text-sm text-muted-foreground font-semibold">Title</p>
                             <p>{result.page2.title}</p>
                        </div>
                    </div>
                     <div className="grid grid-cols-3 items-start text-left border-t p-4 gap-4">
                        <div className="col-span-1">
                             <p className="text-sm text-muted-foreground font-semibold">Description</p>
                             <p className="text-sm">{result.page1.description}</p>
                        </div>
                         <div className="col-span-1"></div>
                        <div className="col-span-1 text-right">
                            <p className="text-sm text-muted-foreground font-semibold">Description</p>
                             <p className="text-sm">{result.page2.description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
