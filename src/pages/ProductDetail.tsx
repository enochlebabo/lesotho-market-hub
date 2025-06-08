
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Eye, 
  Star,
  Clock,
  Shield
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock product data for demonstration
  const mockProduct = {
    id: id || '1',
    title: 'Toyota Camry 2018 - Excellent Condition',
    description: `Beautiful Toyota Camry 2018 in excellent condition. This car has been well maintained with regular service history. Features include:

    • Automatic transmission
    • Air conditioning
    • Power steering
    • Electric windows
    • Good sound system
    • Clean interior and exterior
    
    Serious buyers only. Vehicle is located in Maseru and viewing is welcome.`,
    price: 250000,
    currency: 'LSL',
    condition: 'excellent',
    location: 'Maseru, Lesotho',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    category: 'Vehicles',
    views: 342,
    created_at: '2024-01-15',
    seller: {
      id: 'seller1',
      name: 'John Doe',
      phone: '+266 5555 1234',
      location: 'Maseru, Lesotho',
      rating: 4.5,
      totalRatings: 23,
      memberSince: '2022-03-15',
      avatar: '/placeholder.svg'
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited 
        ? "Item removed from your favorites list" 
        : "Item added to your favorites list"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockProduct.title,
        text: `Check out this ${mockProduct.title} for ${mockProduct.currency} ${mockProduct.price.toLocaleString()}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard"
      });
    }
  };

  const handleContact = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/chat/${mockProduct.seller.id}`);
  };

  const handleCall = () => {
    window.location.href = `tel:${mockProduct.seller.phone}`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'excellent': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/products')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleFavorite}
                className={isFavorited ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={mockProduct.images[currentImageIndex]}
                    alt={mockProduct.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {mockProduct.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {mockProduct.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {mockProduct.images.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {mockProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${mockProduct.title} ${index + 1}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                          index === currentImageIndex ? 'border-primary' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">{mockProduct.title}</h1>
                    <div className="flex items-center space-x-4">
                      <Badge className={getConditionColor(mockProduct.condition)}>
                        {mockProduct.condition}
                      </Badge>
                      <Badge variant="outline">{mockProduct.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="w-4 h-4 mr-1" />
                        {mockProduct.views} views
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      {mockProduct.currency} {mockProduct.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {mockProduct.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    Listed on {new Date(mockProduct.created_at).toLocaleDateString()}
                  </div>
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {mockProduct.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seller Information and Actions */}
          <div className="space-y-6">
            {/* Contact Actions */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button size="lg" onClick={handleContact} className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Seller
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleCall}
                  className="w-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call {mockProduct.seller.phone}
                </Button>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={mockProduct.seller.avatar} />
                    <AvatarFallback>
                      {mockProduct.seller.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{mockProduct.seller.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{mockProduct.seller.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({mockProduct.seller.totalRatings} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{mockProduct.seller.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Member since {new Date(mockProduct.seller.memberSince).getFullYear()}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast({ title: "Feature coming soon", description: "Seller profile view will be available soon." })}
                >
                  View Seller Profile
                </Button>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Meet in a public place</p>
                <p>• Inspect the item before payment</p>
                <p>• Don't send money in advance</p>
                <p>• Trust your instincts</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
