
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Filter, MapPin, Clock, Star } from 'lucide-react';
import CategoryFilter from '@/components/filters/CategoryFilter';
import { Separator } from '@/components/ui/separator';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for now - replace with real data from Supabase later
  const mockProducts = [
    {
      id: 1,
      title: 'Toyota Corolla 2018',
      price: 'M 180,000',
      location: 'Maseru',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400',
      category: 'Vehicles',
      timeAgo: '2 hours ago',
      isPremium: true,
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
      isPremium: false,
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
      isPremium: true,
      isVerifiedSeller: false,
    },
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products - premium listings first
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    return 0;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter will happen automatically through the state
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-xl font-semibold">Browse Goods</h1>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for vehicles, electronics, furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </form>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-64 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedCategory || 'All Categories'}
                </h2>
                <p className="text-muted-foreground">
                  {sortedProducts.length} goods found
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isPremium && (
                      <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {product.isVerifiedSeller && (
                      <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {product.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {product.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {product.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {product.timeAgo}
                        </div>
                      </div>

                      <Button className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No goods found matching your criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
