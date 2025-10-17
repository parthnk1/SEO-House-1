'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { appsRankTrackingToolAction } from '@/app/actions';
import { type AppsRankTrackingToolOutput } from '@/ai/flows/schemas/apps-rank-tracking-tool';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Trophy, TrendingUp, LineChart } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const formSchema = z.object({
  appName: z.string().min(2, { message: 'Please enter an app name.' }),
  store: z.enum(['Google Play', 'Apple App Store'], {
    required_error: "You need to select an app store.",
  }),
  country: z.string().min(2, { message: 'Please enter a country.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function AppsRankTrackingTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AppsRankTrackingToolOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { appName: '', country: 'USA' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await appsRankTrackingToolAction(values);

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
        <CardTitle>Apps Rank Tracking Tool</CardTitle>
        <CardDescription>Track the simulated ranking of any app in the Google Play or Apple App Store.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="appName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'TikTok'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="store"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>App Store</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a store" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Google Play">Google Play</SelectItem>
                        <SelectItem value="Apple App Store">Apple App Store</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'USA'" {...field} />
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
              Track Rank
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Tracking app rank...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Rank for "{form.getValues('appName')}" in {form.getValues('country')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="text-center p-6">
                    <p className="text-sm font-medium text-muted-foreground">Current Rank</p>
                    <p className="text-6xl font-bold text-primary">#{result.rank}</p>
                    <p className="text-sm text-muted-foreground">in <span className="font-semibold">{result.category}</span></p>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Rank History (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={100}>
                            <BarChart data={result.rankHistory}>
                                <Tooltip
                                    cursor={{fill: 'hsl(var(--accent))'}}
                                    contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
                                />
                                <Bar dataKey="rank" fill="hsl(var(--primary))" name="Rank" />
                                <XAxis dataKey="date" hide />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
