
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from './AuthContext';
import { Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={signOut}
        className="flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => navigate('/auth')}
      className="flex items-center space-x-2"
    >
      <Users className="w-4 h-4" />
      <span>Sign In</span>
    </Button>
  );
};

export default AuthButton;
