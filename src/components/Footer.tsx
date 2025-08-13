import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import SocialMediaLinks from "@/components/SocialMediaLinks";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-primary/95 to-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
	      <img src="/favicon.ico" alt="Knicc Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold">Knicc</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Professional IT services and web development solutions delivered with Swiss precision and quality.
            </p>
            <div className="mb-6">
              <SocialMediaLinks 
                variant="outline" 
                size="sm" 
                className="text-primary-foreground/80"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#services" className="hover:text-primary-foreground transition-colors">Web Development</a></li>
              <li><a href="#services" className="hover:text-primary-foreground transition-colors">IT Repairs</a></li>
              <li><a href="#services" className="hover:text-primary-foreground transition-colors">Network Security</a></li>
              <li><a href="#services" className="hover:text-primary-foreground transition-colors">Mobile Solutions</a></li>
              <li><a href="#services" className="hover:text-primary-foreground transition-colors">Technical Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <a href="tel:+41798874423" className="hover:text-primary-foreground transition-colors">
                  +41 79 887 4423
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <a href="mailto:nico.krizic@knicc.shop" className="hover:text-primary-foreground transition-colors">
                  nico.krizic@knicc.shop
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4" />
                <span>Switzerland</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#about" className="hover:text-primary-foreground transition-colors">About</a></li>
              <li><a href="#services" className="hover:text-primary-foreground transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-primary-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row justify-between items-center text-primary-foreground/80">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} knicc.ch - Knicc IT Services. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-accent to-accent/60"></div>
    </footer>
  );
};

export default Footer;
