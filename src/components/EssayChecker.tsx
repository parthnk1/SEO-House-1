'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { essayCheckerAction } from '@/app/actions';
import { type EssayCheckerOutput } from '@/ai/flows/essay-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, FileCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  essay: z.string().min(50, { message: 'Essay must be at least 50 characters long.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function EssayChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EssayCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { essay: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await essayCheckerAction(values);

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
        <CardTitle>AI Essay Checker</CardTitle>
        <CardDescription>Paste your essay below to get instant feedback on grammar, style, and clarity.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="essay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Essay</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste your essay here..." {...field} rows={15} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" /> Check Essay
                </>
              )}
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">AI is reviewing your essay...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Analysis Complete</h3>
            
            <Card>
                <CardHeader>
                    <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold text-primary">{result.score}</div>
                        <div className="flex-grow">
                            <Progress value={result.score} className="h-4" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileCheck className="w-6 h-6" /> Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: result.feedback.replace(/\n/g, '<br />') }}
                    />
                </CardContent>
            </Card>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
