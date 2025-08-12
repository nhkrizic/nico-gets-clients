import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token
      const token = await new Promise<string>((resolve, reject) => {
        if (typeof window !== 'undefined' && window.grecaptcha) {
          window.grecaptcha.ready(() => {
            window.grecaptcha.execute('6LeM0H8qAAAAAJ3B821GaLoeHvywDkWPNngU4Ldh', { action: 'submit' })
              .then(resolve)
              .catch(reject);
          });
        } else {
          reject(new Error('reCAPTCHA not loaded'));
        }
      });

      // Send email via Supabase edge function
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          ...formData,
          recaptchaToken: token
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you within 2 hours.",
      });
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or call directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCallClick = () => {
    window.location.href = 'tel:+41798874423';
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Get In <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to solve your IT challenges? Contact Nico IT Services for expert solutions in Switzerland. Fast response within 2 hours guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <button 
                      onClick={handleCallClick}
                      className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                      +41 79 887 4423
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a href="mailto:nico@knicc.ch" className="text-primary hover:text-primary/80 transition-colors">
                      nico@knicc.shop
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Location</p>
                    <p className="text-muted-foreground">Switzerland</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Response Time</p>
                    <p className="text-muted-foreground">&lt; 2 hours average</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Quick Call?</h3>
                <p className="text-muted-foreground mb-4">Need immediate assistance? Give me a call!</p>
                <Button 
                  onClick={handleCallClick}
                  className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-foreground">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="border-border focus:ring-primary focus:border-primary"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="border-border focus:ring-primary focus:border-primary"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-border focus:ring-primary focus:border-primary"
                        placeholder="+41 76 123 4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-foreground mb-2">
                        Service Interest
                      </label>
                      <Input
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="border-border focus:ring-primary focus:border-primary"
                        placeholder="Web Development, IT Repair, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="border-border focus:ring-primary focus:border-primary resize-none"
                      placeholder="Tell me about your project or IT challenge..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;