
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { domainHostingCheckerAction } from '@/app/actions';
import { type DomainHostingCheckerOutput, DomainHostingCheckerInputSchema } from '@/ai/flows/schemas/domain-hosting-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Server, Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = DomainHostingCheckerInputSchema;

type FormData = z.infer<typeof formSchema>;

export default function DomainHostingChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DomainHostingCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { domain: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await domainHostingCheckerAction(values);

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
        <CardTitle>Domain Hosting Checker</CardTitle>
        <CardDescription>Find out who is hosting any website.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Check Hosting
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
            <p className="mt-2 text-muted-foreground">Checking hosting provider...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Result for "{form.getValues('domain')}"
            </h3>
            
            <Alert>
                <Server className="h-4 w-4" />
                <AlertTitle>Hosting Information</AlertTitle>
                <AlertDescription className="mt-2 space-y-1">
                    <p>
                        <strong>Hosting Provider:</strong> <span className="text-primary font-semibold">{result.hostingProvider}</span>
                    </p>
                    <p>
                        <strong>IP Address:</strong> <span className="font-mono">{result.ipAddress}</span>
                    </p>
                </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
