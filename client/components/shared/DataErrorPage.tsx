import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DataErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-zinc-100">
      <Card className="w-full max-w-md border-white/5 bg-black/20 text-center shadow-2xl backdrop-blur-md">
        <CardHeader className="items-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-xl">Unable to load game data</CardTitle>

            <p className="text-sm leading-relaxed text-zinc-500">
              We couldn&#39;t load your games and statistics right now. Please
              try again later.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-xs text-zinc-600">
            If the problem persists, please check your connection.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
