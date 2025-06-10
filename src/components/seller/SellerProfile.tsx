
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedSellerProfile from './EnhancedSellerProfile';
import SellerReviews from './SellerReviews';
import DeliveryManager from '../delivery/DeliveryManager';
import { User, Star, Truck } from 'lucide-react';

const SellerProfile = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verification" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Reviews & Ratings
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center">
            <Truck className="w-4 h-4 mr-2" />
            Delivery Options
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verification">
          <EnhancedSellerProfile />
        </TabsContent>

        <TabsContent value="reviews">
          <SellerReviews sellerId="current-user" />
        </TabsContent>

        <TabsContent value="delivery">
          <DeliveryManager isSellerView={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerProfile;
