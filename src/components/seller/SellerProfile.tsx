
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Shield, Star, User } from 'lucide-react';
import { toast } from 'sonner';

const SellerProfile = () => {
  const [documents, setDocuments] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['seller-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('seller_verification')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const submitVerificationMutation = useMutation({
    mutationFn: async (formData: { documents: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('seller_verification')
        .upsert({
          user_id: user.id,
          verification_documents: formData.documents,
          verification_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile'] });
      toast.success('Verification request submitted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to submit verification request');
      console.error(error);
    },
  });

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmitVerification = () => {
    // In a real app, you'd upload files to storage first
    const documentNames = documents.map(doc => doc.name);
    submitVerificationMutation.mutate({ documents: documentNames });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Seller Profile & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Verification Status</h3>
                <Badge className={getStatusColor(profile.verification_status)}>
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.verification_status?.toUpperCase()}
                </Badge>
              </div>

              {profile.verification_status === 'pending' && (
                <p className="text-muted-foreground">
                  Your verification request is being reviewed. This usually takes 2-3 business days.
                </p>
              )}

              {profile.verification_status === 'verified' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">✓ Verified Seller</p>
                  <p className="text-green-600 text-sm">
                    You're a verified seller! Your listings will show a verification badge.
                  </p>
                </div>
              )}

              {profile.verification_status === 'rejected' && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 font-medium">Verification Rejected</p>
                  <p className="text-red-600 text-sm">
                    Please contact support or resubmit with correct documents.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Get Verified</h3>
              <p className="text-muted-foreground">
                Become a verified seller to build trust with buyers and get priority placement.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Verification Documents
                  </label>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload ID, business license, or other verification documents (PDF, JPG, PNG)
                  </p>
                </div>

                {documents.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Selected files:</p>
                    <ul className="text-sm text-muted-foreground">
                      {documents.map((doc, index) => (
                        <li key={index}>• {doc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  onClick={handleSubmitVerification}
                  disabled={documents.length === 0 || submitVerificationMutation.isPending}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit for Verification
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerProfile;
