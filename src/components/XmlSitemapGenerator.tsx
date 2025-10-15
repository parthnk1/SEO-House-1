'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { xmlSitemapGeneratorAction } from '@/app/actions';
import { type XmlSitemapGeneratorOutput } from '@/ai/flows/xml-sitemap-generator';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, FileCode2, Copy, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function XmlSitemapGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<XmlSitemapGeneratorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await xmlSitemapGeneratorAction(values);

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
        title: "Copied to clipboard!",
        description: "Sitemap content has been copied.",
    });
  };

  const downloadSitemap = (content: string) => {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>XML Sitemap Generator</CardTitle>
        <CardDescription>Generate an XML sitemap for your website to help search engines crawl your pages.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Website's Base URL</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <FileCode2 className="mr-2 h-5 w-5" /> Generate
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
            <p className="mt-2 text-muted-foreground">Generating your sitemap...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold font-headline">Generated Sitemap</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.sitemapContent)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button size="sm" onClick={() => downloadSitemap(result.sitemapContent)}>
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </div>
            </div>
             <Card>
                  <CardContent className="p-0">
                    <ScrollArea className="h-96 w-full rounded-md border bg-card p-4">
                      <pre className="text-xs text-muted-foreground">
                        <code>
                          {result.sitemapContent}
                        </code>
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
