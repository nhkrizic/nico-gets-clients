import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HamburgerMenu from "@/components/HamburgerMenu";
import AuthModal from "@/components/AuthModal";
import LiveChatModal from "@/components/LiveChatModal";
import PaymentModal from "@/components/PaymentModal";
import BlogModal from "@/components/BlogModal";
import RecentPostsSection from "@/components/UserPostsSection";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [blogModalOpen, setBlogModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      <HamburgerMenu 
        onLoginClick={() => setLoginModalOpen(true)}
        onChatClick={() => setChatModalOpen(true)}
        onBlogClick={() => setBlogModalOpen(true)}
        onPaymentClick={() => setPaymentModalOpen(true)}
      />
      
      <HeroSection />
      <ServicesSection />
      <RecentPostsSection onBlogClick={() => setBlogModalOpen(true)} />
      <AboutSection />
      <ContactSection />
      <Footer />

      {/* Modals */}
      <AuthModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <LiveChatModal isOpen={chatModalOpen} onClose={() => setChatModalOpen(false)} />
      <PaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} />
      <BlogModal isOpen={blogModalOpen} onClose={() => setBlogModalOpen(false)} />
      
      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
};

export default Index;
