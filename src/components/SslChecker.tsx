
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sslCheckerAction } from '@/app/actions';
import { type SslCheckerOutput } from '@/ai/flows/schemas/ssl-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Lock, CheckCircle, XCircle, Calendar, Users, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const formSchema = z.object({
  domain: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name (e.g., example.com).',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function SslChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SslCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { domain: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await sslCheckerAction(values);

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
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
  }

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>SSL Checker</CardTitle>
        <CardDescription>Enter a domain to check the status of its SSL certificate.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Check SSL
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
            <p className="mt-2 text-muted-foreground">Checking SSL certificate...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              SSL Certificate Details for "{form.getValues('domain')}"
            </h3>
            
            {result.isValid ? (
                 <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 !text-green-500" />
                    <AlertTitle>Certificate is Valid</AlertTitle>
                    <AlertDescription>
                        This website has a valid SSL certificate, which expires in {result.daysRemaining} days.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Certificate is Invalid</AlertTitle>
                    <AlertDescription>
                        This website's SSL certificate is not valid.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Certificate Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-muted-foreground flex items-center gap-2"><Info className="w-4 h-4"/>Subject</span>
                        <span>{result.subjectName}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4"/>Issuer</span>
                        <span>{result.issuer}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/>Valid From</span>
                        <span>{formatDate(result.validFrom)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/>Valid To</span>
                        <span>{formatDate(result.validTo)}</span>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
