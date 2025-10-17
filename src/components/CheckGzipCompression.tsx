
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkGzipCompressionAction } from '@/app/actions';
import { CheckGzipCompressionInputSchema, type CheckGzipCompressionOutput } from '@/ai/flows/schemas/check-gzip-compression';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, CheckCircle, XCircle, FileArchive, ArrowDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = CheckGzipCompressionInputSchema;
type FormData = z.infer<typeof formSchema>;

export default function CheckGzipCompression() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckGzipCompressionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await checkGzipCompressionAction(values);

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
  
  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Check GZIP Compression</CardTitle>
        <CardDescription>Enter a URL to see if it's using GZIP compression to speed up your site.</CardDescription>
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
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                     <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" /> Check
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
            <p className="mt-2 text-muted-foreground">Checking for GZIP compression...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Result for "{form.getValues('url')}"
            </h3>
            
            {result.isGzipEnabled ? (
              <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 !text-green-500" />
                <AlertTitle>GZIP Compression is Enabled!</AlertTitle>
                <AlertDescription>
                  Your page size is reduced by approximately <strong>{result.compressionPercentage?.toFixed(2)}%</strong>.
                   <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{result.originalSize} KB</p>
                            <p className="text-xs text-muted-foreground">Original Size</p>
                        </div>
                        <div className="text-green-500">
                            <ArrowDown className="h-8 w-8 mx-auto" />
                        </div>
                        <div>
                             <p className="text-2xl font-bold">{result.compressedSize?.toFixed(2)} KB</p>
                            <p className="text-xs text-muted-foreground">Compressed Size</p>
                        </div>
                   </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>GZIP Compression is Not Enabled</AlertTitle>
                <AlertDescription>
                  Enabling GZIP can significantly improve your page load times by reducing the file size of your site.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
