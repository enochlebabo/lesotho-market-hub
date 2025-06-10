
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Eye } from 'lucide-react';
import { toast } from 'sonner';

const PremiumListings = () => {
  const [selectedListing, setSelectedListing] = useState('');
  const [premiumType, setPremiumType] = useState('');
  const [duration, setDuration] = useState('7');
  const queryClient = useQueryClient();

  const premiumOptions = [
    {
      type: 'featured',
      name: 'Featured Listing',
      price: 20,
      description: 'Highlight your listing with a star badge',
      icon: Star
    },
    {
      type: 'top_search',
      name: 'Top Search Results',
      price: 35,
      description: 'Appear at the top of search results',
      icon: TrendingUp
    },
    {
      type: 'category_highlight',
      name: 'Category Highlight',
      price: 50,
      description: 'Stand out in category browsing',
      icon: Eye
    }
  ];

  const createPremiumListingMutation = useMutation({
    mutationFn: async (data: {
      listingId: string;
      premiumType: string;
      duration: number;
      feeAmount: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + data.duration);

      const { error } = await supabase
        .from('premium_listings')
        .insert({
          user_id: user.id,
          listing_id: data.listingId,
          premium_type: data.premiumType,
          fee_amount: data.feeAmount,
          end_date: endDate.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premium-listings'] });
      toast.success('Premium listing activated!');
      setSelectedListing('');
      setPremiumType('');
    },
    onError: (error) => {
      toast.error('Failed to activate premium listing');
      console.error(error);
    },
  });

  const selectedOption = premiumOptions.find(opt => opt.type === premiumType);
  const totalPrice = selectedOption ? selectedOption.price * parseInt(duration) / 7 : 0;

  const handleActivatePremium = () => {
    if (!selectedListing || !premiumType) return;

    createPremiumListingMutation.mutate({
      listingId: selectedListing,
      premiumType,
      duration: parseInt(duration),
      feeAmount: totalPrice,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Premium Listings
          </CardTitle>
          <p className="text-muted-foreground">
            Boost your listings visibility and get more buyers
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Premium Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {premiumOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={option.type}
                  className={`cursor-pointer transition-all ${
                    premiumType === option.type ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setPremiumType(option.type)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">{option.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {option.description}
                    </p>
                    <Badge variant="secondary">
                      M {option.price}/week
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {premiumType && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Configure Premium Listing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Listing
                  </label>
                  <Input
                    placeholder="Enter listing ID or select from your listings"
                    value={selectedListing}
                    onChange={(e) => setSelectedListing(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can find the listing ID in your listings dashboard
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration
                  </label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">1 Week</SelectItem>
                      <SelectItem value="14">2 Weeks</SelectItem>
                      <SelectItem value="30">1 Month</SelectItem>
                      <SelectItem value="90">3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-lg font-bold">M {totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedOption?.name} for {duration} days
                </p>
              </div>

              <Button 
                onClick={handleActivatePremium}
                disabled={!selectedListing || createPremiumListingMutation.isPending}
                className="w-full"
              >
                Activate Premium Listing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumListings;
