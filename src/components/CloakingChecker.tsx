
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cloakingCheckerAction } from '@/app/actions';
import { CloakingCheckerInputSchema, type CloakingCheckerOutput } from '@/ai/flows/schemas/cloaking-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = CloakingCheckerInputSchema;
type FormData = z.infer<typeof formSchema>;

export default function CloakingChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CloakingCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await cloakingCheckerAction(values);

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
        <CardTitle>Cloaking Checker</CardTitle>
        <CardDescription>Check if a website is showing different content to search engine bots than to users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Eye className="mr-2 h-5 w-5" /> Check
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
            <p className="mt-2 text-muted-foreground">Checking for cloaking...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Result for "{form.getValues('url')}"
            </h3>
            
            {result.isCloaking ? (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Cloaking Detected!</AlertTitle>
                <AlertDescription>
                  {result.analysis}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                <ShieldCheck className="h-4 w-4 !text-green-500" />
                <AlertTitle>No Cloaking Detected</AlertTitle>
                <AlertDescription>
                  {result.analysis}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
