import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  { id: "web-dev", name: "Web Development", duration: "2-3 hours", price: "From CHF 150/hour" },
  { id: "it-repair", name: "Computer Repair", duration: "1-2 hours", price: "From CHF 120" },
  { id: "network", name: "Network Setup", duration: "2-4 hours", price: "From CHF 200" },
  { id: "consultation", name: "IT Consultation", duration: "1 hour", price: "CHF 100" },
  { id: "maintenance", name: "System Maintenance", duration: "1-3 hours", price: "From CHF 80/hour" }
];

const timeSlots = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
];

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    service: '',
    date: '',
    time: '',
    type: 'remote', // remote or onsite
    name: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Connect to your SQL Server backend API for booking
    try {
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(booking)
      // });
      
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been scheduled. You'll receive a confirmation email shortly.",
      });
      
      setStep(4); // Success step
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  const selectedService = services.find(s => s.id === booking.service);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-card to-card/90 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule professional IT services with Swiss precision
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= stepNumber 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Select Service</Label>
              <p className="text-sm text-muted-foreground mb-4">Choose the service you need</p>
            </div>
            
            <div className="space-y-3">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    booking.service === service.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => setBooking(prev => ({ ...prev, service: service.id }))}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{service.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <Label className="text-base font-semibold">Appointment Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    booking.type === 'remote' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/30'
                  }`}
                  onClick={() => setBooking(prev => ({ ...prev, type: 'remote' }))}
                >
                  <CardContent className="p-3 text-center">
                    <Phone className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold">Remote</p>
                    <p className="text-xs text-muted-foreground">Video call/Phone</p>
                  </CardContent>
                </Card>
                
                <Card
                  className={`cursor-pointer transition-all duration-200 ${
                    booking.type === 'onsite' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/30'
                  }`}
                  onClick={() => setBooking(prev => ({ ...prev, type: 'onsite' }))}
                >
                  <CardContent className="p-3 text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="font-semibold">On-site</p>
                    <p className="text-xs text-muted-foreground">At your location</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Button 
              onClick={handleNext}
              disabled={!booking.service}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              Continue to Date & Time
            </Button>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Schedule Appointment</Label>
              <p className="text-sm text-muted-foreground mb-4">Choose your preferred date and time</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={booking.date}
                  onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-background/50 border-border focus:border-primary"
                />
              </div>

              <div>
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={booking.time === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBooking(prev => ({ ...prev, time }))}
                      className={booking.time === time ? "bg-primary" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedService && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-3">
                    <h4 className="font-semibold text-sm">{selectedService.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedService.duration} • {selectedService.price}
                    </p>
                    <p className="text-xs text-primary mt-1">
                      {booking.type === 'onsite' ? 'On-site visit' : 'Remote consultation'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!booking.date || !booking.time}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              >
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Contact Information</Label>
              <p className="text-sm text-muted-foreground mb-4">We'll use this to confirm your appointment</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={booking.name}
                    onChange={(e) => setBooking(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="bg-background/50 border-border focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={booking.phone}
                    onChange={(e) => setBooking(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+41 76 123 4567"
                    className="bg-background/50 border-border focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={booking.email}
                  onChange={(e) => setBooking(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="bg-background/50 border-border focus:border-primary"
                />
              </div>

              {booking.type === 'onsite' && (
                <div>
                  <Label htmlFor="address">Service Address *</Label>
                  <Textarea
                    id="address"
                    value={booking.address}
                    onChange={(e) => setBooking(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address where service is needed"
                    className="bg-background/50 border-border focus:border-primary"
                    rows={3}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  value={booking.description}
                  onChange={(e) => setBooking(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue or specific requirements..."
                  className="bg-background/50 border-border focus:border-primary"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!booking.name || !booking.email || !booking.phone || (booking.type === 'onsite' && !booking.address)}
                className="flex-1 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Appointment Confirmed!</h3>
              <p className="text-muted-foreground mt-2">
                Your appointment for {selectedService?.name} has been scheduled for{' '}
                {new Date(booking.date).toLocaleDateString()} at {booking.time}.
              </p>
            </div>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-sm">
                <strong>What's next?</strong><br />
                • You'll receive a confirmation email shortly<br />
                • We'll call you 15 minutes before the appointment<br />
                • Have your questions and requirements ready
              </p>
            </div>
            <Button onClick={onClose} className="w-full bg-primary">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;