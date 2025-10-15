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
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, Copy, KeyRound } from 'lucide-react';

const formSchema = z.object({
  length: z.number().min(4).max(128),
  includeUppercase: z.boolean(),
  includeLowercase: z.boolean(),
  includeNumbers: z.boolean(),
  includeSymbols: z.boolean(),
}).refine(data => data.includeUppercase || data.includeLowercase || data.includeNumbers || data.includeSymbols, {
  message: "At least one character type must be selected.",
  path: ["includeSymbols"],
});

type FormData = z.infer<typeof formSchema>;

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
    },
  });

  const generatePassword = (values: FormData) => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = values;
    
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charset = '';
    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };
  
  const onSubmit = (values: FormData) => {
    generatePassword(values);
  };
  
  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: "Password copied to clipboard!",
    });
  };
  
  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>Secure Password Generator</CardTitle>
        <CardDescription>Create strong, random passwords to protect your accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Input
            readOnly
            value={password}
            placeholder="Your generated password will appear here"
            className="pr-20 h-12 text-lg font-mono"
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex gap-1">
             <Button variant="ghost" size="icon" onClick={() => generatePassword(form.getValues())} disabled={!password}>
                <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!password}>
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Length: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={4}
                      max={128}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="includeUppercase"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Uppercase (A-Z)</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeLowercase"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Lowercase (a-z)</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeNumbers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Numbers (0-9)</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeSymbols"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Symbols (!@#$...)</FormLabel>
                  </FormItem>
                )}
              />
            </div>
             {form.formState.errors.includeSymbols && <FormMessage>{form.formState.errors.includeSymbols.message}</FormMessage>}

            <Button type="submit" className="w-full sm:w-auto">
              <KeyRound className="mr-2 h-5 w-5" />
              Generate Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
