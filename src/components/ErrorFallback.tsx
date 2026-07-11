import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@alawein/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorFallbackProps {
  error?: Error;
  retry: () => void;
}

export const DefaultErrorFallback = ({ error, retry }: ErrorFallbackProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6" role="alert">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {error && (
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">Error details</summary>
              <pre className="mt-2 p-2 bg-muted rounded text-left whitespace-pre-wrap text-xs">
                {error.message}
              </pre>
            </details>
          )}
          <Button onClick={retry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
