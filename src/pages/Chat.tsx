
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, MapPin, Phone, Star, Image, Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/AuthContext';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  type: 'text' | 'location' | 'image';
}

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  images: string[];
  location: string;
}

interface Seller {
  id: string;
  name: string;
  phone: string;
  location: string;
  rating: number;
  avatar?: string;
}

const Chat = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  const mockProduct: Product = {
    id: '1',
    title: 'Toyota Camry 2018',
    price: 250000,
    currency: 'LSL',
    images: ['/placeholder.svg'],
    location: 'Maseru, Lesotho'
  };

  const mockSeller: Seller = {
    id: sellerId || '1',
    name: 'John Doe',
    phone: '+266 5555 1234',
    location: 'Maseru, Lesotho',
    rating: 4.5,
    avatar: '/placeholder.svg'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mock initial messages
    setMessages([
      {
        id: '1',
        content: 'Hi! I\'m interested in your Toyota Camry. Is it still available?',
        senderId: user?.id || 'buyer',
        timestamp: new Date(Date.now() - 60000),
        type: 'text'
      },
      {
        id: '2',
        content: 'Yes, it\'s still available! Would you like to schedule a viewing?',
        senderId: sellerId || 'seller',
        timestamp: new Date(Date.now() - 30000),
        type: 'text'
      }
    ]);
  }, [sellerId, user?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user.id,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Mock response from seller
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message! I\'ll get back to you soon.',
        senderId: sellerId || 'seller',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location sharing.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationMessage: Message = {
          id: Date.now().toString(),
          content: `Location: ${latitude}, ${longitude}`,
          senderId: user?.id || 'user',
          timestamp: new Date(),
          type: 'location'
        };
        setMessages(prev => [...prev, locationMessage]);
        setIsLoading(false);
        toast({
          title: "Location shared",
          description: "Your location has been shared with the seller."
        });
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Location error",
          description: "Unable to get your location. Please try again.",
          variant: "destructive"
        });
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="mb-4">Please log in to start chatting.</p>
            <Button onClick={() => navigate('/auth')}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/products')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={mockSeller.avatar} />
                  <AvatarFallback>{mockSeller.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{mockSeller.name}</h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {mockSeller.rating}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src={mockProduct.images[0]}
                  alt={mockProduct.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{mockProduct.title}</h3>
                  <p className="text-2xl font-bold text-primary">
                    {mockProduct.currency} {mockProduct.price.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {mockProduct.location}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={mockSeller.avatar} />
                    <AvatarFallback>{mockSeller.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{mockSeller.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {mockSeller.rating} rating
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {mockSeller.phone}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {mockSeller.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Chat with Seller</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.type === 'location' ? (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">Location shared</span>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShareLocation}
                      disabled={isLoading}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
