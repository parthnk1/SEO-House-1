'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { urlRewritingToolAction } from '@/app/actions';
import { type UrlRewritingToolOutput } from '@/ai/flows/url-rewriting-tool';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, Copy, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function UrlRewritingTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UrlRewritingToolOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await urlRewritingToolAction(values);

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
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
    });
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>URL Rewriting Tool</CardTitle>
        <CardDescription>Generate SEO-friendly URLs from dynamic or messy links.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original URL</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://example.com/products?id=123" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-5 w-5" /> Rewrite URL
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
            <p className="mt-2 text-muted-foreground">Generating SEO-friendly URL...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Result</h3>
            
            <div className="space-y-4">
                <div>
                    <FormLabel>Original URL</FormLabel>
                    <p className="text-sm text-muted-foreground break-all">{form.getValues('url')}</p>
                </div>

                <div className="flex justify-center items-center">
                    <ArrowRight className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <FormLabel>Rewritten URL</FormLabel>
                  <div className="relative">
                    <Input readOnly value={result.rewrittenUrl} className="pr-10 bg-card" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => copyToClipboard(result.rewrittenUrl)}
                        >
                        <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
            </div>
            
            <Alert>
                <AlertTitle>Explanation</AlertTitle>
                <AlertDescription>
                    {result.explanation}
                </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
