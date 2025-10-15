'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateMetaTagsAction } from '@/app/actions';
import { type GenerateMetaTagsOutput } from '@/ai/flows/generate-meta-tags';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Wand2, Copy } from 'lucide-react';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL (e.g., https://example.com).' }),
});

type FormData = z.infer<typeof formSchema>;

export default function MetaTagGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateMetaTagsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await generateMetaTagsAction(values);

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

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${fieldName} has been copied.`,
    });
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>AI Meta Tag Generator</CardTitle>
        <CardDescription>Enter a website URL and our AI will generate optimized meta tags for you.</CardDescription>
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
                    <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-5 w-5" /> Generate
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
            <p className="mt-2 text-muted-foreground">Analyzing URL and generating tags...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in-50">
            <h3 className="text-xl font-semibold font-headline">Generated Meta Tags</h3>
            <div className="space-y-4">
              <ResultField label="Title" text={result.title} onCopy={copyToClipboard} />
              <ResultField label="Description" text={result.description} isTextarea onCopy={copyToClipboard} />
              <ResultField label="Keywords" text={result.keywords} onCopy={copyToClipboard} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function ResultField({ label, text, isTextarea = false, onCopy }: { label: string, text: string, isTextarea?: boolean, onCopy: (text: string, label: string) => void }) {
  return (
    <div>
      <Label className="font-semibold">{label}</Label>
      <div className="relative mt-1">
        <div className="w-full rounded-md border border-input bg-card/50 px-3 py-2 text-sm ring-offset-background min-h-[40px] flex items-center text-card-foreground">
            {text}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={() => onCopy(text, label)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
