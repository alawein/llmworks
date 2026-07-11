import { Card } from "@alawein/ui";
import { memo } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';


const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: July 11, 2026</p>

          <Card className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Current Processing Model</h2>
              <p className="text-muted-foreground">
                LLMWorks currently provides a browser UI for scripted demos, sample dashboards,
                and benchmark run tracking. It does not currently run provider-backed evaluations,
                call model-provider APIs, or calculate benchmark scores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data We Collect</h2>
              <p className="text-muted-foreground mb-3">
                We collect minimal data to improve the platform:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Supabase authentication data when you sign in</li>
                <li>Benchmark run records created through the benchmark queue UI</li>
                <li>Optional diagnostics such as error and performance signals when enabled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Provider Keys and Model Data</h2>
              <p className="text-muted-foreground">
                Do not enter provider API keys, private prompts, or sensitive model outputs into
                the current demo surfaces. This release has no provider-key encryption path and no
                provider-backed scoring flow. Future provider integrations must document and test
                their storage, encryption, and data-retention behavior before launch.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground">
                The app uses Supabase for authentication and persistence and Vercel for hosting.
                Current arena, comparison, and dashboard surfaces are scripted or illustrative
                unless a screen explicitly labels data as measured provider output.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
              <p className="text-muted-foreground">
                Questions about this privacy policy? Open an issue on our{' '}
                <a
                  href="https://github.com/alawein/llmworks"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
                .
              </p>
            </section>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default memo(PrivacyPage);
