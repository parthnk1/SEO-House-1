'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from './ui/label';

export default function UrlEncoderDecoder() {
  const [inputText, setInputText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(inputText);
      setEncodedText(encoded);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Encoding Error",
        description: "Could not encode the provided text.",
      });
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(inputText);
      setDecodedText(decoded);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Decoding Error",
        description: "Could not decode the provided text. Make sure it's a valid encoded string.",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
    });
  };

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>URL Encoder & Decoder</CardTitle>
        <CardDescription>Encode or decode strings for use in URLs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="input-text">Text to Encode/Decode</Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text here, e.g., https://example.com/search?q=this is a test"
            rows={5}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleEncode} className="w-full">
            Encode
          </Button>
          <Button onClick={handleDecode} className="w-full">
            Decode
          </Button>
        </div>

        {(encodedText || decodedText) && (
        <div className="space-y-6 pt-4 animate-in fade-in-50">
            {encodedText && (
                <div>
                    <Label htmlFor="encoded-text">Encoded Text</Label>
                    <div className="relative">
                        <Textarea id="encoded-text" readOnly value={encodedText} rows={5} className="pr-12 bg-card" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground"
                            onClick={() => copyToClipboard(encodedText)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            {decodedText && (
                 <div>
                    <Label htmlFor="decoded-text">Decoded Text</Label>
                    <div className="relative">
                        <Textarea id="decoded-text" readOnly value={decodedText} rows={5} className="pr-12 bg-card" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground"
                            onClick={() => copyToClipboard(decodedText)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
        )}
      </CardContent>
    </Card>
  );
}

    