
import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Tag, Users, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedListings from '@/components/FeaturedListings';
import AdBanner from '@/components/AdBanner';
import Footer from '@/components/Footer';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">LesothoMarket</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <MapPin className="w-3 h-3 mr-1" />
                Lesotho
              </Badge>
            </div>
            
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for items, vehicles, electronics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button size="sm">
                <Tag className="w-4 h-4 mr-2" />
                Sell Now
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection />
        
        {/* Advertisement Banner */}
        <AdBanner 
          title="Advertise Your Business"
          description="Reach thousands of potential customers across Lesotho"
          buttonText="Start Advertising"
        />
        
        <CategoryGrid />
        
        {/* Stats Section */}
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">25K+</div>
                <div className="text-sm text-muted-foreground">Items Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Local Businesses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">10</div>
                <div className="text-sm text-muted-foreground">Districts Covered</div>
              </div>
            </div>
          </div>
        </section>

        <FeaturedListings />

        {/* Business Advertisement Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">Grow Your Business in Lesotho</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Connect with local customers and expand your reach across all 10 districts of Lesotho. 
              From Maseru to the highlands, your business deserves to be seen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                List Your Business
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                View Ad Packages
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
