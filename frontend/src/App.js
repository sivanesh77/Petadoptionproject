import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import UI components
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { toast } from 'sonner';

// Import Lucide icons
import { Heart, Shield, Star, Users, PawPrint, Home, Package, CheckCircle, Clock, XCircle, Plus, Search, Filter, Mail, Phone, MapPin, Award, Sparkles, Camera } from 'lucide-react';

// Configure axios
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
axios.defaults.baseURL = API_URL;

// Set auth token for requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Auth Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token, user: userData } = response.data;
      
      setAuthToken(access_token);
      setUser(userData);
      toast.success('Welcome back! 🎉');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('/api/auth/register', userData);
      toast.success('Welcome to PetAdopt! Please login to continue. 🐾');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxwZXQlMjBhZG9wdGlvbnxlbnwwfHx8fDE3NTU0OTc2ODV8MA&ixlib=rb-4.1.0&q=85"
          alt="Happy pet adoption"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-center mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
            <PawPrint className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Find Your Perfect
          </span>
          <br />
          <span className="text-gray-800">Companion</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with loving pets looking for their forever homes. 
          <span className="font-semibold text-blue-600"> Safe, trusted, and life-changing adoptions.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 rounded-full">
            <Heart className="mr-2 h-5 w-5" />
            Start Adopting
          </Button>
          <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-full">
            <Play className="mr-2 h-5 w-5" />
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">2,500+</div>
            <div className="text-gray-600 font-medium">Happy Adoptions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">98%</div>
            <div className="text-gray-600 font-medium">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600">24/7</div>
            <div className="text-gray-600 font-medium">Support</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce">
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
          <Heart className="h-6 w-6 text-pink-500" />
        </div>
      </div>
      <div className="absolute bottom-20 right-10 animate-bounce" style={{ animationDelay: '1s' }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
          <Star className="h-6 w-6 text-yellow-500" />
        </div>
      </div>
    </div>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe & Verified",
      description: "All pets are health-checked and verified by certified veterinarians",
      image: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBhZG9wdGlvbnxlbnwwfHx8fDE3NTU0OTc2ODV8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Perfect Matching",
      description: "AI-powered matching system to find your ideal pet companion",
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBldHN8ZW58MHx8fHwxNzU1NDk3NjkwfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Lifetime Support",
      description: "24/7 support team and community of pet parents to help you",
      image: "https://images.pexels.com/photos/33242934/pexels-photo-33242934.jpeg"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Trusted Platform",
      description: "Award-winning adoption platform trusted by thousands of families",
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxoYXBweSUyMHBldHN8ZW58MHx8fHwxNzU1NDk3NjkwfDA&ixlib=rb-4.1.0&q=85"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose PetAdopt?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're more than just an adoption platform. We're your partner in creating lifelong bonds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Login Component
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    address: '',
    phone: ''
  });
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) {
        // Navigation will be handled by App component
      }
    } else {
      const success = await register(formData);
      if (success) {
        setIsLogin(true);
        setFormData({ ...formData, password: '', name: '', address: '', phone: '' });
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1494913148647-353ae514b35e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxoYXBweSUyMHBldHN8ZW58MHx8fHwxNzU1NDk3NjkwfDA&ixlib=rb-4.1.0&q=85"
            alt="Happy pets"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="mb-8">
            <PawPrint className="h-16 w-16 mb-6 text-white" />
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Welcome to PetAdopt
            </h1>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Where every pet finds their perfect family, and every family finds their perfect companion.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Heart className="h-6 w-6" />
              </div>
              <span className="text-lg">Over 10,000 successful adoptions</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-lg">100% verified and healthy pets</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-lg">24/7 support community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="lg:hidden mb-4">
                <PawPrint className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Welcome Back!' : 'Join PetAdopt'}
              </CardTitle>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to find your perfect pet' : 'Create your account and start your journey'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="pl-10 h-12 bg-white border-gray-300 focus:border-blue-500 rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-12 bg-white border-gray-300 focus:border-blue-500 rounded-lg"
                  />
                </div>
                
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12 bg-white border-gray-300 focus:border-blue-500 rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-700 font-medium">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                        <Textarea
                          id="address"
                          placeholder="Enter your address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="pl-10 min-h-[80px] resize-none bg-white border-gray-300 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="phone"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10 h-12 bg-white border-gray-300 focus:border-blue-500 rounded-lg"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {isLogin ? (
                    <>
                      <Heart className="mr-2 h-5 w-5" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
              
              <div className="text-center pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              {isLogin && (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-blue-800 font-medium mb-1">Demo Admin Access</p>
                  <p className="text-xs text-blue-600">admin@petadoption.com / admin123</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Pet Gallery Component
const PetGallery = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    shipping_name: '',
    shipping_address: '',
    shipping_phone: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get('/api/pets');
      setPets(response.data);
    } catch (error) {
      toast.error('Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = async (e) => {
    e.preventDefault();
    if (!selectedPet) return;

    try {
      const orderData = {
        pet_id: selectedPet.id,
        ...shippingInfo
      };
      
      await axios.post('/api/orders', orderData);
      toast.success(`🎉 Adoption request submitted for ${selectedPet.name}! We'll be in touch soon.`);
      setSelectedPet(null);
      setShippingInfo({ shipping_name: '', shipping_address: '', shipping_phone: '' });
      fetchPets(); // Refresh to remove adopted pet
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit adoption request');
    }
  };

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen">
        {/* Hero Section - only for users */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Pets Section */}
        <div className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Meet Your New Best Friend
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Each of our pets is looking for a loving home. Browse through our available companions and find your perfect match.
              </p>
              
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-12">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by name, breed, or type..."
                    className="pl-10 h-12 bg-gray-50 border-gray-300 focus:border-blue-500 rounded-full"
                  />
                </div>
                <Button variant="outline" className="h-12 px-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full">
                  <Filter className="mr-2 h-5 w-5" />
                  Filter
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Finding your perfect companion...</p>
                </div>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-16">
                <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">All Pets Have Found Homes!</h3>
                <p className="text-gray-500 text-lg">Check back soon for new arrivals looking for loving families.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {pets.map((pet) => (
                  <Card key={pet.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white shadow-lg">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={`${API_URL}/api/pets/${pet.id}/image`}
                        alt={pet.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={`${pet.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'} font-medium`}>
                          {pet.gender === 'male' ? '♂ Male' : '♀ Female'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-white/90 text-gray-800 font-medium">
                          {pet.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-2xl text-gray-800 group-hover:text-blue-600 transition-colors">
                          {pet.name}
                        </h3>
                        <p className="text-gray-600 font-medium">{pet.breed}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-100 rounded-full p-1">
                            <span className="text-blue-600 font-medium">W</span>
                          </div>
                          <span className="text-gray-600">{pet.weight} kg</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-purple-100 rounded-full p-1">
                            <span className="text-purple-600 font-medium">H</span>
                          </div>
                          <span className="text-gray-600">{pet.height} cm</span>
                        </div>
                      </div>
                      
                      {pet.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{pet.description}</p>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 h-12"
                            onClick={() => {
                              setSelectedPet(pet);
                              setShippingInfo({ 
                                shipping_name: user?.name || '',
                                shipping_address: user?.address || '',
                                shipping_phone: user?.phone || ''
                              });
                            }}
                          >
                            <Heart className="mr-2 h-5 w-5" />
                            Adopt {pet.name}
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-md bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
                              <Heart className="mr-3 h-6 w-6 text-red-500" />
                              Adopt {selectedPet?.name}
                            </DialogTitle>
                            <p className="text-gray-600">Please provide your delivery information for your new companion.</p>
                          </DialogHeader>
                          
                          <form onSubmit={handleAdopt} className="space-y-5 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="shipping_name" className="text-gray-700 font-medium">Full Name</Label>
                              <Input
                                id="shipping_name"
                                value={shippingInfo.shipping_name}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_name: e.target.value })}
                                placeholder="Enter your full name"
                                required
                                className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="shipping_address" className="text-gray-700 font-medium">Delivery Address</Label>
                              <Textarea
                                id="shipping_address"
                                value={shippingInfo.shipping_address}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_address: e.target.value })}
                                placeholder="Enter complete delivery address"
                                required
                                className="min-h-[80px] resize-none bg-gray-50 border-gray-300 focus:border-blue-500"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="shipping_phone" className="text-gray-700 font-medium">Phone Number</Label>
                              <Input
                                id="shipping_phone"
                                value={shippingInfo.shipping_phone}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_phone: e.target.value })}
                                placeholder="Enter phone number"
                                required
                                className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500"
                              />
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                              <div className="flex items-center space-x-3">
                                <Package className="h-6 w-6 text-green-600" />
                                <div>
                                  <p className="text-green-800 font-semibold">Payment Method</p>
                                  <p className="text-green-700 text-sm">Cash on Delivery - Pay when your pet arrives safely!</p>
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              type="submit" 
                              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Confirm Adoption
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin view - simplified without hero
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Available Pets
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse all pets available for adoption on the platform.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading pets...</p>
            </div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-16">
            <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No pets available</h3>
            <p className="text-gray-500 text-lg">Add some pets to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={`${API_URL}/api/pets/${pet.id}/image`}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{pet.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Breed:</span> {pet.breed}</p>
                    <p><span className="font-medium">Category:</span> {pet.category}</p>
                    <p><span className="font-medium">Weight:</span> {pet.weight} kg</p>
                    <p><span className="font-medium">Height:</span> {pet.height} cm</p>
                    <p><span className="font-medium">Gender:</span> {pet.gender}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// User Orders Component
const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500 text-white', icon: Clock },
      approved: { color: 'bg-green-500 text-white', icon: CheckCircle },
      rejected: { color: 'bg-red-500 text-white', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} font-medium`}>
        <IconComponent className="mr-1 h-4 w-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your adoption requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Adoption Journey
          </h1>
          <p className="text-gray-600 text-lg">Track your pet adoption applications and their status</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Adoption Requests Yet</h3>
              <p className="text-gray-500 mb-6">Start your journey by browsing our available pets!</p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <PawPrint className="mr-2 h-5 w-5" />
                Browse Pets
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                        <PawPrint className="mr-3 h-6 w-6 text-blue-600" />
                        {order.pet_name}
                      </h3>
                      <p className="text-gray-600">Request #{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-lg mb-3">Delivery Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Contact Name</p>
                            <p className="font-medium text-gray-800">{order.shipping_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 rounded-full p-2">
                            <Phone className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-800">{order.shipping_phone}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 rounded-full p-2 mt-1">
                            <MapPin className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Delivery Address</p>
                            <p className="font-medium text-gray-800 leading-relaxed">{order.shipping_address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-lg mb-3">Request Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Applied On:</span>
                          <span className="font-medium text-gray-800">{new Date(order.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        {order.updated_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="font-medium text-gray-800">{new Date(order.updated_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-gray-600">Payment Method:</span>
                          <Badge className="bg-green-100 text-green-800">
                            <Package className="mr-1 h-4 w-4" />
                            Cash on Delivery
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {order.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-yellow-800 font-medium">Application Under Review</p>
                          <p className="text-yellow-700 text-sm">Our team is reviewing your application. We'll get back to you soon!</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-green-800 font-medium">Congratulations! Application Approved</p>
                          <p className="text-green-700 text-sm">We'll contact you soon to arrange the delivery of your new companion!</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-red-800 font-medium">Application Not Approved</p>
                          <p className="text-red-700 text-sm">Unfortunately, this application wasn't approved. Please try with other pets or contact us for more information.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const [pets, setPets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petFormData, setPetFormData] = useState({
    name: '',
    category: '',
    weight: '',
    height: '',
    breed: '',
    gender: 'male',
    description: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [petsResponse, ordersResponse] = await Promise.all([
        axios.get('/api/admin/pets'),
        axios.get('/api/orders')
      ]);
      setPets(petsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error('Please select an image for the pet');
      return;
    }

    const formData = new FormData();
    Object.keys(petFormData).forEach(key => {
      formData.append(key, petFormData[key]);
    });
    formData.append('image', selectedImage);

    try {
      await axios.post('/api/pets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('🎉 Pet added successfully! Ready for adoption.');
      setPetFormData({
        name: '',
        category: '',
        weight: '',
        height: '',
        breed: '',
        gender: 'male',
        description: ''
      });
      setSelectedImage(null);
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add pet');
    }
  };

  const handleOrderAction = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      toast.success(`Order ${status} successfully! 🎯`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Manage your pet adoption platform with ease</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <PawPrint className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{pets.length}</h3>
              <p className="text-gray-600">Total Pets</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{pets.filter(p => p.available).length}</h3>
              <p className="text-gray-600">Available</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{orders.length}</h3>
              <p className="text-gray-600">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{orders.filter(o => o.status === 'pending').length}</h3>
              <p className="text-gray-600">Pending</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pets" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-white shadow-lg border-0 h-14">
            <TabsTrigger value="pets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold h-12">
              <PawPrint className="mr-2 h-5 w-5" />
              Pets ({pets.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold h-12">
              <Package className="mr-2 h-5 w-5" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="add-pet" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-semibold h-12">
              <Plus className="mr-2 h-5 w-5" />
              Add Pet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="bg-white shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={`${API_URL}/api/pets/${pet.id}/image`}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={pet.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                        {pet.available ? 'Available' : 'Adopted'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{pet.name}</h3>
                        <p className="text-gray-600 font-medium">{pet.breed}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Category</p>
                          <p className="font-medium text-gray-800">{pet.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Gender</p>
                          <p className="font-medium text-gray-800 capitalize">{pet.gender}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Weight</p>
                          <p className="font-medium text-gray-800">{pet.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Height</p>
                          <p className="font-medium text-gray-800">{pet.height} cm</p>
                        </div>
                      </div>
                      {pet.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{pet.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white shadow-lg border-0 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                        <PawPrint className="mr-3 h-6 w-6 text-blue-600" />
                        {order.pet_name}
                      </h3>
                      <p className="text-gray-600">Request #{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <Badge className={
                      order.status === 'pending' ? 'bg-yellow-500 text-white h-8 px-4' :
                      order.status === 'approved' ? 'bg-green-500 text-white h-8 px-4' :
                      'bg-red-500 text-white h-8 px-4'
                    }>
                      {order.status === 'pending' && <Clock className="mr-2 h-4 w-4" />}
                      {order.status === 'approved' && <CheckCircle className="mr-2 h-4 w-4" />}
                      {order.status === 'rejected' && <XCircle className="mr-2 h-4 w-4" />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 text-lg">Customer Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 rounded-full p-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Customer Name</p>
                            <p className="font-medium text-gray-800">{order.shipping_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 rounded-full p-2">
                            <Phone className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-800">{order.shipping_phone}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="bg-purple-100 rounded-full p-2 mt-1">
                            <MapPin className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium text-gray-800 leading-relaxed">{order.shipping_address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 text-lg">Order Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Applied On:</span>
                          <span className="font-medium text-gray-800">{new Date(order.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        {order.updated_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="font-medium text-gray-800">{new Date(order.updated_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        )}
                        <div className="pt-3 border-t">
                          <Badge className="bg-green-100 text-green-800">
                            <Package className="mr-2 h-4 w-4" />
                            Cash on Delivery
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {order.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                      <Button
                        onClick={() => handleOrderAction(order.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 font-semibold"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Approve Application
                      </Button>
                      <Button
                        onClick={() => handleOrderAction(order.id, 'rejected')}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50 h-12 font-semibold"
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        Reject Application
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="add-pet">
            <Card className="bg-white shadow-xl border-0 max-w-4xl mx-auto">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                  <Plus className="mr-3 h-6 w-6 text-blue-600" />
                  Add New Pet for Adoption
                </CardTitle>
                <p className="text-gray-600">Fill in all the details to add a new pet to the adoption platform.</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleAddPet} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">Pet Name *</Label>
                      <Input
                        id="name"
                        value={petFormData.name}
                        onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                        placeholder="e.g., Buddy, Luna, Max"
                        required
                        className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-700 font-medium">Category *</Label>
                      <Input
                        id="category"
                        value={petFormData.category}
                        onChange={(e) => setPetFormData({ ...petFormData, category: e.target.value })}
                        placeholder="e.g., Dog, Cat, Bird, Rabbit"
                        required
                        className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="breed" className="text-gray-700 font-medium">Breed *</Label>
                      <Input
                        id="breed"
                        value={petFormData.breed}
                        onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                        placeholder="e.g., Golden Retriever, Persian Cat"
                        required
                        className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-gray-700 font-medium">Gender *</Label>
                      <Select 
                        value={petFormData.gender} 
                        onValueChange={(value) => setPetFormData({ ...petFormData, gender: value })}
                      >
                        <SelectTrigger className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">♂ Male</SelectItem>
                          <SelectItem value="female">♀ Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-gray-700 font-medium">Weight (kg) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={petFormData.weight}
                        onChange={(e) => setPetFormData({ ...petFormData, weight: e.target.value })}
                        placeholder="e.g., 15.5"
                        required
                        className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-gray-700 font-medium">Height (cm) *</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        min="0"
                        value={petFormData.height}
                        onChange={(e) => setPetFormData({ ...petFormData, height: e.target.value })}
                        placeholder="e.g., 45.0"
                        required
                        className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={petFormData.description}
                      onChange={(e) => setPetFormData({ ...petFormData, description: e.target.value })}
                      placeholder="Tell potential adopters about this pet's personality, habits, and special needs..."
                      className="min-h-[120px] resize-none bg-gray-50 border-gray-300 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-gray-700 font-medium">Pet Photo *</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedImage(e.target.files[0])}
                          required
                          className="h-11 bg-gray-50 border-gray-300 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div className="bg-blue-100 rounded-lg p-3">
                        <Camera className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Upload a clear, high-quality photo of the pet (JPG, PNG, GIF)</p>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Add Pet to Adoption Platform
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Header Component
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
              <PawPrint className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PetAdopt
              </h1>
              <p className="text-xs text-gray-600">Find Your Perfect Companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-gray-700 font-medium">Welcome, {user?.name}</p>
              <Badge className={`${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} font-medium`}>
                <Star className="mr-1 h-3 w-3" />
                {user?.role === 'admin' ? 'Administrator' : 'Pet Lover'}
              </Badge>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium h-10"
            >
              <span className="hidden sm:inline mr-2">Sign Out</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading PetAdopt</h3>
            <p className="text-gray-600">Preparing your pet adoption journey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {user.role === 'admin' ? (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/pets" element={<PetGallery />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<PetGallery />} />
              <Route path="/orders" element={<UserOrders />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>
      
      {/* Bottom Navigation for Users */}
      {user.role === 'user' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
          <div className="container mx-auto max-w-md px-4 py-4">
            <div className="flex space-x-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 rounded-full font-semibold shadow-lg"
              >
                <Home className="mr-2 h-5 w-5" />
                Browse Pets
              </Button>
              <Button 
                onClick={() => window.location.href = '/orders'}
                variant="outline"
                className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 h-12 rounded-full font-semibold"
              >
                <Package className="mr-2 h-5 w-5" />
                My Orders
              </Button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

// Add missing Play icon
const Play = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

export default App;