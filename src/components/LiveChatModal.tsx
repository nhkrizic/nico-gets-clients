import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, MessageCircle, Minimize2, X, Clock, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const LiveChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI support assistant. I can help you with technical issues, service questions, and schedule appointments. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response - connect this to your backend AI service
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('booking') || lowerMessage.includes('schedule')) {
      return "I can help you schedule an appointment! Our available services include IT repairs, web development consultations, and system setups. Would you prefer a phone consultation or an on-site visit? Please let me know your preferred date and time.";
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('bill') || lowerMessage.includes('invoice')) {
      return "For payment and billing inquiries, I can connect you with our secure payment system. We accept credit cards and PayPal. Would you like to make a payment now or need help with an existing invoice?";
    }
    
    if (lowerMessage.includes('repair') || lowerMessage.includes('fix') || lowerMessage.includes('broken')) {
      return "I understand you need technical repair services. Can you describe the issue you're experiencing? For immediate assistance, I can escalate this to our technical team or schedule an emergency repair appointment.";
    }
    
    if (lowerMessage.includes('website') || lowerMessage.includes('web') || lowerMessage.includes('development')) {
      return "Great! I can help with web development services. Are you looking to create a new website, update an existing one, or need maintenance? Our team specializes in modern, responsive websites with professional designs.";
    }
    
    return "Thank you for your message! I understand you need assistance. Let me connect you with the right solution. Would you like to schedule a consultation call, or can I help you with a specific technical question right now?";
  };

  const handleEscalateToHuman = () => {
    const escalationMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: "I'm connecting you with one of our human support specialists. They'll be with you shortly. In the meantime, you can also call us directly at +41 76 123 4567 for immediate assistance.",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, escalationMessage]);
    
    toast({
      title: "Connecting to Human Support",
      description: "A specialist will join the chat shortly.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[700px] bg-gradient-to-br from-card to-card/90 backdrop-blur-xl border-border p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <DialogHeader className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">
                  AI Support Assistant
                </DialogTitle>
                <DialogDescription className="text-sm">
                  First-level technical support • Available 24/7
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              <Clock className="w-3 h-3 mr-1" />
              Online
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-accent' : 'bg-primary'}`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted border border-border rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-background/50">
          <div className="flex space-x-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEscalateToHuman}
              className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            >
              <Phone className="w-3 h-3 mr-1" />
              Talk to Human
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage("I need help booking an appointment")}
              className="text-xs hover:bg-accent/10 hover:text-accent hover:border-accent/30"
            >
              Book Appointment
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-background/50 border-border focus:border-primary"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveChatModal;