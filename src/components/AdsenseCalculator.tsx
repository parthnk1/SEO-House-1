'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adsenseCalculatorAction } from '@/app/actions';
import { type AdsenseCalculatorOutput } from '@/ai/flows/adsense-calculator';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Calculator, DollarSign, MousePointerClick, Calendar, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  pageImpressions: z.coerce.number().min(1, 'Must be at least 1').max(10000000, 'Cannot exceed 10,000,000'),
  clickThroughRate: z.coerce.number().min(0.01, 'Must be at least 0.01').max(100, 'Cannot exceed 100'),
  costPerClick: z.coerce.number().min(0.01, 'Must be at least 0.01'),
});

type FormData = z.infer<typeof formSchema>;

export default function AdsenseCalculator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdsenseCalculatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageImpressions: 10000,
      clickThroughRate: 1.5,
      costPerClick: 0.50,
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await adsenseCalculatorAction(values);

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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>AdSense Calculator</CardTitle>
        <CardDescription>Estimate your potential AdSense earnings based on traffic and performance metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="pageImpressions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Page Impressions</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 50000" {...field} />
                    </FormControl>
                    <Slider
                      min={1}
                      max={100000}
                      step={100}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clickThroughRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Click-Through Rate (CTR %)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 1.25" {...field} />
                    </FormControl>
                     <Slider
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costPerClick"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Per Click (CPC $)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 0.75" {...field} />
                    </FormControl>
                    <Slider
                      min={0.01}
                      max={5}
                      step={0.01}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Calculator className="mr-2 h-5 w-5" />
              )}
              Calculate Earnings
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Calculating potential earnings...</p>
          </div>
        )}

        {result && (
          <div className="mt-10 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline text-center">Estimated Earnings</h3>
            
            <div className="text-center p-6 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-semibold">TOTAL DAILY EARNINGS</p>
                <p className="text-5xl font-bold text-primary">{formatCurrency(result.dailyEarnings)}</p>
                <p className="text-sm text-muted-foreground">Based on {result.clicks} clicks per day.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Clicks</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.clicks.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(result.monthlyEarnings)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Yearly Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(result.yearlyEarnings)}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
