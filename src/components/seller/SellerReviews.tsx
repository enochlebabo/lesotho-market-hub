
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare } from 'lucide-react';

interface SellerReviewsProps {
  sellerId: string;
}

const SellerReviews: React.FC<SellerReviewsProps> = ({ sellerId }) => {
  const { data: reviews } = useQuery({
    queryKey: ['seller-reviews', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seller_reviews')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: rating } = useQuery({
    queryKey: ['seller-rating', sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_seller_rating', { seller_user_id: sellerId });

      if (error) throw error;
      return data?.[0];
    },
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {rating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Seller Rating Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{rating.average_rating}</div>
                <div className="flex justify-center">{renderStars(Math.round(rating.average_rating))}</div>
                <div className="text-sm text-muted-foreground">Overall Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{rating.total_reviews}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{rating.response_time_rating}</div>
                <div className="flex justify-center">{renderStars(Math.round(rating.response_time_rating))}</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <Badge variant="outline">{review.rating}/5</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(review.created_at!).toLocaleDateString()}
                </div>
              </div>
              {review.review_text && (
                <p className="text-sm mb-2">{review.review_text}</p>
              )}
              {review.response_time_rating && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Response Time:</span>
                  <div className="flex">{renderStars(review.response_time_rating)}</div>
                </div>
              )}
            </div>
          ))}
          {!reviews?.length && (
            <p className="text-muted-foreground text-center py-8">No reviews yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerReviews;
