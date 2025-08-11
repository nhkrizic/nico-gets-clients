import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowBanner(false);
    
    // Initialize Google Analytics if user accepts
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setShowBanner(false);
    
    // Disable Google Analytics if user declines
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="bg-card/95 backdrop-blur-sm border shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cookie className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Cookie Notice</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use Google Analytics to understand how visitors interact with our website. 
            This helps us improve our services and provide better user experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleAccept}
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Accept Analytics
            </Button>
            <Button 
              onClick={handleDecline}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Decline
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            You can change your preferences anytime by clearing your browser data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;