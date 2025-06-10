
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SellerProfile from '@/components/seller/SellerProfile';
import PremiumListings from '@/components/premium/PremiumListings';
import BusinessAccounts from '@/components/business/BusinessAccounts';

const SellerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Seller Profile</TabsTrigger>
            <TabsTrigger value="premium">Premium Listings</TabsTrigger>
            <TabsTrigger value="business">Business Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <SellerProfile />
          </TabsContent>

          <TabsContent value="premium">
            <PremiumListings />
          </TabsContent>

          <TabsContent value="business">
            <BusinessAccounts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;
