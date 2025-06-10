
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, Shield, Star, User, Phone, Link as LinkIcon, IdCard } from 'lucide-react';
import { toast } from 'sonner';

const EnhancedSellerProfile = () => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [socialMediaLink, setSocialMediaLink] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['enhanced-seller-profile'],
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
    mutationFn: async (formData: { 
      documents: string[];
      governmentIdUrl?: string;
      socialMediaLink?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('seller_verification')
        .upsert({
          user_id: user.id,
          verification_documents: formData.documents,
          government_id_url: formData.governmentIdUrl,
          social_media_link: formData.socialMediaLink,
          verification_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-seller-profile'] });
      toast.success('Enhanced verification request submitted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to submit verification request');
      console.error(error);
    },
  });

  const verifyMobileMutation = useMutation({
    mutationFn: async (otpCode: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // In a real app, you'd verify the OTP with your SMS provider
      // For now, we'll just mark as verified if OTP is "123456"
      if (otpCode === '123456') {
        const { error } = await supabase
          .from('seller_verification')
          .update({ mobile_verified: true })
          .eq('user_id', user.id);

        if (error) throw error;
        return true;
      } else {
        throw new Error('Invalid OTP code');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-seller-profile'] });
      toast.success('Mobile number verified successfully!');
      setOtpCode('');
    },
    onError: (error) => {
      toast.error('Invalid OTP code. Use 123456 for demo.');
    },
  });

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleGovernmentIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGovernmentId(e.target.files[0]);
    }
  };

  const handleSubmitVerification = () => {
    const documentNames = documents.map(doc => doc.name);
    const governmentIdUrl = governmentId ? governmentId.name : undefined;
    
    submitVerificationMutation.mutate({ 
      documents: documentNames,
      governmentIdUrl,
      socialMediaLink: socialMediaLink || undefined
    });
  };

  const sendOTP = () => {
    // In a real app, you'd integrate with SMS provider
    toast.info('OTP sent! Use code: 123456 for demo');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Top Seller': return 'bg-gold-500 text-white';
      case 'Fast Responder': return 'bg-blue-500 text-white';
      case 'Experienced Seller': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Enhanced Seller Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Verification Status</h3>
                <Badge className={getStatusColor(profile.verification_status)}>
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.verification_status?.toUpperCase()}
                </Badge>
              </div>

              {/* Verification Badges */}
              {profile.verification_badges && Array.isArray(profile.verification_badges) && profile.verification_badges.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Seller Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.verification_badges.map((badge: string, index: number) => (
                      <Badge key={index} className={getBadgeColor(badge)}>
                        <Star className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Verification */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Mobile Verification
                </h4>
                {profile.mobile_verified ? (
                  <Badge className="bg-green-500">
                    ✓ Mobile Verified
                  </Badge>
                ) : (
                  <div className="space-y-2">
                    <Button onClick={sendOTP} variant="outline">
                      Send OTP to Mobile
                    </Button>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter OTP code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                      />
                      <Button 
                        onClick={() => verifyMobileMutation.mutate(otpCode)}
                        disabled={!otpCode || verifyMobileMutation.isPending}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Government ID */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center">
                  <IdCard className="w-4 h-4 mr-2" />
                  Government ID
                </h4>
                {profile.government_id_url ? (
                  <Badge className="bg-green-500">
                    ✓ Government ID Uploaded
                  </Badge>
                ) : (
                  <p className="text-muted-foreground">Upload your government ID for enhanced verification</p>
                )}
              </div>

              {/* Social Media */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Social Media Profile
                </h4>
                {profile.social_media_link ? (
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500">✓ Social Media Linked</Badge>
                    <a 
                      href={profile.social_media_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {profile.social_media_link}
                    </a>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Link your social media profile to build trust</p>
                )}
              </div>

              {profile.verification_status === 'verified' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">✓ Enhanced Verified Seller</p>
                  <p className="text-green-600 text-sm">
                    You're a fully verified seller with enhanced trust badges!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Enhanced Seller Verification</h3>
              <p className="text-muted-foreground">
                Complete enhanced verification to unlock seller badges and build maximum trust with buyers.
              </p>

              <div className="space-y-4">
                {/* Documents Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business/Identity Documents
                  </label>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="cursor-pointer"
                  />
                </div>

                {/* Government ID Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Government ID (National ID, Passport, Driver's License)
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleGovernmentIdUpload}
                    className="cursor-pointer"
                  />
                </div>

                {/* Social Media Link */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Social Media Profile Link (Facebook, LinkedIn, etc.)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://facebook.com/yourprofile"
                    value={socialMediaLink}
                    onChange={(e) => setSocialMediaLink(e.target.value)}
                  />
                </div>

                {(documents.length > 0 || governmentId || socialMediaLink) && (
                  <div>
                    <p className="text-sm font-medium mb-2">Selected files & info:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {documents.map((doc, index) => (
                        <li key={index}>• {doc.name}</li>
                      ))}
                      {governmentId && <li>• Government ID: {governmentId.name}</li>}
                      {socialMediaLink && <li>• Social Media: {socialMediaLink}</li>}
                    </ul>
                  </div>
                )}

                <Button 
                  onClick={handleSubmitVerification}
                  disabled={(documents.length === 0 && !governmentId && !socialMediaLink) || submitVerificationMutation.isPending}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Enhanced Verification
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSellerProfile;
