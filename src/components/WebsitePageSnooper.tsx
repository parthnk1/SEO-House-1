'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { websitePageSnooperAction } from '@/app/actions';
import { type WebsitePageSnooperOutput } from '@/ai/flows/website-page-snooper';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Eye, Copy, Code2, FileTerminal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function WebsitePageSnooper() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebsitePageSnooperOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await websitePageSnooperAction(values);

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
        });
    };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Website Page Snooper</CardTitle>
        <CardDescription>View the HTML source code and HTTP headers of any webpage.</CardDescription>
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
                          <Eye className="mr-2 h-5 w-5" /> Snoop Page
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
            <p className="mt-2 text-muted-foreground">Snooping on the page...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Snoop Results for "{form.getValues('url')}"
            </h3>
            
            <Tabs defaultValue="source-code">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="source-code"><Code2 className="mr-2 h-4 w-4" />Source Code</TabsTrigger>
                <TabsTrigger value="headers"><FileTerminal className="mr-2 h-4 w-4" />HTTP Headers</TabsTrigger>
              </TabsList>
              <TabsContent value="source-code">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>HTML Source Code</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.sourceCode)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full rounded-md border bg-card p-4">
                      <pre className="text-xs text-muted-foreground">
                        <code>
                          {result.sourceCode}
                        </code>
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="headers">
                 <Card>
                    <CardHeader>
                        <CardTitle>HTTP Response Headers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Header</TableHead>
                                    <TableHead>Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.headers.map((header, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{header.key}</TableCell>
                                        <TableCell className="text-muted-foreground">{header.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
