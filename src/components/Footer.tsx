
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Star, ArrowRight, Code, Globe, Mail, Phone, GraduationCap, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Founder Information Section */}
        <div className="py-12 border-b border-gray-800">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Heart className="w-8 h-8 text-red-300" />
                  <h3 className="text-2xl font-bold">Meet the Founder & Developer</h3>
                </div>
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
                    <h4 className="text-xl font-semibold mb-4 text-yellow-300">Founder & Lead Developer</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-5 h-5 text-yellow-300" />
                          <span className="font-medium">Education & Background</span>
                        </div>
                        <p className="text-sm opacity-90">
                          Scholar and Computer Science Graduate with expertise in AI, Machine Learning, 
                          and Full-Stack Development
                        </p>
                        <p className="text-sm opacity-90">
                          Specialized in creating innovative digital solutions for emerging markets
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-yellow-300" />
                          <span className="font-medium">Inspiration & Mission</span>
                        </div>
                        <p className="text-sm opacity-90">
                          Inspired by the potential of technology to transform local economies 
                          and empower communities across Africa
                        </p>
                        <p className="text-sm opacity-90">
                          Dedicated to bridging the digital divide and fostering economic growth in Lesotho
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4" />
                          <span>founder@mochamarket.co.ls</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4" />
                          <span>+266 5000 0001</span>
                        </div>
                        <Button variant="secondary" size="sm">
                          Contact Founder
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <Globe className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                    <h4 className="font-semibold">Tech Innovation</h4>
                    <p className="text-sm opacity-80">AI-Powered Solutions for Africa</p>
                  </div>
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                    <h4 className="font-semibold">Community Impact</h4>
                    <p className="text-sm opacity-80">Empowering Local Entrepreneurs</p>
                  </div>
                  <div className="text-center">
                    <Code className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                    <h4 className="font-semibold">Custom Development</h4>
                    <p className="text-sm opacity-80">Bespoke Solutions Available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-800">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Stay Updated with MoCha Market
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
            <h3 className="text-xl font-bold">MoCha Market</h3>
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
              © 2024 MoCha Market. All rights reserved. Made with ❤️ in Lesotho.
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
              <div className="flex items-center space-x-1">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>Scholar-Founded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
