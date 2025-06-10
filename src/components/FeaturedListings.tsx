
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const featuredItems = [
  {
    id: 1,
    title: 'Toyota Corolla 2018',
    price: 'M 180,000',
    location: 'Maseru',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
    category: 'Vehicles',
    timeAgo: '2 hours ago',
    rating: 4.8,
    featured: true,
    isVerifiedSeller: true,
  },
  {
    id: 2,
    title: 'MacBook Pro 13" 2020',
    price: 'M 8,500',
    location: 'Leribe',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400',
    category: 'Electronics',
    timeAgo: '5 hours ago',
    rating: 4.9,
    featured: false,
    isVerifiedSeller: true,
  },
  {
    id: 3,
    title: 'Modern Office Desk',
    price: 'M 1,200',
    location: 'Berea',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    category: 'Furniture',
    timeAgo: '1 day ago',
    rating: 4.7,
    featured: true,
    isVerifiedSeller: false,
  },
  {
    id: 4,
    title: 'iPhone 13 Pro Max',
    price: 'M 12,000',
    location: 'Mafeteng',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
    category: 'Electronics',
    timeAgo: '3 hours ago',
    rating: 5.0,
    featured: false,
    isVerifiedSeller: true,
  },
  {
    id: 5,
    title: 'Living Room Set',
    price: 'M 5,500',
    location: 'Mohale\'s Hoek',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
    category: 'Furniture',
    timeAgo: '6 hours ago',
    rating: 4.6,
    featured: true,
    isVerifiedSeller: false,
  },
  {
    id: 6,
    title: 'Gaming Laptop Setup',
    price: 'M 15,000',
    location: 'Quthing',
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400',
    category: 'Electronics',
    timeAgo: '1 day ago',
    rating: 4.9,
    featured: false,
    isVerifiedSeller: true,
  },
];

const FeaturedListings = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    navigate('/products');
  };

  const handleViewAllItems = () => {
    navigate('/products');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Listings
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked goods from trusted sellers across Lesotho
            </p>
          </div>
          <Button variant="outline" onClick={handleViewAllItems}>
            View All Items
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <Card 
              key={item.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onClick={() => handleProductClick(item.id)}
                />
                {item.featured && (
                  <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {item.isVerifiedSeller && (
                  <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                    ✓ Verified
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="w-3 h-3 mr-1 text-yellow-400" />
                      {item.rating}
                    </div>
                  </div>

                  <h3 
                    className="font-semibold text-lg text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600"
                    onClick={() => handleProductClick(item.id)}
                  >
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {item.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {item.timeAgo}
                    </div>
                  </div>

                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    onClick={() => handleProductClick(item.id)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
