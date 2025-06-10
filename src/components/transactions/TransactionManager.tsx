
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Package, Star, Receipt, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionManagerProps {
  listingId: string;
  sellerId: string;
  productName: string;
  price: number;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({
  listingId,
  sellerId,
  productName,
  price
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [reservationAmount, setReservationAmount] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  
  const queryClient = useQueryClient();

  const { data: deliveryOptions } = useQuery({
    queryKey: ['delivery-options', listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_options')
        .select('*')
        .eq('listing_id', listingId)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  const { data: transaction } = useQuery({
    queryKey: ['transaction', listingId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('listing_id', listingId)
        .eq('buyer_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: {
      deliveryOption: string;
      deliveryAddress?: string;
      deliveryFee: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: transactionData, error } = await supabase
        .from('transactions')
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          listing_id: listingId,
          product_name: productName,
          agreed_price: price,
          delivery_option: data.deliveryOption,
          delivery_address: data.deliveryAddress,
          delivery_fee: data.deliveryFee,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return transactionData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', listingId] });
      toast.success('Transaction created successfully!');
    },
  });

  const createReservationMutation = useMutation({
    mutationFn: async () => {
      if (!transaction) throw new Error('No transaction found');
      if (!paymentMethod) throw new Error('Please select payment method');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

      const { data, error } = await supabase
        .from('reservations')
        .insert({
          transaction_id: transaction.id,
          buyer_id: user.id,
          seller_id: sellerId,
          reservation_amount: reservationAmount,
          payment_method: paymentMethod,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', listingId] });
      toast.success('Reservation created! Payment pending...');
    },
  });

  const markAsReceivedMutation = useMutation({
    mutationFn: async () => {
      if (!transaction) throw new Error('No transaction found');

      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', listingId] });
      toast.success('Item marked as received! You can now leave a review.');
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!transaction) throw new Error('No transaction found');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('seller_reviews')
        .insert({
          seller_id: sellerId,
          buyer_id: user.id,
          transaction_id: transaction.id,
          rating: rating,
          review_text: reviewText,
          response_time_rating: rating
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      setReviewText('');
    },
  });

  const handleCreateTransaction = (deliveryOption: string) => {
    let deliveryFee = 0;
    let address = '';

    if (deliveryOption === 'seller_delivery' || deliveryOption === 'app_delivery') {
      deliveryFee = 15; // Base delivery fee
      address = deliveryAddress;
    }

    createTransactionMutation.mutate({
      deliveryOption,
      deliveryAddress: address,
      deliveryFee
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Transaction Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!transaction ? (
            <div className="space-y-4">
              <h3 className="font-semibold">Choose Delivery Option:</h3>
              
              <Button
                onClick={() => handleCreateTransaction('pickup')}
                className="w-full justify-start"
                variant="outline"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Pickup from Seller (Free)
              </Button>

              {deliveryOptions?.some(opt => opt.delivery_type === 'seller_delivery') && (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  <Button
                    onClick={() => handleCreateTransaction('seller_delivery')}
                    className="w-full justify-start"
                    variant="outline"
                    disabled={!deliveryAddress}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Seller Delivery (M15 base fee)
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Transaction Status</h3>
                <Badge variant={
                  transaction.status === 'completed' ? 'default' :
                  transaction.status === 'pending' ? 'secondary' :
                  'outline'
                }>
                  {transaction.status?.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Product:</span> {transaction.product_name}
                </div>
                <div>
                  <span className="font-medium">Price:</span> M {transaction.agreed_price}
                </div>
                <div>
                  <span className="font-medium">Delivery:</span> {transaction.delivery_option}
                </div>
                <div>
                  <span className="font-medium">Fee:</span> M {transaction.delivery_fee}
                </div>
              </div>

              {transaction.status === 'pending' && (
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Reserve This Item
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pay a small reservation fee to secure this item and show seller you're serious.
                  </p>
                  
                  <div className="space-y-2">
                    <Select onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecocash">EcoCash</SelectItem>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="10"
                        max="50"
                        value={reservationAmount}
                        onChange={(e) => setReservationAmount(Number(e.target.value))}
                      />
                      <span className="text-sm">Maloti (M10-M50)</span>
                    </div>

                    <Button
                      onClick={() => createReservationMutation.mutate()}
                      disabled={!paymentMethod || createReservationMutation.isPending}
                      className="w-full"
                    >
                      Reserve Item (M {reservationAmount})
                    </Button>
                  </div>
                </div>
              )}

              {transaction.status === 'confirmed' && (
                <Button
                  onClick={() => markAsReceivedMutation.mutate()}
                  className="w-full"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Mark as Received & Generate Receipt
                </Button>
              )}

              {transaction.status === 'completed' && (
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Leave a Review
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Rating:</span>
                      <Select onValueChange={(value) => setRating(Number(value))}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder={rating.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Star{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Textarea
                      placeholder="Share your experience with this seller..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />

                    <Button
                      onClick={() => submitReviewMutation.mutate()}
                      disabled={submitReviewMutation.isPending}
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManager;
