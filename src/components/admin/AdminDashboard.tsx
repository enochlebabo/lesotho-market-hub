import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, DollarSign, Users, TrendingUp, Check, X, Eye, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  const { data: verificationRequests } = useQuery({
    queryKey: ['admin-verification-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seller_verification')
        .select('*')
        .eq('verification_status', 'pending');

      if (error) throw error;
      return data;
    },
  });

  const { data: businessAccounts } = useQuery({
    queryKey: ['admin-business-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_accounts')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const { data: advertisements } = useQuery({
    queryKey: ['admin-advertisements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  const { data: transactions } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  // New query for pending product listings
  const { data: pendingListings } = useQuery({
    queryKey: ['admin-pending-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateVerificationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'verified' | 'rejected' }) => {
      const { error } = await supabase
        .from('seller_verification')
        .update({ 
          verification_status: status,
          verified_at: status === 'verified' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-verification-requests'] });
      toast.success('Verification status updated');
    },
  });

  // New mutation for approving/rejecting product listings
  const updateListingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('products')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-listings'] });
      toast.success('Listing status updated');
    },
  });

  const stats = {
    totalUsers: businessAccounts?.length || 0,
    pendingVerifications: verificationRequests?.length || 0,
    pendingListings: pendingListings?.length || 0,
    activeAds: advertisements?.filter(ad => ad.is_active).length || 0,
    monthlyRevenue: advertisements?.reduce((sum, ad) => sum + (ad.monthly_fee || 0), 0) || 0,
    totalTransactions: transactions?.length || 0,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="secondary" className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>MoCha Market Admin</span>
        </Badge>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Listings</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingListings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAds}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">M {stats.monthlyRevenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Product Listings</TabsTrigger>
          <TabsTrigger value="verifications">Seller Verifications</TabsTrigger>
          <TabsTrigger value="business">Business Accounts</TabsTrigger>
          <TabsTrigger value="ads">Advertisements</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Product Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingListings?.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Price: M {listing.price} | Category: {listing.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Seller: {listing.seller_id} | Created: {new Date(listing.created_at!).toLocaleDateString()}
                    </p>
                    {listing.description && (
                      <p className="text-sm mt-2 text-gray-600 truncate max-w-md">
                        {listing.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateListingMutation.mutate({ 
                        id: listing.id, 
                        status: 'approved' 
                      })}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateListingMutation.mutate({ 
                        id: listing.id, 
                        status: 'rejected' 
                      })}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {!pendingListings?.length && (
                <p className="text-muted-foreground">No pending product listings</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {verificationRequests?.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                  <div>
                    <h3 className="font-semibold">User ID: {request.user_id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(request.created_at!).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      Documents: {Array.isArray(request.verification_documents) 
                        ? request.verification_documents.length 
                        : 0} files
                    </p>
                    {request.government_id_url && (
                      <p className="text-sm text-blue-600">Government ID uploaded</p>
                    )}
                    {request.social_media_link && (
                      <p className="text-sm">Social Media: {request.social_media_link}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateVerificationMutation.mutate({ 
                        id: request.id, 
                        status: 'verified' 
                      })}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateVerificationMutation.mutate({ 
                        id: request.id, 
                        status: 'rejected' 
                      })}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {!verificationRequests?.length && (
                <p className="text-muted-foreground">No pending verification requests</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {businessAccounts?.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                  <div>
                    <h3 className="font-semibold">{account.business_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      User ID: {account.user_id}
                    </p>
                    <p className="text-sm">Type: {account.business_type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={account.is_active ? "default" : "secondary"}>
                      {account.plan_type?.toUpperCase()}
                    </Badge>
                    <p className="text-sm font-medium">M {account.monthly_fee}/month</p>
                  </div>
                </div>
              ))}
              {!businessAccounts?.length && (
                <p className="text-muted-foreground">No business accounts</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advertisement Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {advertisements?.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                  <div>
                    <h3 className="font-semibold">{ad.ad_title}</h3>
                    <p className="text-sm text-muted-foreground">
                      User ID: {ad.user_id}
                    </p>
                    <p className="text-sm">Type: {ad.ad_type}</p>
                    {ad.target_category && (
                      <p className="text-sm">Category: {ad.target_category}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={ad.is_active ? "default" : "secondary"}>
                      {ad.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <p className="text-sm font-medium">M {ad.monthly_fee}/month</p>
                    <p className="text-xs text-muted-foreground">
                      {ad.click_count} clicks • {ad.impression_count} views
                    </p>
                  </div>
                </div>
              ))}
              {!advertisements?.length && (
                <p className="text-muted-foreground">No advertisements</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions?.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                  <div>
                    <h3 className="font-semibold">{transaction.product_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Transaction ID: {transaction.id}
                    </p>
                    <p className="text-sm">Price: M {transaction.agreed_price}</p>
                    <p className="text-sm">Delivery: {transaction.delivery_option}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      transaction.status === 'completed' ? 'default' :
                      transaction.status === 'pending' ? 'secondary' :
                      transaction.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {transaction.status?.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.created_at!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {!transactions?.length && (
                <p className="text-muted-foreground">No transactions</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
