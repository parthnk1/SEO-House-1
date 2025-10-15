'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { seoKeywordCompetitionAnalysisAction } from '@/app/actions';
import { type SeoKeywordCompetitionAnalysisOutput } from '@/ai/flows/seo-keyword-competition-analysis';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, BarChart, Check, X, Target, Lightbulb, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

const formSchema = z.object({
  keyword: z.string().min(2, { message: 'Please enter a keyword.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function SeoKeywordCompetitionAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SeoKeywordCompetitionAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { keyword: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await seoKeywordCompetitionAnalysisAction(values);

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
        <CardTitle>In-depth Competition Analysis</CardTitle>
        <CardDescription>Get a strategic overview of the SERP landscape for your target keyword.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Keyword</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'content marketing roi'" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <BarChart className="mr-2 h-5 w-5" /> Analyze
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
            <p className="mt-2 text-muted-foreground">Performing deep analysis...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-2xl font-bold font-headline">Analysis for "{form.getValues('keyword')}"</h3>
            
            <Card>
                <CardHeader>
                    <CardTitle>Overall Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-primary">{result.overallDifficulty} <span className="text-lg font-normal text-muted-foreground">/ 100</span></div>
                        <div className="flex-grow">
                            <Progress value={result.overallDifficulty} className="h-4" />
                            <p className="text-sm text-muted-foreground mt-2 text-center">A higher score means it's more difficult to rank.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top Competitors Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {result.competitors.map((competitor, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                  <div className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-primary">{index + 1}</span>
                                    <div className="text-left">
                                      <p className="font-semibold truncate">{competitor.title}</p>
                                      <Link href={competitor.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group" onClick={(e) => e.stopPropagation()}>
                                        {competitor.url}
                                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                      </Link>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold flex items-center text-green-500"><Check className="w-5 h-5 mr-2" />Strengths</h4>
                                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                {competitor.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold flex items-center text-yellow-500"><X className="w-5 h-5 mr-2" />Weaknesses / Opportunities</h4>
                                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                {competitor.weaknesses.map((weakness, i) => <li key={i}>{weakness}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center"><Lightbulb className="w-6 h-6 mr-2 text-primary" />Actionable SEO Advice</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {result.actionableAdvice.map((advice, index) => (
                           <li key={index} className="flex items-start gap-3">
                                <Target className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                                <span className="text-muted-foreground">{advice}</span>
                           </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
