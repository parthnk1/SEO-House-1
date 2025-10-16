'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { metaTagsAnalyzerAction } from '@/app/actions';
import { type MetaTagsAnalyzerOutput } from '@/ai/flows/schemas/meta-tags-analyzer';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Copy, CheckCircle, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function MetaTagsAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MetaTagsAnalyzerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await metaTagsAnalyzerAction(values);

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

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Meta Tags Analyzer</CardTitle>
        <CardDescription>Enter a URL to analyze its meta tags and see how they appear to search engines.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Analyze
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
            <p className="mt-2 text-muted-foreground">Analyzing meta tags...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Analysis for "{form.getValues('url')}"</h3>
            <div className="space-y-4">
              <ResultField label="Title" text={result.title} onCopy={copyToClipboard} />
              <ResultField label="Meta Description" text={result.description} onCopy={copyToClipboard} />
              <ResultField label="Meta Keywords" text={result.keywords} onCopy={copyToClipboard} />
              <ResultField label="Viewport" text={result.viewport} onCopy={copyToClipboard} />
              <ResultField label="Robots" text={result.robots} onCopy={copyToClipboard} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResultField({ label, text, onCopy }: { label: string, text?: string, onCopy: (text: string) => void }) {
    const hasContent = text && text.length > 0;
    
    return (
      <div>
        <Label className="font-semibold flex items-center gap-2">
            {hasContent ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
                <XCircle className="w-4 h-4 text-yellow-500" />
            )}
            {label}
        </Label>
        <div className="relative mt-1">
          <div className={cn(
            "w-full rounded-md border bg-card/50 px-3 py-2 text-sm ring-offset-background min-h-[40px] flex items-center",
            hasContent ? 'text-card-foreground border-input' : 'text-muted-foreground border-dashed'
          )}>
              {hasContent ? text : 'Not found'}
          </div>
          {hasContent && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => onCopy(text)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }
