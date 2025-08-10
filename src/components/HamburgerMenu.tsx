import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu, X, User, MessageCircle, Calendar, BookOpen, CreditCard, Shield, LogIn, UserPlus } from "lucide-react";

interface HamburgerMenuProps {
  onLoginClick: () => void;
  onChatClick: () => void;
  onBlogClick: () => void;
  onBookingClick: () => void;
  onPaymentClick: () => void;
}

const HamburgerMenu = ({ onLoginClick, onChatClick, onBlogClick, onBookingClick, onPaymentClick }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 text-foreground fixed top-4 right-4 z-50 bg-card/80 backdrop-blur-sm border border-border shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        className="w-[300px] bg-gradient-to-br from-card to-card/80 backdrop-blur-xl border-border shadow-intense"
      >
        <div className="flex flex-col h-full">
          <div className="py-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Client Portal
            </h2>
            <p className="text-muted-foreground mt-2">Access your services and support</p>
          </div>
          
          <Separator className="bg-border/50" />
          
          <div className="flex-1 py-6 space-y-2">
            {/* Authentication Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Account
              </h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => handleMenuClick(onLoginClick)}
                >
                  <LogIn className="mr-3 h-5 w-5" />
                  Client Login
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  <UserPlus className="mr-3 h-5 w-5" />
                  Register Account
                </Button>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Support & Services */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-4">
                Support & Services
              </h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => handleMenuClick(onChatClick)}
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Live Chat Support
                  <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    AI Assistant
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-accent/10 hover:text-accent transition-colors"
                  onClick={() => handleMenuClick(onBookingClick)}
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  Book Appointment
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => handleMenuClick(onPaymentClick)}
                >
                  <CreditCard className="mr-3 h-5 w-5" />
                  Payment & Billing
                  <span className="ml-auto text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                    Secure
                  </span>
                </Button>
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-4">
                Resources
              </h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => handleMenuClick(onBlogClick)}
                >
                  <BookOpen className="mr-3 h-5 w-5" />
                  Tech Blog & Updates
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Security Center
                </Button>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />
          
          {/* Footer */}
          <div className="py-4 space-y-3">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">24/7 Support Available</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Professional IT Solutions
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;