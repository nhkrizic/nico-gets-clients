import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Shield, Check, Star, Clock, Euro } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  {
    id: "consultation",
    name: "IT Consultation",
    price: 100,
    duration: "1 hour",
    description: "Professional assessment and recommendations",
    popular: false
  },
  {
    id: "repair",
    name: "Computer Repair",
    price: 120,
    duration: "1-2 hours",
    description: "Hardware diagnosis and repair service",
    popular: true
  },
  {
    id: "web-basic",
    name: "Basic Website",
    price: 800,
    duration: "1-2 weeks",
    description: "Professional business website with up to 5 pages",
    popular: false
  },
  {
    id: "web-premium",
    name: "Premium Website",
    price: 1500,
    duration: "2-3 weeks",
    description: "Advanced website with custom features and CMS",
    popular: true
  }
];

const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const { toast } = useToast();

  const handlePayment = async (method: 'card' | 'paypal') => {
    if (!selectedService) {
      toast({
        title: "Please select a service",
        description: "Choose a service before proceeding to payment.",
        variant: "destructive",
      });
      return;
    }

    const service = services.find(s => s.id === selectedService);
    
    // Connect to your backend payment API
    if (method === 'card') {
      // Redirect to Stripe or your payment processor
      toast({
        title: "Redirecting to Secure Payment",
        description: `Processing CHF ${service?.price} payment via credit card...`,
      });
      
      // Example: window.open('your-stripe-checkout-url', '_blank');
    } else {
      // Redirect to PayPal
      toast({
        title: "Redirecting to PayPal",
        description: `Processing CHF ${service?.price} payment via PayPal...`,
      });
      
      // Example: window.open('your-paypal-checkout-url', '_blank');
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-card to-card/90 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Choose your service and preferred payment method
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="services">Select Service</TabsTrigger>
            <TabsTrigger value="payment" disabled={!selectedService}>
              Payment Method
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Professional IT Services</h3>
              <div className="grid gap-4">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedService === service.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/30'
                    } ${service.popular ? 'ring-1 ring-accent/30' : ''}`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{service.name}</h4>
                            {service.popular && (
                              <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground space-x-3">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {service.duration}
                            </span>
                            <span className="flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              Swiss Quality
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">CHF {service.price}</p>
                          <p className="text-xs text-muted-foreground">One-time payment</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 mt-6">
            {selectedServiceData && (
              <Card className="bg-primary/5 border-primary/20 mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{selectedServiceData.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedServiceData.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">CHF {selectedServiceData.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
              <div className="space-y-3">
                {/* Credit Card */}
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'card'
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Credit/Debit Card</h4>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Shield className="w-3 h-3 mr-1" />
                          Secure
                        </Badge>
                        {paymentMethod === 'card' && <Check className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PayPal */}
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'paypal'
                      ? 'ring-2 ring-accent bg-accent/5'
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">PayPal</h4>
                          <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Instant
                        </Badge>
                        {paymentMethod === 'paypal' && <Check className="h-5 w-5 text-accent" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment Summary */}
            <Card className="bg-gradient-to-r from-muted/50 to-muted/30 border-border">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Service</span>
                    <span>CHF {selectedServiceData?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (8.1%)</span>
                    <span>CHF {selectedServiceData ? Math.round(selectedServiceData.price * 0.081) : 0}</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">
                        CHF {selectedServiceData ? selectedServiceData.price + Math.round(selectedServiceData.price * 0.081) : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Buttons */}
            <div className="space-y-3 pt-4">
              {paymentMethod === 'card' ? (
                <Button
                  onClick={() => handlePayment('card')}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Pay with Credit Card
                </Button>
              ) : (
                <Button
                  onClick={() => handlePayment('paypal')}
                  className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Pay with PayPal
                </Button>
              )}

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  <Shield className="inline w-3 h-3 mr-1" />
                  256-bit SSL encryption • Secure payment processing
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;