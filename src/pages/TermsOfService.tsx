
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-xl font-semibold">Terms of Service</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: January 2024</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using MoCha Market, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h3>2. Use License</h3>
            <p>Permission is granted to temporarily use MoCha Market for personal, non-commercial transitory viewing only.</p>

            <h3>3. User Responsibilities</h3>
            <p>Users are responsible for:</p>
            <ul>
              <li>Providing accurate information in listings</li>
              <li>Uploading between 5-30 photos per product listing</li>
              <li>Maintaining respectful communication with other users</li>
              <li>Following local laws and regulations</li>
            </ul>

            <h3>4. Prohibited Uses</h3>
            <p>You may not use our service for any illegal or unauthorized purpose nor may you, in the use of the service, violate any laws in your jurisdiction.</p>

            <h3>5. Listing Requirements</h3>
            <p>All product listings must include a minimum of 5 photos and maximum of 30 photos to ensure quality and transparency for buyers.</p>

            <h3>6. Limitation of Liability</h3>
            <p>MoCha Market acts as a platform connecting buyers and sellers. We are not responsible for the quality, safety, or legality of items listed.</p>

            <h3>7. Contact Information</h3>
            <p>Questions about the Terms of Service should be sent to us at legal@mochamarket.ls</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
