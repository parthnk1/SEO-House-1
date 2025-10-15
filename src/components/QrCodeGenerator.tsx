'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { QrCode, Download, RefreshCw } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const formSchema = z.object({
  text: z.string().min(1, { message: 'Please enter some text or a URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function QrCodeGenerator() {
  const [qrValue, setQrValue] = useState<string>('');
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  const onSubmit = (values: FormData) => {
    setQrValue(values.text);
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
        const canvas = qrCodeRef.current.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast({
                title: "QR Code Downloaded!",
            });
        }
    }
  };
  
  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>QR Code Generator</CardTitle>
        <CardDescription>Enter any text or URL to generate a QR code instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text or URL</FormLabel>
                   <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                     <Button type="submit" className="min-w-[150px]">
                        <QrCode className="mr-2 h-5 w-5" /> Generate
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        {qrValue && (
          <div className="mt-8 animate-in fade-in-50 space-y-6 flex flex-col items-center">
            <div ref={qrCodeRef} className="p-4 bg-white rounded-lg inline-block">
                <QRCodeCanvas
                    value={qrValue}
                    size={256}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                />
            </div>
            
            <div className="flex gap-4">
                <Button onClick={downloadQRCode}>
                    <Download className="mr-2 h-5 w-5" /> Download QR Code
                </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
