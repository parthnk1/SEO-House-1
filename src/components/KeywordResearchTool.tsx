'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { keywordResearchAction } from '@/app/actions';
import { type KeywordResearchOutput } from '@/ai/flows/keyword-research';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, BarChart3, TrendingUp, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  topic: z.string().min(2, { message: 'Please enter a topic or keyword.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function KeywordResearchTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KeywordResearchOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await keywordResearchAction(values);

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

  const getCompetitionBadge = (competition: 'Low' | 'Medium' | 'High') => {
    return (
      <Badge
        variant="outline"
        className={cn({
          'border-green-500 text-green-500 bg-green-500/10': competition === 'Low',
          'border-yellow-500 text-yellow-500 bg-yellow-500/10': competition === 'Medium',
          'border-red-500 text-red-500 bg-red-500/10': competition === 'High',
        })}
      >
        {competition}
      </Badge>
    );
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Keyword Research Tool</CardTitle>
        <CardDescription>Enter a topic to discover valuable keywords, their search volume, and competition level.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic or Seed Keyword</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'sustainable fashion'" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Research
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
            <p className="mt-2 text-muted-foreground">Discovering keywords for you...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">Keyword Results for "{form.getValues('topic')}"</h3>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[40%]">Keyword</TableHead>
                        <TableHead><TrendingUp className="inline-block w-4 h-4 mr-1"/> Monthly Volume</TableHead>
                        <TableHead><Zap className="inline-block w-4 h-4 mr-1"/> Competition</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.results.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.keyword}</TableCell>
                            <TableCell>{item.volume.toLocaleString()}</TableCell>
                            <TableCell>{getCompetitionBadge(item.competition)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
