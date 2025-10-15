'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { spiderSimulatorAction } from '@/app/actions';
import { type SpiderSimulatorOutput } from '@/ai/flows/spider-simulator';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Bot, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function SpiderSimulator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SpiderSimulatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await spiderSimulatorAction(values);

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
        <CardTitle>Spider Simulator</CardTitle>
        <CardDescription>See how a search engine spider views your website.</CardDescription>
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
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Bot className="mr-2 h-5 w-5" /> Simulate
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
            <p className="mt-2 text-muted-foreground">Simulating spider view...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Spider View for "{form.getValues('url')}"
            </h3>
            
            <Card>
                <CardHeader>
                    <CardTitle>Page Content</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                    <h1 className="text-xl font-bold">{result.title}</h1>
                    <p>{result.textContent}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Links Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {result.links.map((link, index) => (
                            <li key={index} className="flex items-center gap-3 p-2 bg-card rounded-md">
                                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 group">
                                        {link.url} <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                    </Link>
                                    <p className="text-xs text-muted-foreground">Anchor Text: "{link.anchorText}"</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
