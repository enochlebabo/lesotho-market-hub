
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from 'lucide-react';

interface AdBannerProps {
  title: string;
  description: string;
  buttonText: string;
}

const AdBanner = ({ title, description, buttonText }: AdBannerProps) => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium opacity-90">Premium Advertisement</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {title}
                </h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  {description}
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  {buttonText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 opacity-20">
                  <div className="bg-white/20 rounded-lg p-4 h-24"></div>
                  <div className="bg-white/20 rounded-lg p-4 h-24 mt-6"></div>
                  <div className="bg-white/20 rounded-lg p-4 h-24 -mt-3"></div>
                  <div className="bg-white/20 rounded-lg p-4 h-24 mt-3"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold opacity-30">Ads</div>
                    <div className="text-sm opacity-60">Your Business Here</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdBanner;
