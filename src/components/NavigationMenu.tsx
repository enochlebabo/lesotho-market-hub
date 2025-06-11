
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { 
  Home, 
  Search, 
  Tag, 
  Users, 
  HelpCircle, 
  Shield, 
  FileText, 
  Mail,
  Settings,
  User
} from 'lucide-react';

const NavigationMenu = () => {
  const navigate = useNavigate();

  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate('/')}>
            Homepage
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/products')}>
            Browse All Items
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="flex items-center space-x-2">
          <Search className="w-4 h-4" />
          <span>Browse</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate('/products')}>
            All Products
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => navigate('/products?category=vehicles')}>
            Vehicles
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/products?category=electronics')}>
            Electronics
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/products?category=furniture')}>
            Furniture
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/products?category=fashion')}>
            Fashion
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/products?category=services')}>
            Services
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="flex items-center space-x-2">
          <Tag className="w-4 h-4" />
          <span>Sell</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate('/list-product')}>
            List an Item
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/seller-dashboard')}>
            Seller Dashboard
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Account</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate('/auth')}>
            <User className="w-4 h-4 mr-2" />
            Sign In / Sign Up
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => navigate('/seller-dashboard')}>
            <Settings className="w-4 h-4 mr-2" />
            My Dashboard
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4" />
          <span>Support</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate('/help-center')}>
            Help Center
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/safety-tips')}>
            <Shield className="w-4 h-4 mr-2" />
            Safety Tips
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/contact-us')}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Us
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={() => navigate('/terms-of-service')}>
            <FileText className="w-4 h-4 mr-2" />
            Terms of Service
          </MenubarItem>
          <MenubarItem onClick={() => navigate('/privacy-policy')}>
            <FileText className="w-4 h-4 mr-2" />
            Privacy Policy
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default NavigationMenu;
