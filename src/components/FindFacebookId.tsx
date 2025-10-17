
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { findFacebookIdAction } from '@/app/actions';
import { FindFacebookIdInputSchema, type FindFacebookIdOutput } from '@/ai/flows/schemas/find-facebook-id';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = FindFacebookIdInputSchema;
type FormData = z.infer<typeof formSchema>;

export default function FindFacebookId() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FindFacebookIdOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { profileUrl: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await findFacebookIdAction(values);

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
        <CardTitle>Find Facebook ID</CardTitle>
        <CardDescription>Enter a Facebook profile URL to find its numeric ID.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="profileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Profile URL</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://www.facebook.com/zuck" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Find ID
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
            <p className="mt-2 text-muted-foreground">Finding Facebook ID...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-4">
            <h3 className="text-xl font-semibold font-headline">
              Result for "{form.getValues('profileUrl')}"
            </h3>
            
            <Alert>
                <AlertTitle>Facebook ID Found</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                    <span className="text-lg font-mono font-bold text-primary">{result.facebookId}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result.facebookId)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </AlertDescription>
            </Alert>
            <p className="text-xs text-muted-foreground">Note: This is a simulated ID for demonstration purposes.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
