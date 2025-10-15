'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { alexaRankComparisonAction } from '@/app/actions';
import { type AlexaRankComparisonOutput } from '@/ai/flows/alexa-rank-comparison';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, Shuffle, Plus, Trash2, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const formSchema = z.object({
  domains: z.array(z.object({
    value: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
        message: 'Invalid domain format.',
    }),
  })).min(1, 'Please add at least one domain.'),
});

type FormData = z.infer<typeof formSchema>;

export default function AlexaRankComparison() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AlexaRankComparisonOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domains: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "domains"
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const domains = values.domains.map(d => d.value);
    const response = await alexaRankComparisonAction({ domains });

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
        <CardTitle>Alexa Rank Comparison</CardTitle>
        <CardDescription>Compare the simulated Alexa Rank of multiple websites side-by-side.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`domains.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder={`domain-${index + 1}.com`} {...field} />
                        </FormControl>
                        {fields.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-4">
                 <Button type="button" variant="outline" onClick={() => append({ value: '' })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Domain
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Shuffle className="mr-2 h-5 w-5" />
                    )}
                    Compare Ranks
                </Button>
            </div>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Comparing ranks...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Rank Comparison Results</h3>
            
            <Card>
                <CardContent className="pt-6">
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={result.results} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 'dataMax + 1000']} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
                            <YAxis dataKey="domain" type="category" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--accent))' }}
                                content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Domain
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {payload[0].payload.domain}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Rank
                                            </span>
                                            <span className="font-bold">
                                                {payload[0].value?.toLocaleString()}
                                            </span>
                                        </div>
                                        </div>
                                    </div>
                                    )
                                }

                                return null
                                }}
                            />
                            <Legend />
                            <Bar dataKey="rank" name="Alexa Rank" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-3">
                        {result.results.map((res, index) => (
                            <li key={res.domain} className={cn(
                                "flex items-center justify-between p-3 rounded-md",
                                index === 0 ? "bg-yellow-500/10 border border-yellow-500/50" : "bg-card"
                            )}>
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "flex items-center justify-center w-8 h-8 rounded-full font-bold",
                                        index === 0 ? "bg-yellow-500 text-white" : index === 1 ? "bg-gray-400 text-white" : index === 2 ? "bg-orange-700 text-white" : "bg-muted text-muted-foreground"
                                    )}>{index + 1}</span>
                                    <span className="font-medium">{res.domain}</span>
                                </div>
                                <span className="font-bold text-lg text-primary">{res.rank.toLocaleString()}</span>
                            </li>
                        ))}
                    </ol>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
