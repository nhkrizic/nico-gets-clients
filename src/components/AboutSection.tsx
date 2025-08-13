import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Award, Users, Clock } from "lucide-react";
import ProfilePic from "@/assets/Profilepic.jpg"; // ✅ Ensure this path is correct

const achievements = [
  { icon: Award, label: "Certified Professional", value: "Multiple Microsoft Certifications" },
  { icon: Users, label: "Happy Clients", value: "20+ Satisfied Customers" },
  { icon: Clock, label: "Response Time", value: "< 2 Hours Average" },
  { icon: CheckCircle, label: "Success Rate", value: "99% Problem Resolution" }
];

const AboutSection = () => {
  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-r from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Meet <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Nico</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              With over 10 years of experience in IT services and web development, I'm passionate about 
              solving technology challenges and helping businesses thrive in the digital world.
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  title: "Expert Problem Solver",
                  description: "Quick diagnosis and effective solutions for complex technical issues."
                },
                {
                  title: "Modern Technologies",
                  description: "Up-to-date with latest web technologies and security practices."
                },
                {
                  title: "Swiss Quality",
                  description: "Precision, reliability, and attention to detail in every project."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              size="lg" 
              onClick={handleContactClick}
              className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Let's Work Together
            </Button>
          </div>

          {/* Image and Stats */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              
              {/* Avatar with Photo */}
              <div className="text-center p-8">
                <div className="w-40 h-40 rounded-full mx-auto mb-4 overflow-hidden border-4 border-primary shadow-lg">
                  <img
                    src={ProfilePic}
                    alt="Nico Krizic"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Nico</h3>
                <p className="text-muted-foreground">IT Solutions Expert</p>
              </div>

              {/* Achievement Cards */}
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <Card key={index} className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-0 hover:shadow-card transition-all duration-300">
                      <CardContent className="p-4 text-center">
                        <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-lg font-semibold text-foreground">{achievement.value}</div>
                        <div className="text-sm text-muted-foreground">{achievement.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
