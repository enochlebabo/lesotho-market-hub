
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Tag, Shield, Users, ArrowRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleBrowseMarketplace = () => {
    navigate('/products');
  };

  const handleSellItems = () => {
    navigate('/list-product');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Kingdom of Lesotho's
            <br />
            <span className="text-yellow-300">Premier Marketplace</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Buy and sell goods across all 10 districts. From Maseru to the highlands, 
            connect with trusted sellers and find everything you need.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            {/* Enhanced Browse Goods Button */}
            <div className="relative">
              <Button 
                size="lg" 
                className="relative bg-white text-blue-600 hover:bg-blue-50 font-semibold px-12 py-6 text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
                onClick={handleBrowseMarketplace}
              >
                <Search className="w-6 h-6 mr-3" />
                <span className="relative">
                  View All 25K+ Items
                </span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 bg-white rounded-md opacity-20 animate-ping"></div>
              
              {/* Hot badge */}
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                BROWSE
              </div>
            </div>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:shadow-lg w-full sm:w-auto"
              onClick={handleSellItems}
            >
              <Tag className="w-5 h-5 mr-3" />
              List Your Goods
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-3">
              <Shield className="w-12 h-12 mx-auto text-yellow-300" />
              <h3 className="text-xl font-semibold">Verified Sellers</h3>
              <p className="text-blue-100">Trade with confidence using our seller verification system</p>
            </div>
            <div className="text-center space-y-3">
              <Users className="w-12 h-12 mx-auto text-yellow-300" />
              <h3 className="text-xl font-semibold">Local Community</h3>
              <p className="text-blue-100">Supporting businesses and individuals across Lesotho</p>
            </div>
            <div className="text-center space-y-3">
              <Sparkles className="w-12 h-12 mx-auto text-yellow-300" />
              <h3 className="text-xl font-semibold">Quality Assured</h3>
              <p className="text-blue-100">AI-powered image quality checks for better listings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
