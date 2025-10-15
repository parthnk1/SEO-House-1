'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { keywordDifficultyCheckerAction } from '@/app/actions';
import { type KeywordDifficultyCheckerOutput } from '@/ai/flows/keyword-difficulty-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Mountain } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  keyword: z.string().min(2, { message: 'Please enter a keyword.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function KeywordDifficultyChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KeywordDifficultyCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { keyword: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await keywordDifficultyCheckerAction(values);

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
        <CardTitle>Keyword Difficulty Checker</CardTitle>
        <CardDescription>Assess how difficult it is to rank for a keyword.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keyword</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'best gaming laptop'" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Check Difficulty
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
            <p className="mt-2 text-muted-foreground">Analyzing keyword difficulty...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Difficulty for "{form.getValues('keyword')}"</h3>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mountain className="w-6 h-6" />
                        <span>Difficulty Score</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold text-primary">{result.difficultyScore}</div>
                        <div className="flex-grow">
                            <Progress value={result.difficultyScore} className="h-4" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>Easy</span>
                                <span>Medium</span>
                                <span>Hard</span>
                            </div>
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
