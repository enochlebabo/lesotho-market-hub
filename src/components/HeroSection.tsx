
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Buy & Sell in
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                  {" "}Lesotho
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your trusted marketplace for second-hand goods, vehicles, electronics, and more. 
                Connect with buyers and sellers across the beautiful Kingdom in the Sky.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
              <Button size="lg" variant="outline">
                Sell Your Items
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-medium">4.8/5</span>
                <span className="ml-1">rating</span>
              </div>
              <div className="border-l border-gray-300 pl-6">
                <span className="font-medium">10,000+</span>
                <span className="ml-1">happy customers</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    🚗
                  </div>
                  <h3 className="font-semibold mb-2">Vehicles</h3>
                  <p className="text-sm text-gray-600">Cars, trucks, motorcycles</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    🏠
                  </div>
                  <h3 className="font-semibold mb-2">Furniture</h3>
                  <p className="text-sm text-gray-600">Home & office furniture</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white rounded-xl p-6 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    📱
                  </div>
                  <h3 className="font-semibold mb-2">Electronics</h3>
                  <p className="text-sm text-gray-600">Phones, laptops, gadgets</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    👕
                  </div>
                  <h3 className="font-semibold mb-2">Fashion</h3>
                  <p className="text-sm text-gray-600">Clothing & accessories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
