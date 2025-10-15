'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { reciprocalLinkCheckerAction } from '@/app/actions';
import { type ReciprocalLinkCheckerOutput } from '@/ai/flows/reciprocal-link-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, CheckCircle2, XCircle, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

const formSchema = z.object({
  yourUrl: z.string().url({ message: 'Please enter a valid URL for your website.' }),
  partnerUrl: z.string().url({ message: 'Please enter a valid URL for your partner\'s website.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function ReciprocalLinkChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReciprocalLinkCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { yourUrl: '', partnerUrl: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await reciprocalLinkCheckerAction(values);

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
        <CardTitle>Reciprocal Link Checker</CardTitle>
        <CardDescription>Verify if a partner website is linking back to your site.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="yourUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partnerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner's Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://partner-website.com" {...field} />
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
              Check Link
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Checking for backlink...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50">
            <h3 className="text-xl font-semibold font-headline mb-4">Result</h3>
            {result.isLinkingBack ? (
                <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 !text-green-500" />
                    <AlertTitle>Link Found!</AlertTitle>
                    <AlertDescription>
                        <p>
                        The partner site is linking back to you.
                        {result.linkingUrl && (
                            <div className="mt-2 text-sm">
                                <strong>Found at:</strong>
                                <Link href={result.linkingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline group mt-1">
                                    <span>{result.linkingUrl}</span>
                                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </Link>
                            </div>
                        )}
                        {result.anchorText && (
                            <div className="mt-2 text-sm">
                                <strong>Anchor Text:</strong> "{result.anchorText}"
                            </div>
                        )}
                        </p>
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Link Not Found</AlertTitle>
                    <AlertDescription>
                        We could not find a reciprocal link from <strong className="text-destructive-foreground">{form.getValues('partnerUrl')}</strong> to <strong className="text-destructive-foreground">{form.getValues('yourUrl')}</strong>.
                    </AlertDescription>
                </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
