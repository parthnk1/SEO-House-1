'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { classCIpCheckerAction } from '@/app/actions';
import { type ClassCIpCheckerOutput } from '@/ai/flows/class-c-ip-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  domain1: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name.',
  }),
  domain2: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name.',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function ClassCIpChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassCIpCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { domain1: '', domain2: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await classCIpCheckerAction(values);

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
        <CardTitle>Class C IP Checker</CardTitle>
        <CardDescription>Check if two domains are hosted on the same Class C IP block.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="domain1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain 1</FormLabel>
                    <FormControl>
                      <Input placeholder="example-a.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain 2</FormLabel>
                    <FormControl>
                      <Input placeholder="example-b.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Search className="mr-2 h-5 w-5" />
              )}
              Check
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Checking IPs...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Result</h3>
            {result.sameClassC ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Warning: Same Class C Block</AlertTitle>
                <AlertDescription>
                  Both domains are hosted on the same Class C IP block ({result.domain1Info.classCBlock}). This may be perceived as a link network by search engines.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 !text-green-500" />
                <AlertTitle>Different Class C Blocks</AlertTitle>
                <AlertDescription>
                  The domains are hosted on different Class C IP blocks, which is good for SEO.
                </AlertDescription>
              </Alert>
            )}
             <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{result.domain1Info.domain}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">IP: <strong className="font-mono">{result.domain1Info.ipAddress}</strong></p>
                        <p className="text-sm">Class C: <strong className="font-mono">{result.domain1Info.classCBlock}</strong></p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{result.domain2Info.domain}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">IP: <strong className="font-mono">{result.domain2Info.ipAddress}</strong></p>
                        <p className="text-sm">Class C: <strong className="font-mono">{result.domain2Info.classCBlock}</strong></p>
                    </CardContent>
                </Card>
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
