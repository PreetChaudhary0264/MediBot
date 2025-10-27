import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-muted-foreground">404</span>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setLocation("/")} className="w-full" data-testid="button-home">
            <Home className="w-4 h-4 mr-2" aria-hidden="true" />
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
