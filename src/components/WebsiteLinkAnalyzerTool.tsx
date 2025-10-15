'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { websiteLinkAnalyzerToolAction } from '@/app/actions';
import { type WebsiteLinkAnalyzerToolOutput } from '@/ai/flows/website-link-analyzer-tool';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Link as LinkIcon, ExternalLink, ArrowRightLeft, ListTree, Check, X } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function WebsiteLinkAnalyzerTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WebsiteLinkAnalyzerToolOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: '' },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setResult(null);

    const response = await websiteLinkAnalyzerToolAction(values);

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
        <CardTitle>Website Link Analyzer</CardTitle>
        <CardDescription>Enter a URL to get a detailed analysis of its link profile.</CardDescription>
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
                          <Search className="mr-2 h-5 w-5" /> Analyze Links
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
            <p className="mt-2 text-muted-foreground">Analyzing links on the page...</p>
          </div>
        )}

        {result && (
          <div className="mt-8 animate-in fade-in-50 space-y-6">
            <h3 className="text-xl font-semibold font-headline">
              Link Analysis for "{form.getValues('url')}"
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{result.totalLinks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Internal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{result.internalLinks}</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">External</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{result.externalLinks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-500">DoFollow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{result.dofollowLinks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-500">NoFollow</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{result.nofollowLinks}</p>
                </CardContent>
              </Card>
            </div>
            
            {result.links.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Sampled Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Link URL & Anchor Text</TableHead>
                                <TableHead className="text-center">Type</TableHead>
                                <TableHead className="text-center">Follow</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {result.links.map((link, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Link href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group text-sm truncate">
                                                <span className="truncate font-medium">{link.url}</span>
                                                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                                            </Link>
                                            <p className="text-xs text-muted-foreground truncate">"{link.anchorText}"</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={link.type === 'Internal' ? 'secondary' : 'outline'}>{link.type}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {link.followType === 'dofollow' ? (
                                                <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10">
                                                    <Check className="mr-1 h-3 w-3" /> DoFollow
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-red-500 text-red-500 bg-red-500/10">
                                                    <X className="mr-1 h-3 w-3" /> NoFollow
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  );
}
