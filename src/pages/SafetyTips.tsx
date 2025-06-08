
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, MapPin, Eye, AlertTriangle, Phone } from 'lucide-react';

const SafetyTips = () => {
  const navigate = useNavigate();

  const tips = [
    {
      icon: MapPin,
      title: "Meet in Public Places",
      description: "Always arrange to meet in busy, well-lit public areas like shopping centers or markets."
    },
    {
      icon: Eye,
      title: "Inspect Before Paying",
      description: "Thoroughly examine the item before making any payment. Test electronics and check for damages."
    },
    {
      icon: Shield,
      title: "Trust Your Instincts",
      description: "If something feels wrong or too good to be true, trust your gut and walk away."
    },
    {
      icon: Phone,
      title: "Verify Contact Information",
      description: "Ensure the seller provides legitimate contact details and verify their identity."
    }
  ];

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
            <h1 className="text-xl font-semibold">Safety Tips</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-4">Stay Safe on MoCha Market</h1>
          <p className="text-muted-foreground">Your safety is our priority. Follow these guidelines for secure transactions.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {tips.map((tip, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <tip.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{tip.title}</h3>
                <p className="text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Warning Signs to Watch For
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-700">
            <ul className="space-y-2">
              <li>• Requests for payment before meeting</li>
              <li>• Prices that seem too good to be true</li>
              <li>• Pressure to complete the transaction quickly</li>
              <li>• Unwillingness to meet in person</li>
              <li>• Poor quality or limited photos of the item</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyTips;
