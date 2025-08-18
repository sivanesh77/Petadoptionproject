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
import { Heart, Shield, Star, Users, PawPrint, Home, Package, CheckCircle, Clock, XCircle, Plus, Search, Filter, Mail, Phone, MapPin, Award, User, Camera, Menu } from 'lucide-react';

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
      toast.success('Welcome back!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('/api/auth/register', userData);
      toast.success('Registration successful! Please login.');
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 rounded-lg p-3">
                <PawPrint className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your PetAdopt account' : 'Join PetAdopt to find your perfect companion'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <Textarea
                        id="address"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="pl-10 min-h-[80px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
            
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {isLogin && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Demo Admin Access</p>
                <p className="text-xs text-blue-600">admin@petadoption.com / admin123</p>
              </div>
            )}
          </CardContent>
        </Card>
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
      toast.success(`Adoption request submitted for ${selectedPet.name}!`);
      setSelectedPet(null);
      setShippingInfo({ shipping_name: '', shipping_address: '', shipping_phone: '' });
      fetchPets(); // Refresh to remove adopted pet
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit adoption request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Companion
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Browse our collection of loving pets looking for their forever homes. Each pet comes with complete health records and care information.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by name, breed, or category..."
                className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white py-8 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Health Verified</p>
                <p className="text-sm text-gray-600">All pets health checked</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Loving Homes</p>
                <p className="text-sm text-gray-600">2,500+ successful adoptions</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">24/7 Support</p>
                <p className="text-sm text-gray-600">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {pets.length === 0 ? (
          <div className="text-center py-12">
            <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No pets available</h3>
            <p className="text-gray-500">Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200 bg-white border border-gray-200">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={`${API_URL}/api/pets/${pet.id}/image`}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${pet.gender === 'male' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'} text-xs`}>
                      {pet.gender === 'male' ? 'Male' : 'Female'}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{pet.name}</h3>
                      <p className="text-gray-600 text-sm">{pet.breed} • {pet.category}</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{pet.weight} kg</span>
                      <span>{pet.height} cm</span>
                    </div>
                    
                    {pet.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{pet.description}</p>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
                          onClick={() => {
                            setSelectedPet(pet);
                            setShippingInfo({ 
                              shipping_name: user?.name || '',
                              shipping_address: user?.address || '',
                              shipping_phone: user?.phone || ''
                            });
                          }}
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Adopt {pet.name}
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-md bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-gray-900">
                            Adopt {selectedPet?.name}
                          </DialogTitle>
                          <p className="text-gray-600">Please provide your delivery information</p>
                        </DialogHeader>
                        
                        <form onSubmit={handleAdopt} className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="shipping_name" className="text-gray-700">Full Name</Label>
                            <Input
                              id="shipping_name"
                              value={shippingInfo.shipping_name}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_name: e.target.value })}
                              placeholder="Enter your full name"
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="shipping_address" className="text-gray-700">Delivery Address</Label>
                            <Textarea
                              id="shipping_address"
                              value={shippingInfo.shipping_address}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_address: e.target.value })}
                              placeholder="Enter complete delivery address"
                              required
                              className="min-h-[80px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="shipping_phone" className="text-gray-700">Phone Number</Label>
                            <Input
                              id="shipping_phone"
                              value={shippingInfo.shipping_phone}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_phone: e.target.value })}
                              placeholder="Enter phone number"
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-3">
                              <Package className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-green-800 font-medium">Payment Method</p>
                                <p className="text-green-700 text-sm">Cash on Delivery</p>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Adoption
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
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
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border font-medium`}>
        <IconComponent className="mr-1 h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Adoption Requests</h1>
          <p className="text-gray-600">Track your pet adoption applications</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto border border-gray-200">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No adoption requests yet</h3>
              <p className="text-gray-500 mb-4">Start your journey by browsing our available pets!</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PawPrint className="mr-2 h-4 w-4" />
                Browse Pets
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{order.pet_name}</h3>
                      <p className="text-gray-600 text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Delivery Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">{order.shipping_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">{order.shipping_phone}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-gray-600">Address:</span>
                            <p className="font-medium text-gray-900">{order.shipping_address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Applied:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {order.updated_at && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Updated:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(order.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <span className="text-gray-600">Payment:</span>
                          <Badge className="bg-green-100 text-green-800 border border-green-300">
                            <Package className="mr-1 h-3 w-3" />
                            Cash on Delivery
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Messages */}
                  {order.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-yellow-800 font-medium">Application Under Review</p>
                          <p className="text-yellow-700 text-sm">We're reviewing your application and will get back to you soon!</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-green-800 font-medium">Application Approved!</p>
                          <p className="text-green-700 text-sm">Congratulations! We'll contact you soon to arrange delivery.</p>
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
                          <p className="text-red-700 text-sm">Unfortunately, this application wasn't approved. Please contact us for more information.</p>
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
      toast.error('Please select an image');
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
      toast.success('Pet added successfully!');
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
      toast.success(`Order ${status} successfully!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your pet adoption platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                  <PawPrint className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
                  <p className="text-gray-600 text-sm">Total Pets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-lg p-3 mr-4">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pets.filter(p => p.available).length}</p>
                  <p className="text-gray-600 text-sm">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-lg p-3 mr-4">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-lg p-3 mr-4">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</p>
                  <p className="text-gray-600 text-sm">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pets" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="pets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Pets ({pets.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="add-pet" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Add Pet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="bg-white shadow-sm border border-gray-200">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={`${API_URL}/api/pets/${pet.id}/image`}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={pet.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}>
                        {pet.available ? 'Available' : 'Adopted'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{pet.name}</h3>
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
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{order.pet_name}</h3>
                      <p className="text-gray-600 text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <Badge className={
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                      order.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-300' :
                      'bg-red-100 text-red-800 border border-red-300'
                    }>
                      {order.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                      {order.status === 'approved' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {order.status === 'rejected' && <XCircle className="mr-1 h-3 w-3" />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Name:</span> <span className="font-medium text-gray-900">{order.shipping_name}</span></p>
                        <p><span className="text-gray-600">Phone:</span> <span className="font-medium text-gray-900">{order.shipping_phone}</span></p>
                        <p><span className="text-gray-600">Address:</span> <span className="font-medium text-gray-900">{order.shipping_address}</span></p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Order Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Applied:</span> <span className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span></p>
                        {order.updated_at && (
                          <p><span className="text-gray-600">Updated:</span> <span className="font-medium text-gray-900">{new Date(order.updated_at).toLocaleDateString()}</span></p>
                        )}
                        <div className="pt-2 border-t border-gray-200">
                          <Badge className="bg-green-100 text-green-800 border border-green-300">
                            <Package className="mr-1 h-3 w-3" />
                            Cash on Delivery
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {order.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => handleOrderAction(order.id, 'approved')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleOrderAction(order.id, 'rejected')}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="add-pet">
            <Card className="bg-white shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Add New Pet</CardTitle>
                <p className="text-gray-600">Fill in the details to add a new pet for adoption</p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddPet} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Pet Name</Label>
                      <Input
                        id="name"
                        value={petFormData.name}
                        onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                        placeholder="e.g., Buddy, Luna"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-700">Category</Label>
                      <Input
                        id="category"
                        value={petFormData.category}
                        onChange={(e) => setPetFormData({ ...petFormData, category: e.target.value })}
                        placeholder="e.g., Dog, Cat, Bird"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="breed" className="text-gray-700">Breed</Label>
                      <Input
                        id="breed"
                        value={petFormData.breed}
                        onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                        placeholder="e.g., Golden Retriever"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                      <Select 
                        value={petFormData.gender} 
                        onValueChange={(value) => setPetFormData({ ...petFormData, gender: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-gray-700">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={petFormData.weight}
                        onChange={(e) => setPetFormData({ ...petFormData, weight: e.target.value })}
                        placeholder="15.5"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-gray-700">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={petFormData.height}
                        onChange={(e) => setPetFormData({ ...petFormData, height: e.target.value })}
                        placeholder="45.0"
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      value={petFormData.description}
                      onChange={(e) => setPetFormData({ ...petFormData, description: e.target.value })}
                      placeholder="Tell us about this pet's personality..."
                      className="min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-gray-700">Pet Photo</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        required
                        className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <div className="bg-gray-100 rounded-lg p-3">
                        <Camera className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Pet
                  </Button>
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PetAdopt</h1>
              <p className="text-xs text-gray-600">Professional Pet Adoption</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-gray-900 font-medium">{user?.name}</p>
              <Badge className={`${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} border text-xs`}>
                {user?.role === 'admin' ? 'Administrator' : 'Member'}
              </Badge>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Sign Out
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading PetAdopt</h3>
            <p className="text-gray-600">Please wait...</p>
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
      <main>
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto max-w-md px-4 py-3">
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10"
              >
                <Home className="mr-2 h-4 w-4" />
                Browse Pets
              </Button>
              <Button 
                onClick={() => window.location.href = '/orders'}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-10"
              >
                <Package className="mr-2 h-4 w-4" />
                My Orders
              </Button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default App;