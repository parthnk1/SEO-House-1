'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { onlinePingWebsiteToolAction } from '@/app/actions';
import { type OnlinePingWebsiteToolOutput } from '@/ai/flows/online-ping-website-tool';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Send, CheckCircle, Server } from 'lucide-react';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function OnlinePingWebsiteTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OnlinePingWebsiteToolOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await onlinePingWebsiteToolAction(values);

    if (response.success) {
      setResult(response.data);
       toast({
        title: "Ping Successful!",
        description: "Your website has been pinged to search engines.",
      });
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
        <CardTitle>Online Ping Website Tool</CardTitle>
        <CardDescription>Ping search engines like Google and Bing to notify them of your website's updates.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL to Ping</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" /> Ping Now
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
            <p className="mt-2 text-muted-foreground">Pinging search engines...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">Ping Results</h3>
             <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Search Engine</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Message</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.results.map((res, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <Server className="w-4 h-4 text-muted-foreground" />
                                {res.engine}
                            </TableCell>
                            <TableCell>
                                {res.success ? (
                                    <span className="flex items-center gap-1 text-green-500">
                                        <CheckCircle className="w-4 h-4" /> Success
                                    </span>
                                ) : (
                                    <span className="text-red-500">Failed</span>
                                )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{res.message}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
