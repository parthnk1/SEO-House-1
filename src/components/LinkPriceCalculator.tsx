'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { linkPriceCalculatorAction } from '@/app/actions';
import { type LinkPriceCalculatorOutput } from '@/ai/flows/link-price-calculator';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Calculator, Shield, Tag, Info, CircleDollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function LinkPriceCalculator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LinkPriceCalculatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await linkPriceCalculatorAction(values);

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
        <CardTitle>Link Price Calculator</CardTitle>
        <CardDescription>Estimate the market value of a backlink from any website.</CardDescription>
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
                          <Calculator className="mr-2 h-5 w-5" /> Calculate
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
            <p className="mt-2 text-muted-foreground">Estimating link price...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Price Estimation for "{form.getValues('url')}"
            </h3>
            
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-primary">
                        <CircleDollarSign className="w-8 h-8" />
                        <span>Estimated Backlink Price</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold">${result.estimatedPrice.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">Based on our analysis</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Card>
                    <CardHeader className="flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><Shield className="w-4 h-4"/>Domain Authority</CardTitle>
                        <p className="text-lg font-bold">{result.domainAuthority}</p>
                    </CardHeader>
                 </Card>
                 <Card>
                    <CardHeader className="flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2"><Tag className="w-4 h-4"/>Website Niche</CardTitle>
                         <Badge variant="outline">{result.niche}</Badge>
                    </CardHeader>
                 </Card>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Reasoning</AlertTitle>
              <AlertDescription>
                {result.reasoning}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
