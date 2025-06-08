
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-800">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Stay Updated with LesothoMarket
              </h3>
              <p className="text-gray-300">
                Get notified about new listings, deals, and local business opportunities.
              </p>
            </div>
            <div className="flex space-x-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button>
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">LesothoMarket</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting buyers and sellers across the beautiful Kingdom of Lesotho. 
              Your trusted marketplace for quality second-hand goods.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Serving all 10 districts of Lesotho</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => navigate('/products?category=vehicles')} className="hover:text-white transition-colors">Vehicles</button></li>
              <li><button onClick={() => navigate('/products?category=electronics')} className="hover:text-white transition-colors">Electronics</button></li>
              <li><button onClick={() => navigate('/products?category=furniture')} className="hover:text-white transition-colors">Furniture</button></li>
              <li><button onClick={() => navigate('/products?category=fashion')} className="hover:text-white transition-colors">Fashion</button></li>
              <li><button onClick={() => navigate('/products?category=services')} className="hover:text-white transition-colors">Services</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => navigate('/contact-us')} className="hover:text-white transition-colors">Advertise with Us</button></li>
              <li><button onClick={() => navigate('/list-product')} className="hover:text-white transition-colors">Business Listings</button></li>
              <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Seller Dashboard</button></li>
              <li><button onClick={() => navigate('/help-center')} className="hover:text-white transition-colors">Success Stories</button></li>
              <li><button onClick={() => navigate('/help-center')} className="hover:text-white transition-colors">Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => navigate('/help-center')} className="hover:text-white transition-colors">Help Center</button></li>
              <li><button onClick={() => navigate('/safety-tips')} className="hover:text-white transition-colors">Safety Tips</button></li>
              <li><button onClick={() => navigate('/terms-of-service')} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate('/contact-us')} className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 LesothoMarket. All rights reserved. Made with ❤️ in Lesotho.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>50K+ Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>4.8/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
