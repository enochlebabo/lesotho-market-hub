
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Shield } from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Check if user is admin and redirect accordingly
      if (user.email === 'admin@mochamarket.co.ls' || 
          user.user_metadata?.first_name === 'admin' || 
          user.user_metadata?.last_name === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          if (isAdminLogin) {
            toast.success("Welcome to Admin Panel!");
            navigate('/admin');
          } else {
            toast.success("Welcome back to MoCha Market!");
            navigate('/');
          }
        }
      } else {
        if (!firstName || !lastName) {
          toast.error("Please fill in all fields");
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Please check your email to verify your account.");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to MoCha Market</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Kingdom of Lesotho</span>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {isAdminLogin ? 'Admin Access' : (isLogin ? 'Welcome back' : 'Join MoCha Market')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isAdminLogin 
                ? 'Administrative access to manage the platform'
                : (isLogin 
                  ? 'Sign in to your account to start buying and selling' 
                  : 'Create your account to join Lesotho\'s digital marketplace'
                )
              }
            </p>
          </div>

          {/* Login Type Selection */}
          <div className="flex justify-center space-x-4">
            <Button
              variant={!isAdminLogin ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAdminLogin(false)}
            >
              User Login
            </Button>
            <Button
              variant={isAdminLogin ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAdminLogin(true)}
              className="flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Login</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                {isAdminLogin && <Shield className="w-5 h-5 text-blue-600" />}
                <span>{isAdminLogin ? 'Admin Sign In' : (isLogin ? 'Sign In' : 'Create Account')}</span>
                {isAdminLogin && <Badge variant="secondary">Admin</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && !isAdminLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your first name"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Your last name"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAdminLogin ? "admin@mochamarket.co.ls" : "your.email@example.com"}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : (isAdminLogin ? 'Access Admin Panel' : (isLogin ? 'Sign In' : 'Create Account'))}
                </Button>
              </form>

              {!isAdminLogin && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    {isLogin 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            <p>By joining MoCha Market, you're supporting</p>
            <p className="font-medium text-green-600">Lesotho's digital economy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
