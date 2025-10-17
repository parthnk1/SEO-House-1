
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { domainNameSearchAction } from '@/app/actions';
import { type DomainNameSearchOutput } from '@/ai/flows/schemas/domain-name-search';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const formSchema = z.object({
  query: z.string().min(2, { message: 'Please enter a keyword or idea.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function DomainNameSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DomainNameSearchOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await domainNameSearchAction(values);

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
        <CardTitle>Domain Name Search</CardTitle>
        <CardDescription>Enter a keyword to get creative and brandable domain name suggestions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keyword or Business Idea</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'blue widget labs'" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Search
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
            <p className="mt-2 text-muted-foreground">Searching for perfect domains...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">Domain Suggestions for "{form.getValues('query')}"</h3>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Domain Name</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Register</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.suggestions.map((suggestion, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{suggestion.domainName}</TableCell>
                            <TableCell className="text-center">
                                {suggestion.available ? (
                                    <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10">
                                        <CheckCircle className="mr-1 h-3 w-3" /> Available
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500">
                                        <XCircle className="mr-1 h-3 w-3" /> Taken
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="ghost" size="sm" disabled={!suggestion.available}>
                                    <Link href={`https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${suggestion.domainName}`} target="_blank" rel="noopener noreferrer">
                                        Check Availability <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </TableCell>
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
