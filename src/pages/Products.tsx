
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  MapPin, 
  Eye,
  Star,
  ArrowLeft
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/AuthContext';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  condition: string;
  location: string;
  images: string[];
  category: string;
  views: number;
  created_at: string;
  seller: {
    name: string;
    rating: number;
  };
}

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'Toyota Camry 2018 - Excellent Condition',
      price: 250000,
      currency: 'LSL',
      condition: 'excellent',
      location: 'Maseru, Lesotho',
      images: ['/placeholder.svg'],
      category: 'Vehicles',
      views: 342,
      created_at: '2024-01-15',
      seller: { name: 'John Doe', rating: 4.5 }
    },
    {
      id: '2',
      title: 'iPhone 13 Pro Max - Like New',
      price: 12000,
      currency: 'LSL',
      condition: 'excellent',
      location: 'Maseru, Lesotho',
      images: ['/placeholder.svg'],
      category: 'Electronics',
      views: 156,
      created_at: '2024-01-14',
      seller: { name: 'Jane Smith', rating: 4.8 }
    },
    {
      id: '3',
      title: 'Modern Dining Table Set',
      price: 3500,
      currency: 'LSL',
      condition: 'good',
      location: 'Teyateyaneng, Lesotho',
      images: ['/placeholder.svg'],
      category: 'Furniture',
      views: 89,
      created_at: '2024-01-13',
      seller: { name: 'Mike Johnson', rating: 4.2 }
    },
    {
      id: '4',
      title: 'Dell Laptop - Perfect for Students',
      price: 5500,
      currency: 'LSL',
      condition: 'good',
      location: 'Mafeteng, Lesotho',
      images: ['/placeholder.svg'],
      category: 'Electronics',
      views: 234,
      created_at: '2024-01-12',
      seller: { name: 'Sarah Wilson', rating: 4.6 }
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'phones', label: 'Mobile Phones' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home-garden', label: 'Home & Garden' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a new search
    toast({
      title: "Search updated",
      description: `Searching for: ${searchQuery}`
    });
  };

  const handleToggleFavorite = (productId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    toast({
      title: favorites.includes(productId) ? "Removed from favorites" : "Added to favorites"
    });
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

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onClick={() => navigate(`/product/${product.id}`)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(product.id);
            }}
          >
            <Heart 
              className={`w-4 h-4 ${
                favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''
              }`} 
            />
          </Button>
        </div>
        <div className="p-4 space-y-3" onClick={() => navigate(`/product/${product.id}`)}>
          <div>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-2xl font-bold text-primary mt-1">
              {product.currency} {product.price.toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className={getConditionColor(product.condition)} variant="secondary">
              {product.condition}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              {product.seller.rating}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {product.location}
            </div>
            <div className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {product.views}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex space-x-4" onClick={() => navigate(`/product/${product.id}`)}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(product.id);
                }}
              >
                <Heart 
                  className={`w-4 h-4 ${
                    favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                  }`} 
                />
              </Button>
            </div>
            
            <p className="text-xl font-bold text-primary">
              {product.currency} {product.price.toLocaleString()}
            </p>
            
            <div className="flex items-center space-x-4">
              <Badge className={getConditionColor(product.condition)} variant="secondary">
                {product.condition}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {product.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {product.seller.rating}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
              <h1 className="text-xl font-semibold">Marketplace</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for vehicles, electronics, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex flex-wrap items-center gap-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {mockProducts.length} results
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {mockProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;
