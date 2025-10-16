import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send } from 'lucide-react';
import type { Metadata } from 'next';
import AdsensePlaceholder from '@/components/AdsensePlaceholder';

export const metadata: Metadata = {
  title: 'Contact Us | SEO Powerhouse',
  description: 'Get in touch with the SEO Powerhouse team.',
};

export default function ContactPage() {
  const email = "placeholder@gmail.com";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We'd love to hear from you. Reach out with any questions or feedback.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Contact via Email</CardTitle>
          <CardDescription>
            For all inquiries, please send us an email. We typically respond within 24-48 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-2xl font-semibold font-mono tracking-wider text-accent bg-accent/10 py-3 px-4 rounded-md">
            {email}
          </p>
          <Button asChild size="lg" className="mt-6">
            <a href={`mailto:${email}`}>
              <Send className="mr-2 h-5 w-5" />
              Send Email
            </a>
          </Button>
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-center">
        <AdsensePlaceholder format="large-rectangle" />
      </div>
    </div>
  );
}
