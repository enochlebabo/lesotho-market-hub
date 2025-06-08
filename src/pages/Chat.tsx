
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, MapPin, Share, Phone, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'location' | 'image';
  created_at: string;
  is_read: boolean;
}

interface Chat {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  product: {
    title: string;
    price: number;
    currency: string;
    images: string[];
  };
}

const Chat = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Get or create chat
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ['chat', sellerId, productId],
    queryFn: async () => {
      if (!user || !sellerId || !productId) return null;

      // First try to find existing chat
      let { data: existingChat } = await supabase
        .from('chats')
        .select(`
          *,
          products:product_id(title, price, currency, images)
        `)
        .eq('product_id', productId)
        .eq('buyer_id', user.id)
        .eq('seller_id', sellerId)
        .single();

      if (existingChat) {
        return {
          ...existingChat,
          product: existingChat.products
        };
      }

      // Create new chat if none exists
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({
          product_id: productId,
          buyer_id: user.id,
          seller_id: sellerId
        })
        .select(`
          *,
          products:product_id(title, price, currency, images)
        `)
        .single();

      if (error) throw error;

      return {
        ...newChat,
        product: newChat.products
      };
    },
    enabled: !!user && !!sellerId && !!productId,
  });

  // Get chat messages
  const { data: messages } = useQuery({
    queryKey: ['messages', chat?.id],
    queryFn: async () => {
      if (!chat?.id) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!chat?.id,
  });

  // Get other user's profile
  const { data: otherUser } = useQuery({
    queryKey: ['user-profile', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!sellerId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, messageType = 'text' }: { content: string; messageType?: string }) => {
      if (!chat?.id || !user) throw new Error('Chat not ready');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chat.id,
          sender_id: user.id,
          content,
          message_type: messageType
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chat?.id] });
      setMessageText('');
    },
  });

  // Real-time message subscription
  useEffect(() => {
    if (!chat?.id) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chat.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', chat.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chat?.id, queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendMessageMutation.mutate({ content: messageText.trim() });
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          sendMessageMutation.mutate({ 
            content: locationUrl, 
            messageType: 'location' 
          });
          toast.success('Location shared');
        },
        () => {
          toast.error('Failed to get location');
        }
      );
    } else {
      toast.error('Geolocation not supported');
    }
  };

  if (chatLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat not found</h2>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar>
              <AvatarImage src={otherUser?.avatar_url} />
              <AvatarFallback>
                {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {otherUser?.first_name} {otherUser?.last_name}
              </h3>
              <p className="text-sm text-gray-500">
                {otherUser?.location && (
                  <>
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {otherUser.location}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      {chat.product && (
        <div className="bg-blue-50 border-b px-4 py-3">
          <div className="flex items-center space-x-3">
            <img
              src={chat.product.images?.[0] || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100'}
              alt={chat.product.title}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{chat.product.title}</h4>
              <p className="text-sm font-semibold text-primary">
                {chat.product.currency} {chat.product.price.toLocaleString()}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate(`/product/${productId}`)}>
              View Item
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_id === user?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white shadow-sm'
              }`}
            >
              {message.message_type === 'location' ? (
                <div className="space-y-2">
                  <p className="text-sm">📍 Location shared</p>
                  <Button
                    size="sm"
                    variant={message.sender_id === user?.id ? "secondary" : "default"}
                    onClick={() => window.open(message.content, '_blank')}
                  >
                    View on Map
                  </Button>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
              <p className={`text-xs mt-1 ${
                message.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-gray-500'
              }`}>
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={shareLocation}
          >
            <MapPin className="w-4 h-4" />
          </Button>
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!messageText.trim() || sendMessageMutation.isPending}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
