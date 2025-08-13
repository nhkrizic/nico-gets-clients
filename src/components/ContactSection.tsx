import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send, Map, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=Knicc%20IT%20Services%20Switzerland&output=embed";
// Replace with your official Google Maps embed src="" when ready.

// Official Google “Ask for reviews” link:
const REVIEW_URL = "https://g.page/r/CVZqy-j3kd4WEBI/review";

// Optional: only if you later get a Place ID (enables alternative review/build URLs)
const PLACE_ID = ""; // e.g. "ChIJxxxxxxxxxxxxxxxx"

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const mapsUrl = PLACE_ID
    ? `https://www.google.com/maps/search/?api=1&query=Knicc%20IT%20Services&query_place_id=${PLACE_ID}`
    : "https://www.google.com/maps?q=Knicc+IT+Services+Switzerland";

  // Prefer your REVIEW_URL; fall back to Place ID if you add it later
  const reviewUrl =
    REVIEW_URL ||
    (PLACE_ID
      ? `https://search.google.com/local/writereview?placeid=${PLACE_ID}`
      : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token
      const token = await new Promise<string>((resolve, reject) => {
        if (typeof window !== "undefined" && (window as any).grecaptcha) {
          (window as any).grecaptcha.ready(() => {
            (window as any)
              .grecaptcha.execute("6LeM0H8qAAAAAJ3B821GaLoeHvywDkWPNngU4Ldh", {
                action: "submit",
              })
              .then(resolve)
              .catch(reject);
          });
        } else {
          reject(new Error("reCAPTCHA not loaded"));
        }
      });

      // Send email via Supabase edge function
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          ...formData,
          recaptchaToken: token,
        },
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description:
          "Thank you for your message. I'll get back to you within 2 hours.",
      });
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          "Failed to send message. Please try again or call directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCallClick = () => {
    window.location.href = "tel:+41798874423";
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Get In{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to solve your IT challenges? Contact Nico IT Services for expert solutions in Switzerland.
            Fast response within 2 hours guaranteed.
          </p>
        </div>

        {/* 3 equal-height columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* LEFT: Contact info (with Quick Call inside same card) */}
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 hover:shadow-card transition-all duration-300 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
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
                  <a
                    href="mailto:nico.krizic@knicc.shop"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    nico.krizic@knicc.shop
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

              {/* Quick call section pinned to bottom */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Quick Call?</h3>
                <p className="text-muted-foreground mb-4">
                  Need immediate assistance? Give me a call!
                </p>
                <Button
                  onClick={handleCallClick}
                  className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* MIDDLE: Contact form */}
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 shadow-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
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
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* RIGHT: Google map / actions */}
          <Card className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 shadow-card h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Find Us on Google
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <div className="rounded-lg overflow-hidden border border-border">
                <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                  <iframe
                    title="Knicc IT Services — Google Maps"
                    src={MAP_EMBED_SRC}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full">
                    <Map className="mr-2 h-4 w-4" />
                    Open in Google Maps
                  </Button>
                </a>
                {reviewUrl ? (
                  <a
                    href={reviewUrl}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <Button variant="secondary" className="w-full">
                      <Star className="mr-2 h-4 w-4" />
                      Rate us on Google
                    </Button>
                  </a>
                ) : (
                  <Button variant="secondary" className="w-full" disabled>
                    <Star className="mr-2 h-4 w-4" />
                    Rate us on Google
                  </Button>
                )}
              </div>

              <ul className="text-sm text-muted-foreground list-disc pl-5 mt-auto">
                <li>Service Areas: Zürich, St. Gallen, Bern, Basel, Luzern, Zug</li>
                <li>Services: Managed IT, Netzwerk, Cybersecurity, M365, Web</li>
                <li>Languages: Deutsch, English, Hrvatski</li>
                <li>Response Time: 2 hours average</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;