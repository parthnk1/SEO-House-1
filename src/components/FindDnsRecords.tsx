
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { findDnsRecordsAction } from '@/app/actions';
import { type FindDnsRecordsOutput, FindDnsRecordsInputSchema } from '@/ai/flows/schemas/find-dns-records';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from './ui/badge';

const formSchema = FindDnsRecordsInputSchema;
type FormData = z.infer<typeof formSchema>;

export default function FindDnsRecords() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindDnsRecordsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { domain: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await findDnsRecordsAction(values);

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
        <CardTitle>Find DNS Records</CardTitle>
        <CardDescription>Look up all the DNS records for a given domain.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Name</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Find Records
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
            <p className="mt-2 text-muted-foreground">Looking up DNS records...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              DNS Records for "{form.getValues('domain')}"
            </h3>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/6">Type</TableHead>
                          <TableHead className="w-1/3">Name</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead className="text-right">TTL</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.records.map((record, index) => (
                        <TableRow key={index}>
                            <TableCell><Badge variant="secondary">{record.type}</Badge></TableCell>
                            <TableCell className="font-mono text-xs">{record.name}</TableCell>
                            <TableCell className="font-mono text-xs break-all">{record.value}</TableCell>
                            <TableCell className="text-right font-mono text-xs">{record.ttl}</TableCell>
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
