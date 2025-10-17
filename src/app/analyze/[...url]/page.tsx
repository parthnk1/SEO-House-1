
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { websiteAnalysisAction } from '@/app/actions';
import { type WebsiteAnalysisOutput } from '@/ai/flows/website-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, BarChart, Link, FileText, Smartphone, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function AnalyzePage() {
  const params = useParams();
  const [result, setResult] = useState<WebsiteAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const encodedUrl = Array.isArray(params.url) ? params.url.join('/') : params.url;
  const url = decodeURIComponent(encodedUrl || '');

  useEffect(() => {
    if (url) {
      const runAnalysis = async () => {
        setLoading(true);
        setError(null);
        const response = await websiteAnalysisAction({ url });
        if (response.success) {
          setResult(response.data);
        } else {
          setError(response.error);
        }
        setLoading(false);
      };
      runAnalysis();
    }
  }, [url]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 text-center">
        <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Analyzing {url}...</h1>
        <p className="text-muted-foreground">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-2xl font-bold text-destructive">Analysis Failed</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">SEO Analysis for</h1>
        <p className="mt-2 text-lg text-muted-foreground break-all">{url}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
               <div className="text-7xl font-bold text-primary">{result.seoScore.overallScore}</div>
               <p className="text-muted-foreground">out of 100</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <p><strong>Title:</strong> {result.metaTags.title}</p>
                <p><strong>Description:</strong> {result.metaTags.description}</p>
            </CardContent>
           </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/> Domain Authority</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{result.domainAuthority.domainAuthority}</p>
              <Progress value={result.domainAuthority.domainAuthority} className="mt-2 h-2"/>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Link className="w-5 h-5"/> Backlinks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{result.backlinks.totalBacklinks.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{result.backlinks.referringDomains.toLocaleString()} referring domains</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Page Speed</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-3xl font-bold">{result.pageSpeed.performanceScore}</p>
               <p className="text-sm text-muted-foreground">Performance Score</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
