'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileCog, Copy } from 'lucide-react';
import { Label } from './ui/label';

const formSchema = z.object({
  redirectType: z.string(),
  oldUrl: z.string().url(),
  newUrl: z.string().url(),
});

type FormData = z.infer<typeof formSchema>;

export default function HtaccessRedirectGenerator() {
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      redirectType: '301',
      oldUrl: '',
      newUrl: '',
    },
  });

  const onSubmit = (values: FormData) => {
    const { redirectType, oldUrl, newUrl } = values;
    const oldPath = new URL(oldUrl).pathname;
    
    let generatedCode = '';
    if (redirectType === '301') {
      generatedCode = `Redirect 301 ${oldPath} ${newUrl}`;
    } else if (redirectType === '302') {
      generatedCode = `Redirect 302 ${oldPath} ${newUrl}`;
    } else if (redirectType === 'wildcard') {
      const oldDomain = new URL(oldUrl).hostname;
      const newDomain = new URL(newUrl).hostname;
      generatedCode = `RewriteEngine on
RewriteCond %{HTTP_HOST} ^${oldDomain}$ [NC,OR]
RewriteCond %{HTTP_HOST} ^www.${oldDomain}$ [NC]
RewriteRule ^(.*)$ http://${newDomain}/$1 [L,R=301,NC]`;
    }
    setResult(generatedCode);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied to clipboard!",
    });
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>.htaccess Redirect Generator</CardTitle>
        <CardDescription>Generate code for permanent (301), temporary (302), or wildcard redirects.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="redirectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redirect Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select redirect type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="301">301 Permanent Redirect</SelectItem>
                      <SelectItem value="302">302 Temporary Redirect</SelectItem>
                      <SelectItem value="wildcard">Wildcard (Domain) Redirect</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oldUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/old-page" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/new-page" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <FileCog className="mr-2 h-5 w-5" /> Generate Code
            </Button>
          </form>
        </Form>

        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in-50">
            <h3 className="text-xl font-semibold font-headline">Generated .htaccess Code</h3>
            <div className="relative">
                <pre className="p-4 rounded-md bg-card border text-sm overflow-x-auto">
                    <code className="text-card-foreground">
                        {result}
                    </code>
                </pre>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground"
                    onClick={copyToClipboard}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
             <p className="text-sm text-muted-foreground">Add this code to the .htaccess file in your website's root directory.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}