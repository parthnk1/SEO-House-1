'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { checkKeywordCompetitionAction } from '@/app/actions';
import { type CheckKeywordCompetitionOutput } from '@/ai/flows/check-keyword-competition';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Swords, Crown, ExternalLink, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const formSchema = z.object({
  keyword: z.string().min(2, { message: 'Please enter a keyword.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function KeywordCompetitionTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckKeywordCompetitionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await checkKeywordCompetitionAction(values);

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
  
  const getCompetitionLevelColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
    }
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Keyword Competition Tool</CardTitle>
        <CardDescription>Analyze the competition for your target keywords and see who ranks at the top.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keyword to Analyze</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'backlink strategy'" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Swords className="mr-2 h-5 w-5" /> Analyze
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
            <p className="mt-2 text-muted-foreground">Analyzing competitors...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Competition Analysis for "{form.getValues('keyword')}"</h3>
            
            <Card>
                <CardHeader>
                    <CardTitle>Competition Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-primary">{result.competitionScore} <span className="text-lg font-normal text-muted-foreground">/ 100</span></div>
                        <div className="flex-grow">
                            <Progress value={result.competitionScore} className="h-4" />
                            <div className="text-center mt-2">
                                <Badge variant="outline" className={cn({
                                'border-green-500 text-green-500 bg-green-500/10': result.competitionLevel === 'Low',
                                'border-yellow-500 text-yellow-500 bg-yellow-500/10': result.competitionLevel === 'Medium',
                                'border-red-500 text-red-500 bg-red-500/10': result.competitionLevel === 'High',
                                })}>
                                {result.competitionLevel} Competition
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Top Competing Pages</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[60px] text-center">Rank</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead className="text-right">Domain Authority</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.topCompetitors.map((competitor) => (
                            <TableRow key={competitor.rank}>
                                <TableCell className="font-bold text-lg text-center text-primary">{competitor.rank}</TableCell>
                                <TableCell>
                                    <Link href={competitor.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                        <span className="truncate">{competitor.url}</span>
                                        <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right font-medium flex justify-end items-center gap-2">
                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                    {competitor.domainAuthority}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
