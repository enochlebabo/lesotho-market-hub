
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, Phone, MessageCircle, MapPin, Clock, Star, Eye, ArrowLeft, Share2, Flag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('No product ID provided');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id(name, slug),
          profiles:user_id(first_name, last_name, phone, location, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        category: data.categories,
        profiles: data.profiles
      };
    },
    enabled: !!id,
  });

  const { data: sellerRating } = useQuery({
    queryKey: ['seller-rating', product?.user_id],
    queryFn: async () => {
      if (!product?.user_id) return null;
      
      const { data, error } = await supabase
        .rpc('get_seller_rating', { seller_uuid: product.user_id });

      if (error) throw error;
      return data?.[0] || { average_rating: 0, total_ratings: 0 };
    },
    enabled: !!product?.user_id,
  });

  const { data: isFavorited, refetch: refetchFavorite } = useQuery({
    queryKey: ['favorite', id, user?.id],
    queryFn: async () => {
      if (!user || !id) return false;
      
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', id)
        .single();

      return !!data;
    },
    enabled: !!user && !!id,
  });

  useEffect(() => {
    if (id) {
      supabase.rpc('increment_product_views', { product_uuid: id });
    }
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id);
        toast.success('Removed from favorites');
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: id });
        toast.success('Added to favorites');
      }
      refetchFavorite();
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleChatWithSeller = () => {
    if (!user) {
      toast.error('Please sign in to chat with sellers');
      return;
    }
    navigate(`/chat/${product?.user_id}?product=${id}`);
  };

  const shareProduct = async () => {
    try {
      await navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={shareProduct}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.is_featured && (
                <Badge className="absolute top-4 left-4 bg-orange-500">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer ${
                      index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{product.category?.name}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  {product.views_count} views
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {product.currency} {product.price.toLocaleString()}
                </span>
                <Badge variant="outline">{product.condition}</Badge>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {product.location}
                <Clock className="w-4 h-4 ml-4 mr-1" />
                {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button onClick={handleChatWithSeller} className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Seller
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`tel:${product.profiles?.phone}`, '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                onClick={toggleFavorite}
                className={isFavorited ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={product.profiles?.avatar_url} />
                    <AvatarFallback>
                      {product.profiles?.first_name?.[0]}{product.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {product.profiles?.first_name} {product.profiles?.last_name}
                    </h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.profiles?.location || product.location}
                    </div>
                    {sellerRating && sellerRating.total_ratings > 0 && (
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm">
                          {sellerRating.average_rating.toFixed(1)} ({sellerRating.total_ratings} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleChatWithSeller}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/seller/${product.user_id}`)}>
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
