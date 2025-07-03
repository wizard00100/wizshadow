import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { destinations, searchDestinations } from '@/data/destinations';
import { useAuth } from '@/hooks/useAuth';
import { getUserTier } from '@/data/subscriptionTiers';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface DarthZenChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DarthZenChat: React.FC<DarthZenChatProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userName = user?.user_metadata?.full_name || 'traveler';
      const welcomeMessage: Message = {
        id: '1',
        text: `Welcome, ${userName} of the Dark Side... I am Darth ZEN, your Sith concierge. I sense great potential within you. How may I assist your journey through the shadows of the galaxy?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check user's subscription tier
    const userRank = user?.user_metadata?.rank || 'Acolyte';
    const userTier = getUserTier(userRank);
    
    if (!userTier.hasAiChat && userRank === 'Acolyte') {
      return "Ah, young Acolyte... Your current rank grants you only basic access. To unlock my full wisdom, you must ascend to Inquisitor rank or higher. The path to power requires... investment.";
    }

    // Adventure level queries
    if (message.includes('highest adventure') || message.includes('most adventurous')) {
      const highestAdventure = destinations.reduce((prev, current) => 
        prev.adventureLevel > current.adventureLevel ? prev : current
      );
      return `Curious about thrills, are you? ${highestAdventure.name} offers the highest adventure rating at ${highestAdventure.adventureLevel}/10. ${highestAdventure.backgroundLore} But beware... such excitement comes with considerable risk.`;
    }

    // Danger level queries
    if (message.includes('most dangerous') || message.includes('highest danger')) {
      const mostDangerous = destinations.reduce((prev, current) => 
        prev.dangerLevel > current.dangerLevel ? prev : current
      );
      return `Seeking death, are you? ${mostDangerous.name} presents the greatest danger at ${mostDangerous.dangerLevel}/10. ${mostDangerous.backgroundLore} Only the truly powerful survive such places.`;
    }

    // Gravity queries
    if (message.includes('medium gravity') || message.includes('earth gravity') || message.includes('1g')) {
      const earthLike = destinations.filter(d => d.gravityLevel >= 0.9 && d.gravityLevel <= 1.1);
      if (earthLike.length > 0) {
        const suggestion = earthLike[Math.floor(Math.random() * earthLike.length)];
        return `For those who prefer familiar gravitational embrace, I recommend ${suggestion.name} at ${suggestion.gravityLevel}G. ${suggestion.description} A wise choice for maintaining your physical form.`;
      }
    }

    // Low gravity queries
    if (message.includes('low gravity') || message.includes('light gravity')) {
      const lowGrav = destinations.filter(d => d.gravityLevel < 0.8);
      if (lowGrav.length > 0) {
        const suggestion = lowGrav[Math.floor(Math.random() * lowGrav.length)];
        return `To float like a Force ghost, consider ${suggestion.name} at ${suggestion.gravityLevel}G. ${suggestion.description} Your movements will be... enhanced.`;
      }
    }

    // High gravity queries
    if (message.includes('high gravity') || message.includes('heavy gravity')) {
      const highGrav = destinations.filter(d => d.gravityLevel > 1.5);
      if (highGrav.length > 0) {
        const suggestion = highGrav[Math.floor(Math.random() * highGrav.length)];
        return `For those who seek to test their physical limits, ${suggestion.name} at ${suggestion.gravityLevel}G will crush the weak. ${suggestion.description} Only the strong survive such worlds.`;
      }
    }

    // Specific planet queries
    const planetMentioned = destinations.find(d => 
      message.includes(d.name.toLowerCase()) || 
      d.keywords.some(keyword => message.includes(keyword))
    );
    
    if (planetMentioned) {
      return `Ah, ${planetMentioned.name}... ${planetMentioned.backgroundLore} Adventure Level: ${planetMentioned.adventureLevel}/10, Danger: ${planetMentioned.dangerLevel}/10, Gravity: ${planetMentioned.gravityLevel}G. ${planetMentioned.survivalNotes[0]} Proceed with caution, young one.`;
    }

    // Booking queries
    if (message.includes('book') || message.includes('reservation')) {
      return "To book your dark journey, simply select 'Enter the Darkness' on any destination that calls to your soul. I will guide you through the booking process... for a price, of course.";
    }

    // Price queries
    if (message.includes('price') || message.includes('cost') || message.includes('expensive')) {
      return "Power has its price, young one. Our destinations range from 2,200 to 12,000 Imperial Credits. The most exclusive experiences require... significant investment. But what is credits compared to unlimited power?";
    }

    // Subscription queries
    if (message.includes('subscription') || message.includes('upgrade') || message.includes('tier')) {
      return `Your current rank is ${userRank}. To unlock greater power and access to forbidden realms, consider ascending to a higher tier. Each rank grants new privileges... and new responsibilities.`;
    }

    // General help
    if (message.includes('help') || message.includes('what can you do')) {
      return "I can guide you to destinations based on adventure level, danger, gravity, or specific worlds. Ask me about planets, booking procedures, or let me recommend places that match your... particular tastes for darkness.";
    }

    // Default responses with Sith flair
    const defaultResponses = [
      "Interesting question, young one. The dark side reveals many secrets to those who know how to ask...",
      "Your curiosity serves you well. Perhaps you seek knowledge of our darker destinations?",
      "The Force flows through all things... including travel recommendations. Be more specific with your desires.",
      "Patience, apprentice. The path to the perfect destination requires clarity of purpose.",
      "I sense confusion in you. Ask me about specific worlds, adventure levels, or booking procedures."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full sith-button shadow-lg z-50 animate-pulse-glow"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 bg-sith-black border-sith-red/30 shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[500px]'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-sith-red/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sith-red rounded-full flex items-center justify-center animate-pulse-glow">
            <div className="w-6 h-6 bg-sith-red-light rounded-full"></div>
          </div>
          <div>
            <CardTitle className="text-lg text-sith-red title-font">Darth ZEN</CardTitle>
            <p className="text-xs text-gray-400">Sith Concierge AI</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-sith-red text-white'
                          : 'bg-sith-gray/50 text-gray-200 border border-sith-red/20'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-4 border-t border-sith-red/30">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about destinations, danger levels..."
                className="bg-sith-gray/50 border-sith-red/30 text-white"
              />
              <Button onClick={handleSendMessage} className="sith-button">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default DarthZenChat;