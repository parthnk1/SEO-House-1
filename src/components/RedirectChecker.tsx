
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { redirectCheckerAction } from '@/app/actions';
import { type RedirectCheckerOutput } from '@/ai/flows/schemas/redirect-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, ArrowDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function RedirectChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RedirectCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await redirectCheckerAction(values);

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
  
  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge className="bg-green-500/10 text-green-700 border-green-500/50" variant="outline"><CheckCircle className="mr-1 h-3 w-3" /> {statusCode}</Badge>;
    }
    if (statusCode >= 300 && statusCode < 400) {
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/50" variant="outline"><AlertTriangle className="mr-1 h-3 w-3" /> {statusCode}</Badge>;
    }
    return <Badge variant="destructive">{statusCode}</Badge>;
  }

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Redirect Checker</CardTitle>
        <CardDescription>Trace the full redirect path of any URL.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL to Check</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Check
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
            <p className="mt-2 text-muted-foreground">Checking for redirects...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Redirect Path for "{form.getValues('url')}"
            </h3>
            <div className="space-y-2">
                {result.redirectChain.map((step, index) => (
                    <div key={index} className="space-y-2">
                        <Card className={cn(
                            "p-4",
                            step.statusCode >= 200 && step.statusCode < 300 && "border-green-500/50 bg-green-500/5",
                            step.statusCode >= 300 && step.statusCode < 400 && "border-yellow-500/50 bg-yellow-500/5",
                        )}>
                            <div className="flex justify-between items-center">
                                <p className="font-mono text-sm break-all">{step.url}</p>
                                {getStatusBadge(step.statusCode)}
                            </div>
                             <p className="text-xs text-muted-foreground">{step.statusText}</p>
                        </Card>
                        {index < result.redirectChain.length - 1 && (
                            <div className="flex justify-center">
                                <ArrowDown className="w-6 h-6 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
