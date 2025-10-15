'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { openGraphGeneratorAction } from '@/app/actions';
import { type OpenGraphGeneratorOutput } from '@/ai/flows/open-graph-generator';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  title: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function OpenGraphGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OpenGraphGeneratorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '', title: '', description: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await openGraphGeneratorAction(values);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  const generateHtml = () => {
    if (!result) return '';
    return `
<meta property="og:title" content="${result.ogTitle}" />
<meta property="og:type" content="${result.ogType}" />
<meta property="og:url" content="${result.ogUrl}" />
<meta property="og:description" content="${result.ogDescription}" />
<meta property="og:image" content="${result.ogImage}" />
    `.trim();
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>AI Open Graph Generator</CardTitle>
        <CardDescription>Generate Open Graph meta tags to control how your content appears on social media.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-website.com/page" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Custom Title (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Override the page title" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Custom Description (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Override the page description" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
              Generate Tags
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Generating Open Graph tags...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in-50">
            <h3 className="text-xl font-semibold font-headline">Generated Open Graph Tags</h3>
            <div className="relative">
                <pre className="p-4 rounded-md bg-card border text-sm overflow-x-auto">
                    <code className="text-card-foreground">
                        {generateHtml()}
                    </code>
                </pre>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground"
                    onClick={() => copyToClipboard(generateHtml())}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
