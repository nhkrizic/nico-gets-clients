import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import heroDarkImage from "@/assets/hero-dark.jpg";

const HeroSection = () => {
  const handleCallClick = () => {
    window.location.href = "tel:+41798874423";
  };

  const handleConsultationClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
        style={{ backgroundImage: `url(${heroDarkImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      </div>

      {/* Hero Content */}
      <header className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
            Professional
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              IT Solutions
            </span>
            <span className="block text-foreground">Made Simple</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Web development, IT repairs, and technical solutions delivered with
            Swiss precision. Your technology challenges solved by expert hands.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleConsultationClick}
              className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-glow hover:shadow-intense transition-all duration-300 hover:scale-105"
            >
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleCallClick}
              className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary font-semibold px-8 py-6 text-lg rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-card"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center backdrop-blur-sm bg-card/50 rounded-lg p-6 border border-border shadow-card hover:shadow-glow transition-all duration-300">
              <div className="text-3xl font-bold text-primary">10+</div>
              <div className="text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-card/50 rounded-lg p-6 border border-border shadow-card hover:shadow-glow transition-all duration-300">
              <div className="text-3xl font-bold text-primary">20+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-card/50 rounded-lg p-6 border border-border shadow-card hover:shadow-glow transition-all duration-300">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </header>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-muted-foreground animate-bounce">
        <div className="w-6 h-10 flex justify-center items-start">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-t-primary mt-2 animate-pulse"></div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;