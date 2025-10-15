'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { findRelatedKeywordsAction } from '@/app/actions';
import { type FindRelatedKeywordsOutput } from '@/ai/flows/find-related-keywords';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Zap, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  keyword: z.string().min(2, { message: 'Please enter a keyword.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function RelatedKeywordsFinder() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindRelatedKeywordsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { keyword: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await findRelatedKeywordsAction(values);

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
            description: `Copied "${text}" to your clipboard.`,
        });
    };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Related Keywords Finder</CardTitle>
        <CardDescription>Enter a keyword to discover a list of semantically related keywords and concepts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Keyword</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 'link building'" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" /> Find Related
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
            <p className="mt-2 text-muted-foreground">Finding related keywords...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">Related Keywords for "{form.getValues('keyword')}"</h3>
            <div className="flex flex-wrap gap-2">
              {result.relatedKeywords.map((keyword, index) => (
                <div key={index} className="group relative">
                  <Badge variant="outline" className="text-base py-1 px-3 border-primary/30 bg-primary/10 text-primary-foreground hover:bg-primary/20 cursor-pointer">
                    {keyword}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-3 -right-3 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm"
                    onClick={() => copyToClipboard(keyword)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
