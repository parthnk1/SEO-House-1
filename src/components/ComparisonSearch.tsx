
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { comparisonSearchAction } from '@/app/actions';
import { type ComparisonSearchOutput } from '@/ai/flows/schemas/comparison-search';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const formSchema = z.object({
  query: z.string().min(2, { message: 'Please enter a search query.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function ComparisonSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ComparisonSearchOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await comparisonSearchAction(values);

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
        <CardTitle>Comparison Search</CardTitle>
        <CardDescription>Search a query across multiple search engines and compare the results.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Query</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'best seo tools'" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Search
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
            <p className="mt-2 text-muted-foreground">Searching across engines...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Search Results for "{form.getValues('query')}"
            </h3>
            <Tabs defaultValue={result.engines[0]?.engine.toLowerCase() || 'google'}>
              <TabsList className="grid w-full grid-cols-3">
                {result.engines.map(engine => (
                    <TabsTrigger key={engine.engine} value={engine.engine.toLowerCase()}>{engine.engine}</TabsTrigger>
                ))}
              </TabsList>
              {result.engines.map(engine => (
                <TabsContent key={engine.engine} value={engine.engine.toLowerCase()}>
                    <div className="space-y-4">
                        {engine.results.map((res, index) => (
                            <Card key={index} className="p-4">
                                <Link href={res.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors group">
                                    <h4 className="font-semibold text-lg">{res.title}</h4>
                                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                        {res.url} <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                    </p>
                                </Link>
                                <p className="text-sm text-muted-foreground mt-1">{res.description}</p>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
