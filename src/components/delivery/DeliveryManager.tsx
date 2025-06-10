
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface DeliveryManagerProps {
  listingId?: string;
  isSellerView?: boolean;
}

const DeliveryManager: React.FC<DeliveryManagerProps> = ({ 
  listingId,
  isSellerView = false 
}) => {
  const [deliveryType, setDeliveryType] = useState('');
  const [radiusKm, setRadiusKm] = useState('5');
  const [baseFee, setBaseFee] = useState('15');
  const [perKmRate, setPerKmRate] = useState('3');
  const [estimatedTime, setEstimatedTime] = useState('1-2 hours');
  
  const queryClient = useQueryClient();

  const { data: deliveryOptions } = useQuery({
    queryKey: ['delivery-options', listingId],
    queryFn: async () => {
      if (!listingId) return [];
      
      const { data, error } = await supabase
        .from('delivery_options')
        .select('*')
        .eq('listing_id', listingId)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
    enabled: !!listingId,
  });

  const { data: myDeliveryOptions } = useQuery({
    queryKey: ['my-delivery-options'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('delivery_options')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: isSellerView,
  });

  const createDeliveryOptionMutation = useMutation({
    mutationFn: async (data: {
      listingId: string;
      deliveryType: string;
      radiusKm?: number;
      baseFee?: number;
      perKmRate?: number;
      estimatedTime?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: deliveryData, error } = await supabase
        .from('delivery_options')
        .insert({
          listing_id: data.listingId,
          seller_id: user.id,
          delivery_type: data.deliveryType,
          delivery_radius_km: data.radiusKm,
          base_delivery_fee: data.baseFee,
          per_km_rate: data.perKmRate,
          estimated_delivery_time: data.estimatedTime,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return deliveryData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-options'] });
      queryClient.invalidateQueries({ queryKey: ['my-delivery-options'] });
      toast.success('Delivery option created successfully!');
      setDeliveryType('');
      setRadiusKm('5');
      setBaseFee('15');
      setPerKmRate('3');
      setEstimatedTime('1-2 hours');
    },
  });

  const calculateDeliveryFee = (distance: number, baseFee: number, perKmRate: number) => {
    return baseFee + (distance * perKmRate);
  };

  const handleCreateDeliveryOption = () => {
    if (!listingId || !deliveryType) {
      toast.error('Please select a delivery type');
      return;
    }

    createDeliveryOptionMutation.mutate({
      listingId,
      deliveryType,
      radiusKm: deliveryType !== 'pickup_only' ? Number(radiusKm) : undefined,
      baseFee: deliveryType !== 'pickup_only' ? Number(baseFee) : undefined,
      perKmRate: deliveryType !== 'pickup_only' ? Number(perKmRate) : undefined,
      estimatedTime: deliveryType !== 'pickup_only' ? estimatedTime : undefined,
    });
  };

  if (isSellerView) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Manage Delivery Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {listingId && (
              <div className="space-y-4">
                <h3 className="font-semibold">Add Delivery Option for This Listing</h3>
                
                <Select onValueChange={setDeliveryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup_only">Pickup Only (Free)</SelectItem>
                    <SelectItem value="seller_delivery">I Deliver Myself</SelectItem>
                    <SelectItem value="app_delivery">App Logistics Partner (Future)</SelectItem>
                  </SelectContent>
                </Select>

                {deliveryType && deliveryType !== 'pickup_only' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Delivery Radius (km)</label>
                      <Input
                        type="number"
                        value={radiusKm}
                        onChange={(e) => setRadiusKm(e.target.value)}
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Base Fee (M)</label>
                      <Input
                        type="number"
                        value={baseFee}
                        onChange={(e) => setBaseFee(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Per KM Rate (M)</label>
                      <Input
                        type="number"
                        value={perKmRate}
                        onChange={(e) => setPerKmRate(e.target.value)}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Estimated Time</label>
                      <Select onValueChange={setEstimatedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder={estimatedTime} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30 minutes">30 minutes</SelectItem>
                          <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                          <SelectItem value="Same day">Same day</SelectItem>
                          <SelectItem value="Next day">Next day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateDeliveryOption}
                  disabled={!deliveryType || createDeliveryOptionMutation.isPending}
                  className="w-full"
                >
                  Add Delivery Option
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">My Delivery Options</h3>
              {myDeliveryOptions?.map((option) => (
                <div key={option.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Listing: {option.listing_id}</h4>
                    <Badge variant={option.is_active ? "default" : "secondary"}>
                      {option.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Type: {option.delivery_type}</div>
                    {option.delivery_radius_km && (
                      <div>Radius: {option.delivery_radius_km}km</div>
                    )}
                    {option.base_delivery_fee && (
                      <div>Base Fee: M{option.base_delivery_fee}</div>
                    )}
                    {option.per_km_rate && (
                      <div>Per KM: M{option.per_km_rate}</div>
                    )}
                  </div>
                </div>
              ))}
              {!myDeliveryOptions?.length && (
                <p className="text-muted-foreground">No delivery options created yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Buyer view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          Delivery Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {deliveryOptions?.map((option) => (
          <div key={option.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium flex items-center">
                {option.delivery_type === 'pickup_only' && <MapPin className="w-4 h-4 mr-2" />}
                {option.delivery_type === 'seller_delivery' && <Truck className="w-4 h-4 mr-2" />}
                {option.delivery_type === 'app_delivery' && <Truck className="w-4 h-4 mr-2" />}
                {option.delivery_type === 'pickup_only' ? 'Pickup Only' :
                 option.delivery_type === 'seller_delivery' ? 'Seller Delivery' :
                 'App Delivery Partner'}
              </h4>
              <Badge variant="outline">
                {option.delivery_type === 'pickup_only' ? 'Free' : 
                 `M${option.base_delivery_fee} + M${option.per_km_rate}/km`}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {option.delivery_radius_km && (
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Radius: {option.delivery_radius_km}km
                </div>
              )}
              {option.estimated_delivery_time && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {option.estimated_delivery_time}
                </div>
              )}
            </div>

            {option.delivery_type !== 'pickup_only' && (
              <div className="mt-3 p-3 bg-muted rounded">
                <p className="text-sm font-medium mb-1">Delivery Fee Calculator:</p>
                <p className="text-xs text-muted-foreground">
                  For 5km: M{calculateDeliveryFee(5, option.base_delivery_fee || 0, option.per_km_rate || 0)} | 
                  For 10km: M{calculateDeliveryFee(10, option.base_delivery_fee || 0, option.per_km_rate || 0)} | 
                  For 15km: M{calculateDeliveryFee(15, option.base_delivery_fee || 0, option.per_km_rate || 0)}
                </p>
              </div>
            )}
          </div>
        ))}
        
        {!deliveryOptions?.length && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No delivery options available</p>
            <p className="text-sm text-muted-foreground">Contact seller for pickup arrangements</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryManager;
