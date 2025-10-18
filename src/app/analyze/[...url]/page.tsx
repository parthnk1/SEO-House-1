
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { websiteAnalysisAction } from '@/app/actions';
import { type WebsiteAnalysisOutput } from '@/ai/flows/schemas/website-analysis';
import { type SpeedMetric } from '@/ai/flows/schemas/page-speed-test';
import { type SeoFactor } from '@/ai/flows/schemas/website-seo-score-checker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ShieldCheck, BarChart, Link as LinkIcon, FileText, Smartphone, Clock, CheckCircle, AlertCircle, XCircle, ExternalLink, Shield, TrendingUp, Lightbulb, Zap, Wrench } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const getStatusIcon = (status: 'Good' | 'Needs Improvement' | 'Poor') => {
  switch (status) {
    case 'Good':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'Needs Improvement':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'Poor':
      return <XCircle className="w-5 h-5 text-red-500" />;
  }
};

const getPriorityBadge = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
        case 'High':
            return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/50">High Priority</Badge>;
        case 'Medium':
            return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">Medium Priority</Badge>;
        case 'Low':
            return <Badge variant="secondary">Low Priority</Badge>;
    }
};

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
        <p className="text-muted-foreground">This may take a moment as we perform a comprehensive SEO analysis.</p>
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

  const { seoScore, metaTags, backlinks, domainAuthority, pageSpeed, improvements } = result;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Full SEO Report for</h1>
        <p className="mt-2 text-lg text-muted-foreground break-all">{url}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Overall SEO Score</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <div className="text-7xl font-bold text-primary">{seoScore.overallScore}</div>
                    <p className="text-muted-foreground">out of 100</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/> Domain Authority</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-4xl font-bold">{domainAuthority.domainAuthority}</p>
                <Progress value={domainAuthority.domainAuthority} className="mt-2 h-2"/>
                <div className="text-sm mt-4">
                    <p><strong>{domainAuthority.linkingDomains.toLocaleString()}</strong> Linking Domains</p>
                    <p><strong>{domainAuthority.totalBacklinks.toLocaleString()}</strong> Total Backlinks</p>
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Page Speed</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{pageSpeed.performanceScore} <span className="text-lg font-normal text-muted-foreground">/ 100</span></p>
                    <p className="text-sm text-muted-foreground">Performance Score</p>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5" /> SEO Improvement Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {improvements.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div className='flex-grow'>
                            <p className="font-semibold">{item.suggestion}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                {getPriorityBadge(item.priority)}
                                <Badge variant="secondary">{item.category}</Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
           </Card>

          <Card>
            <CardHeader>
                <CardTitle>SEO Factors Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {seoScore.analysis.map((factor: SeoFactor, index: number) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm flex items-center gap-2">
                                {getStatusIcon(factor.status)}
                                {factor.factor}
                            </span>
                            <span className="text-sm font-semibold">{factor.score}/100</span>
                        </div>
                        <Progress value={factor.score} className="h-2" />
                    </div>
                ))}
            </CardContent>
           </Card>

           <Card>
            <CardHeader>
                <CardTitle>Meta Tags Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p><strong>Title:</strong> {metaTags.title}</p>
                <p><strong>Description:</strong> {metaTags.description}</p>
                <p><strong>Keywords:</strong> {metaTags.keywords || 'Not found'}</p>
                <p><strong>Viewport:</strong> {metaTags.viewport || 'Not found'}</p>
                <p><strong>Robots:</strong> {metaTags.robots || 'Not found'}</p>
            </CardContent>
           </Card>

           <Card>
            <CardHeader>
                <CardTitle>Page Speed Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {pageSpeed.metrics.map((metric: SpeedMetric, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-background">
                        <span className="font-medium text-sm flex items-center gap-2">
                            {getStatusIcon(metric.rating)}
                            {metric.name}
                        </span>
                        <span className="text-sm font-bold">{metric.value}</span>
                    </div>
                ))}
            </CardContent>
           </Card>
        </div>
      </div>
      
       <div className="mt-8">
         <Card>
            <CardHeader>
                <CardTitle>Top Backlinks</CardTitle>
                <CardDescription>A sample of backlinks pointing to this website.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Source URL</TableHead>
                          <TableHead>Anchor Text</TableHead>
                          <TableHead className="text-right">Domain Authority</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {backlinks.backlinks.map((backlink, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link href={backlink.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors group">
                                    <span className="truncate">{backlink.sourceUrl}</span>
                                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </Link>
                            </TableCell>
                            <TableCell className="font-medium text-muted-foreground">"{backlink.anchorText}"</TableCell>
                            <TableCell className="text-right font-medium flex justify-end items-center gap-2">
                                <Shield className="w-4 h-4 text-muted-foreground" />
                                {backlink.domainAuthority}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>
       </div>
    </div>
  );
}
