'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Expand } from 'lucide-react';

export default function WhatIsMyScreenResolution() {
  const [resolution, setResolution] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const updateResolution = () => {
      setResolution({
        width: window.screen.width,
        height: window.screen.height,
      });
    };

    updateResolution();
    window.addEventListener('resize', updateResolution);

    return () => {
      window.removeEventListener('resize', updateResolution);
    };
  }, []);

  return (
    <Card className="shadow-lg bg-background">
      <CardHeader>
        <CardTitle>What Is My Screen Resolution?</CardTitle>
        <CardDescription>View the current resolution of your screen below.</CardDescription>
      </CardHeader>
      <CardContent>
        {resolution ? (
          <Card className="text-center p-8 bg-primary/10">
            <div className="flex items-center justify-center gap-4">
                <Monitor className="w-12 h-12 text-primary" />
                <div>
                    <p className="text-5xl font-bold text-primary">{resolution.width}px</p>
                    <p className="text-muted-foreground">Width</p>
                </div>
                <Expand className="w-8 h-8 text-muted-foreground" />
                 <div>
                    <p className="text-5xl font-bold text-primary">{resolution.height}px</p>
                    <p className="text-muted-foreground">Height</p>
                </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Your screen resolution is {resolution.width} x {resolution.height} pixels.</p>
          </Card>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <p>Detecting screen resolution...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
