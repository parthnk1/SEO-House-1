'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { checkKeywordPositionAction } from '@/app/actions';
import { type CheckKeywordPositionOutput } from '@/ai/flows/check-keyword-position';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Target } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  keyword: z.string().min(1, { message: 'Please enter a keyword.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function KeywordPositionChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckKeywordPositionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '', keyword: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await checkKeywordPositionAction(values);

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
        <CardTitle>Keyword Position Checker</CardTitle>
        <CardDescription>Enter a URL and a keyword to see its position in search results.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keyword</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'best seo tools'" {...field} />
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
                <Search className="mr-2 h-5 w-5" />
              )}
              Check Position
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Checking keyword position...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50">
            <h3 className="text-xl font-semibold font-headline mb-4">Result</h3>
            <Alert>
              <Target className="h-4 w-4" />
              <AlertTitle>Keyword Position</AlertTitle>
              <AlertDescription>
                The website <strong className="text-primary">{form.getValues('url')}</strong> is ranked at position <strong className="text-primary">#{result.position}</strong> for the keyword <strong className="text-primary">"{form.getValues('keyword')}"</strong>.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
