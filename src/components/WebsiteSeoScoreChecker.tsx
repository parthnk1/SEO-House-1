'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { websiteSeoScoreCheckerAction } from '@/app/actions';
import { type WebsiteSeoScoreCheckerOutput } from '@/ai/flows/website-seo-score-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function WebsiteSeoScoreChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebsiteSeoScoreCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await websiteSeoScoreCheckerAction(values);

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

  const getStatusIcon = (status: 'Good' | 'Needs Improvement' | 'Poor') => {
    switch (status) {
      case 'Good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Needs Improvement':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'Poor':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };
  
  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Website SEO Score Checker</CardTitle>
        <CardDescription>Get a comprehensive SEO score and analysis for any website.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Analyze SEO
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
            <p className="mt-2 text-muted-foreground">Performing SEO analysis...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              SEO Analysis for "{form.getValues('url')}"
            </h3>
            
            <Card className="flex flex-col items-center justify-center p-6">
                <CardTitle className="text-lg text-muted-foreground">Overall SEO Score</CardTitle>
                <div className="relative mt-4">
                    <div className="text-6xl font-bold text-primary">{result.overallScore}</div>
                </div>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Factor Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.analysis.map((factor, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm flex items-center gap-2">
                                    {getStatusIcon(factor.status)}
                                    {factor.factor}
                                </span>
                                <span className="text-sm font-semibold">{factor.score}/100</span>
                            </div>
                            <Progress value={factor.score} className="h-2" />
                        </div>
                    ))}
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
