
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { bulkDomainRatingCheckerAction } from '@/app/actions';
import { type BulkDomainRatingCheckerOutput } from '@/ai/flows/schemas/bulk-domain-rating-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Star, Link, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  domains: z.string().min(1, 'Please enter at least one domain.').transform(val => 
    val.split(/\s*,\s*|\s+/).filter(Boolean)
  ).pipe(z.array(z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Invalid domain format found in list.',
  })).min(1, 'Please enter at least one domain.')),
});

type FormData = z.infer<typeof formSchema>;

export default function BulkDomainRatingChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BulkDomainRatingCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<{domains: string}>({
    resolver: zodResolver(formSchema),
    defaultValues: { domains: '' },
  });

  const onSubmit = async (values: {domains: string}) => {
    setIsLoading(true);
    setResult(null);

    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      form.setError('domains', { message: parsed.error.errors[0].message });
      setIsLoading(false);
      return;
    }

    const response = await bulkDomainRatingCheckerAction({ domains: parsed.data.domains });

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
        <CardTitle>Bulk Domain Rating Checker</CardTitle>
        <CardDescription>Check the simulated domain rating for multiple websites at once. Enter domains separated by commas or new lines.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="domains"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domains</FormLabel>
                    <FormControl>
                      <Textarea placeholder="example.com, google.com, yoursite.net" {...field} rows={6} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                <>
                    <Search className="mr-2 h-5 w-5" /> Check Ratings
                </>
                )}
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Checking domain ratings...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Domain Rating Results
            </h3>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Domain</TableHead>
                          <TableHead className="text-center w-[120px]">Rating</TableHead>
                          <TableHead className="text-right">Backlinks</TableHead>
                          <TableHead className="text-right">Referring Domains</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.results.map((res, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{res.domain}</TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="font-bold text-primary">{res.rating}</span>
                                    <Star className="w-4 h-4 text-yellow-400" />
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">{res.backlinks.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono">{res.referringDomains.toLocaleString()}</TableCell>
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
