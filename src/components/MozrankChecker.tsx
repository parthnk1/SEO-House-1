'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mozrankCheckerAction } from '@/app/actions';
import { type MozrankCheckerOutput } from '@/ai/flows/schemas/mozrank-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function MozrankChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MozrankCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await mozrankCheckerAction(values);

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
        <CardTitle>MozRank Checker</CardTitle>
        <CardDescription>Get a simulated MozRank score for any web page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page URL</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://example.com/your-page" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Check MozRank
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
            <p className="mt-2 text-muted-foreground">Checking MozRank...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              MozRank for "{form.getValues('url')}"
            </h3>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-6 h-6" />
                        <span>Simulated MozRank Score</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold text-primary">{result.mozRank.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">/ 10</span></div>
                        <div className="flex-grow">
                            <Progress value={result.mozRank * 10} className="h-4" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Alert>
                <AlertTitle>Analysis</AlertTitle>
                <AlertDescription>
                    {result.analysis}
                </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
