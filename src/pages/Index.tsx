import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HamburgerMenu from "@/components/HamburgerMenu";
import LoginModal from "@/components/LoginModal";
import LiveChatModal from "@/components/LiveChatModal";
import BookingModal from "@/components/BookingModal";
import PaymentModal from "@/components/PaymentModal";
import BlogModal from "@/components/BlogModal";

const Index = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [blogModalOpen, setBlogModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      <HamburgerMenu 
        onLoginClick={() => setLoginModalOpen(true)}
        onChatClick={() => setChatModalOpen(true)}
        onBlogClick={() => setBlogModalOpen(true)}
        onBookingClick={() => setBookingModalOpen(true)}
        onPaymentClick={() => setPaymentModalOpen(true)}
      />
      
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />

      {/* Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <LiveChatModal isOpen={chatModalOpen} onClose={() => setChatModalOpen(false)} />
      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} />
      <PaymentModal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} />
      <BlogModal isOpen={blogModalOpen} onClose={() => setBlogModalOpen(false)} />
    </div>
  );
};

export default Index;
