'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { domainAgeCheckerAction } from '@/app/actions';
import { type DomainAgeCheckerOutput } from '@/ai/flows/domain-age-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Calendar, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const formSchema = z.object({
  domain: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name (e.g., example.com).',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function DomainAgeChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DomainAgeCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { domain: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await domainAgeCheckerAction(values);

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
        <CardTitle>Domain Age Checker</CardTitle>
        <CardDescription>Find out the age of any domain name.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Check Age
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
            <p className="mt-2 text-muted-foreground">Checking domain age...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Age for "{form.getValues('domain')}"
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Registration Date</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(result.registrationDate).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(result.registrationDate))} ago
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Domain Age</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{result.ageInYears} years</div>
                        <p className="text-xs text-muted-foreground">
                            ({result.ageInDays.toLocaleString()} days)
                        </p>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
