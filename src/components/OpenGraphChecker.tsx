'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { openGraphCheckerAction } from '@/app/actions';
import { type OpenGraphCheckerOutput } from '@/ai/flows/open-graph-checker';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, CheckCircle, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function OpenGraphChecker() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OpenGraphCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await openGraphCheckerAction(values);

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
  
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Open Graph Checker</CardTitle>
        <CardDescription>Enter a URL to see how it will be displayed when shared on social media.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Check OG Tags
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
            <p className="mt-2 text-muted-foreground">Checking Open Graph tags...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">Social Media Preview</h3>
             <Card className="max-w-xl mx-auto">
                <CardContent className="p-0">
                    {result.ogImage && (
                        <div className="relative aspect-video w-full overflow-hidden border-b">
                            <Image src={result.ogImage} alt={result.ogTitle || 'Open Graph Image'} layout="fill" objectFit="cover" />
                        </div>
                    )}
                    <div className="p-4 bg-card/50">
                        <p className="text-xs uppercase text-muted-foreground">{result.ogUrl ? getDomain(result.ogUrl) : ''}</p>
                        <h4 className="font-semibold mt-1">{result.ogTitle || 'No Title Found'}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{result.ogDescription || 'No description found.'}</p>
                    </div>
                </CardContent>
             </Card>

            <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold font-headline">Detected Tags</h3>
                <ResultField label="og:title" text={result.ogTitle} />
                <ResultField label="og:type" text={result.ogType} />
                <ResultField label="og:url" text={result.ogUrl} />
                <ResultField label="og:description" text={result.ogDescription} />
                <ResultField label="og:image" text={result.ogImage} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResultField({ label, text }: { label: string, text?: string }) {
    const hasContent = text && text.length > 0;
    
    return (
      <div className="flex items-start justify-between border-b pb-2">
        <div className="flex items-center gap-2">
            {hasContent ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
                <XCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="font-mono text-sm">{label}</span>
        </div>
        <p className={cn(
            "text-sm text-right break-all",
            hasContent ? 'text-foreground' : 'text-muted-foreground italic'
          )}>
              {hasContent ? text : 'Not found'}
        </p>
      </div>
    );
  }
