'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { whoisLookupAction } from '@/app/actions';
import { type WhoisLookupOutput } from '@/ai/flows/whois-lookup';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Info, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  domain: z.string().refine(val => /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/.test(val), {
    message: 'Please enter a valid domain name (e.g., example.com).',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function WhoisLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WhoisLookupOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { domain: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await whoisLookupAction(values);

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
        <CardTitle>Whois Lookup</CardTitle>
        <CardDescription>Enter a domain to get its WHOIS information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Name</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Lookup
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
            <p className="mt-2 text-muted-foreground">Performing WHOIS lookup...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              WHOIS Record for "{form.getValues('domain')}"
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className='text-lg'>Key Information</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Registrar:</span>
                            <span className="font-semibold">{result.registrar}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Registered:</span>
                            <span className="font-semibold">{new Date(result.registrationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Expires:</span>
                            <span className="font-semibold">{new Date(result.expirationDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-muted-foreground">Updated:</span>
                            <span className="font-semibold">{new Date(result.updatedDate).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className='text-lg'>Name Servers</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {result.nameServers.map((ns, i) => <li key={i} className="font-semibold text-sm">{ns}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Raw WHOIS Data</CardTitle>
                     <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.rawText)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-72 w-full rounded-md border bg-card p-4 font-mono text-xs">
                       {result.rawText}
                    </ScrollArea>
                </CardContent>
            </Card>

          </div>
        )}
      </CardContent>
    </Card>
  );
}
