
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, Crown, Gem } from 'lucide-react';
import { toast } from 'sonner';

const BusinessAccounts = () => {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const queryClient = useQueryClient();

  const { data: businessAccount } = useQuery({
    queryKey: ['business-account'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('business_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const businessPlans = [
    {
      type: 'basic',
      name: 'Basic Business',
      price: 150,
      features: [
        'Business profile verification',
        'Up to 50 listings per month',
        'Basic analytics',
        'Customer support'
      ],
      icon: Building
    },
    {
      type: 'premium',
      name: 'Premium Business',
      price: 300,
      features: [
        'Everything in Basic',
        'Unlimited listings',
        'Advanced analytics',
        'Priority customer support',
        'Featured business badge'
      ],
      icon: Crown
    },
    {
      type: 'enterprise',
      name: 'Enterprise',
      price: 500,
      features: [
        'Everything in Premium',
        'Custom branding options',
        'API access',
        'Dedicated account manager',
        'Custom integrations'
      ],
      icon: Gem
    }
  ];

  const createBusinessAccountMutation = useMutation({
    mutationFn: async (data: {
      businessName: string;
      businessType: string;
      planType: string;
      monthlyFee: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const planEndDate = new Date();
      planEndDate.setMonth(planEndDate.getMonth() + 1);

      const { error } = await supabase
        .from('business_accounts')
        .upsert({
          user_id: user.id,
          business_name: data.businessName,
          business_type: data.businessType,
          plan_type: data.planType,
          monthly_fee: data.monthlyFee,
          plan_end_date: planEndDate.toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-account'] });
      toast.success('Business account created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create business account');
      console.error(error);
    },
  });

  const handleCreateAccount = () => {
    const plan = businessPlans.find(p => p.type === selectedPlan);
    if (!businessName || !businessType || !plan) return;

    createBusinessAccountMutation.mutate({
      businessName,
      businessType,
      planType: selectedPlan,
      monthlyFee: plan.price,
    });
  };

  if (businessAccount) {
    const currentPlan = businessPlans.find(p => p.type === businessAccount.plan_type);
    const Icon = currentPlan?.icon || Building;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon className="w-5 h-5 mr-2" />
              Your Business Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Business Name</h3>
                <p className="text-muted-foreground">{businessAccount.business_name}</p>
              </div>
              <div>
                <h3 className="font-semibold">Business Type</h3>
                <p className="text-muted-foreground">{businessAccount.business_type}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Current Plan</h3>
                <Badge variant="secondary" className="mt-1">
                  {currentPlan?.name}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">M {businessAccount.monthly_fee}</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Plan Features</h4>
              <ul className="text-sm space-y-1">
                {currentPlan?.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">
                  Plan expires: {new Date(businessAccount.plan_end_date!).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Business Accounts</h1>
        <p className="text-muted-foreground">
          Grow your business with our professional tools and features
        </p>
      </div>

      {/* Business Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {businessPlans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.type}
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.type ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPlan(plan.type)}
            >
              <CardHeader className="text-center">
                <Icon className="w-12 h-12 mx-auto mb-2 text-primary" />
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">M {plan.price}</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Set Up Your Business Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Name
                </label>
                <Input
                  placeholder="Enter your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Type
                </label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture_store">Furniture Store</SelectItem>
                    <SelectItem value="car_dealer">Car Dealer</SelectItem>
                    <SelectItem value="electronics_store">Electronics Store</SelectItem>
                    <SelectItem value="clothing_store">Clothing Store</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="service_provider">Service Provider</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleCreateAccount}
              disabled={!businessName || !businessType || createBusinessAccountMutation.isPending}
              className="w-full"
            >
              Create Business Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessAccounts;
