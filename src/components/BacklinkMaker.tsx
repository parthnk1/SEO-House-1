'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { backlinkMakerAction } from '@/app/actions';
import { type BacklinkMakerOutput } from '@/ai/flows/backlink-maker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Link2, ExternalLink, Lightbulb, BadgeInfo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const formSchema = z.object({
  keyword: z.string().min(2, { message: 'Please enter a keyword or topic.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function BacklinkMaker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BacklinkMakerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { keyword: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await backlinkMakerAction(values);

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
        <CardTitle>Backlink Maker</CardTitle>
        <CardDescription>Enter a keyword to get a list of potential backlink opportunities.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keyword or Topic</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'sustainable gardening'" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[180px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Link2 className="mr-2 h-5 w-5" /> Generate Ideas
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
            <p className="mt-2 text-muted-foreground">Finding backlink opportunities...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Backlink Suggestions for "{form.getValues('keyword')}"
            </h3>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Website</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.suggestions.map((suggestion, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link href={suggestion.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                    <span className="truncate font-medium">{suggestion.url}</span>
                                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{suggestion.type}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{suggestion.reason}</TableCell>
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
