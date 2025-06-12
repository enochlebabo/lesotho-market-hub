
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import AuthButton from '@/components/auth/AuthButton';
import NavigationMenu from '@/components/NavigationMenu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { SearchWithSuggestions } from '@/components/search/SearchWithSuggestions';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleBrowseMarketplace = () => {
    navigate('/products');
  };

  const handleSellItems = () => {
    navigate('/list-product');
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>
                MoCha Market
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <MapPin className="w-3 h-3 mr-1" />
                Kingdom of Lesotho
              </Badge>
            </div>
            
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <SearchWithSuggestions
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
              />
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <AuthButton />
              <Button size="sm" onClick={handleSellItems}>
                <Tag className="w-4 h-4 mr-2" />
                List Item
              </Button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="py-2 border-t">
            <NavigationMenu />
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <SearchWithSuggestions
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search marketplace..."
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
        </div>

        <HeroSection />
        
        {/* Advertisement Banner */}
        <AdBanner 
          title="Grow Your Business in Lesotho"
          description="Reach thousands of customers across all 10 districts with affordable advertising packages"
          buttonText="Start Advertising"
        />
        
        <CategoryGrid />
        
        {/* Stats Section */}
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Where Goods Meet Good People
              </h2>
              <p className="text-muted-foreground">Supporting Lesotho's digital economy</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Districts Covered</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Local Businesses</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">25K+</div>
                <div className="text-sm text-muted-foreground">Items Listed</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Users</div>
              </div>
            </div>
          </div>
        </section>

        <FeaturedListings />

        {/* SME Support Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-blue-600 text-white dark:from-emerald-700 dark:to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">Empowering Lesotho's Economy</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Supporting SMEs and promoting digital transformation across the Kingdom of Lesotho. 
              From Maseru to the highlands, MoCha Market connects buyers and sellers nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={handleSellItems}>
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
      <ScrollToTop />
    </div>
  );
};

export default Index;
