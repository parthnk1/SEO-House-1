'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { pageSpeedTestAction } from '@/app/actions';
import { type PageSpeedTestOutput } from '@/ai/flows/page-speed-test';
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

export default function PageSpeedTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PageSpeedTestOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await pageSpeedTestAction(values);

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
        <CardTitle>Page Speed Test</CardTitle>
        <CardDescription>Analyze your website's loading speed and performance metrics.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Test Speed
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
            <p className="mt-2 text-muted-foreground">Running performance test...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Performance Analysis for "{form.getValues('url')}"
            </h3>
            
            <Card className="flex flex-col items-center justify-center p-6">
                <CardTitle className="text-lg text-muted-foreground">Overall Performance Score</CardTitle>
                <div className="relative mt-4">
                    <div className="text-6xl font-bold text-primary">{result.performanceScore}</div>
                </div>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Core Web Vitals & Other Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.metrics.map((metric, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-card">
                            <span className="font-medium text-sm flex items-center gap-2">
                                {getStatusIcon(metric.rating)}
                                {metric.name}
                            </span>
                            <span className="text-sm font-bold">{metric.value}</span>
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
