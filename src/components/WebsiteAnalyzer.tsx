
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Search } from 'lucide-react';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function WebsiteAnalyzer() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = (values: FormData) => {
    const encodedUrl = encodeURIComponent(values.url);
    router.push(`/analyze/${encodedUrl}`);
  };

  return (
    <Card className="shadow-lg bg-background border-primary border-2">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Website Analyzer</CardTitle>
        <CardDescription>Enter a URL to get a complete SEO analysis of your website.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <div className="flex w-full max-w-2xl mx-auto items-center space-x-2">
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://your-website.com" 
                        {...field}
                        className="h-12 text-base"
                      />
                    </FormControl>
                    <Button type="submit" size="lg" className="h-12">
                      <Search className="mr-2 h-5 w-5" /> Analyze
                    </Button>
                  </div>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
