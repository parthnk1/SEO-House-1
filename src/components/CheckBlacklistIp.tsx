
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkBlacklistIpAction } from '@/app/actions';
import { CheckBlacklistIpInputSchema, type CheckBlacklistIpOutput } from '@/ai/flows/schemas/check-blacklist-ip';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, ShieldCheck, ShieldAlert, List } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = CheckBlacklistIpInputSchema;
type FormData = z.infer<typeof formSchema>;

export default function CheckBlacklistIp() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckBlacklistIpOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { ipAddress: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await checkBlacklistIpAction(values);

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
        <CardTitle>Check Blacklist IP</CardTitle>
        <CardDescription>Check if an IP address is on any known spam or malicious IP blacklists.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="e.g., 8.8.8.8" {...field} />
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
            <p className="mt-2 text-muted-foreground">Checking blacklists...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Result for {form.getValues('ipAddress')}
            </h3>
            
            {result.isBlacklisted ? (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>IP is Blacklisted!</AlertTitle>
                <AlertDescription>
                  This IP address was found on the following {result.blacklists.length} blacklist(s):
                  <ul className="mt-2 list-disc pl-5">
                    {result.blacklists.map((list, index) => (
                      <li key={index}>{list}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-700 dark:text-green-400">
                <ShieldCheck className="h-4 w-4 !text-green-500" />
                <AlertTitle>IP is Not Blacklisted</AlertTitle>
                <AlertDescription>
                  This IP address was not found on any of the checked blacklists.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
