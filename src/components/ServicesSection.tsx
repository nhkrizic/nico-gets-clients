import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Wrench, Shield, Smartphone, ArrowRight, Server, Database, Cloud, Monitor, Cpu, HardDrive, Wifi, Lock } from "lucide-react";
import { useState } from "react";

const mainServices = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies. Responsive, fast, and SEO-optimized.",
    features: ["Responsive Design", "SEO Optimization", "Fast Performance", "Modern Framework"]
  },
  {
    icon: Wrench,
    title: "IT Repairs & Support",
    description: "Professional computer and device repairs. Hardware troubleshooting, software issues, and system optimization.",
    features: ["Hardware Repair", "Software Issues", "System Optimization", "Data Recovery"]
  },
  {
    icon: Shield,
    title: "Network & Security",
    description: "Secure your digital infrastructure with professional network setup and cybersecurity solutions.",
    features: ["Network Setup", "Security Audits", "Firewall Config", "Data Protection"]
  },
  {
    icon: Smartphone,
    title: "Mobile Solutions",
    description: "Mobile app development and device management solutions for businesses and individuals.",
    features: ["Mobile Apps", "Device Setup", "App Integration", "Mobile Security"]
  }
];

const additionalServices = [
  {
    icon: Server,
    title: "Server Management",
    description: "Professional server setup, maintenance, and monitoring services for optimal performance.",
    features: ["Server Setup", "24/7 Monitoring", "Performance Optimization", "Backup Solutions"]
  },
  {
    icon: Database,
    title: "Database Services",
    description: "Database design, optimization, and management for efficient data handling and storage.",
    features: ["Database Design", "Performance Tuning", "Data Migration", "Backup & Recovery"]
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Cloud migration, management, and optimization for scalable and reliable infrastructure.",
    features: ["Cloud Migration", "Cost Optimization", "Auto-scaling", "Multi-cloud Strategy"]
  },
  {
    icon: Monitor,
    title: "System Monitoring",
    description: "24/7 system monitoring and alerting to prevent issues before they impact your business.",
    features: ["Real-time Monitoring", "Custom Alerts", "Performance Analytics", "Incident Response"]
  },
  {
    icon: Cpu,
    title: "Performance Optimization",
    description: "Comprehensive system performance analysis and optimization for maximum efficiency.",
    features: ["Speed Optimization", "Resource Management", "Bottleneck Analysis", "Capacity Planning"]
  },
  {
    icon: HardDrive,
    title: "Data Recovery",
    description: "Professional data recovery services for all types of storage devices and data loss scenarios.",
    features: ["Hard Drive Recovery", "RAID Recovery", "SSD Recovery", "Emergency Service"]
  },
  {
    icon: Wifi,
    title: "Network Infrastructure",
    description: "Complete network design, implementation, and management for businesses of all sizes.",
    features: ["Network Design", "WiFi Setup", "VPN Configuration", "Network Troubleshooting"]
  },
  {
    icon: Lock,
    title: "Cybersecurity Consulting",
    description: "Comprehensive security assessments and implementation of robust cybersecurity measures.",
    features: ["Security Assessments", "Penetration Testing", "Compliance Audits", "Security Training"]
  }
];

const ServicesSection = () => {
  const [showAllServices, setShowAllServices] = useState(false);
  const displayedServices = showAllServices ? [...mainServices, ...additionalServices] : mainServices;
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Our <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive IT solutions tailored to your needs. From web development to technical support, 
            we've got your technology covered.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 transition-all duration-500 ${showAllServices ? 'lg:grid-cols-3' : ''}`}>
          {displayedServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-card transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-primary to-primary/80 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => setShowAllServices(!showAllServices)}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {showAllServices ? 'Show Core Services' : 'View All Services'}
            <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${showAllServices ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;