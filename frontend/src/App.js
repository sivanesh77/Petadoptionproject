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
      toast.success('Login successful!');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            PetAdopt
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-11"
              />
            </div>
            
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="min-h-[80px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11"
                  />
                </div>
              </>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {isLogin && (
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Admin Login: admin@petadoption.com / admin123
              </p>
            </div>
          )}
        </CardContent>
      </Card>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Find Your Perfect Companion
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our adorable pets looking for loving homes. Each pet comes with complete health records and care information.
          </p>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pets available for adoption at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/95 backdrop-blur-sm border-0">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={`${API_URL}/api/pets/${pet.id}/image`}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-gray-800">{pet.name}</h3>
                      <Badge className={`${pet.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                        {pet.gender}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Breed:</span> {pet.breed}</p>
                      <p><span className="font-medium">Category:</span> {pet.category}</p>
                      <p><span className="font-medium">Weight:</span> {pet.weight} kg</p>
                      <p><span className="font-medium">Height:</span> {pet.height} cm</p>
                    </div>
                    
                    {pet.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{pet.description}</p>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold rounded-lg transition-all duration-200"
                          onClick={() => {
                            setSelectedPet(pet);
                            setShippingInfo({ 
                              shipping_name: user?.name || '',
                              shipping_address: user?.address || '',
                              shipping_phone: user?.phone || ''
                            });
                          }}
                        >
                          Adopt {pet.name}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-gray-800">
                            Adopt {selectedPet?.name}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdopt} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="shipping_name">Full Name</Label>
                            <Input
                              id="shipping_name"
                              value={shippingInfo.shipping_name}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_name: e.target.value })}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="shipping_address">Delivery Address</Label>
                            <Textarea
                              id="shipping_address"
                              value={shippingInfo.shipping_address}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_address: e.target.value })}
                              placeholder="Enter complete delivery address"
                              required
                              className="min-h-[80px] resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="shipping_phone">Phone Number</Label>
                            <Input
                              id="shipping_phone"
                              value={shippingInfo.shipping_phone}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, shipping_phone: e.target.value })}
                              placeholder="Enter phone number"
                              required
                            />
                          </div>
                          <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-sm text-amber-800 font-medium">Payment Method</p>
                            <p className="text-sm text-amber-700">Cash on Delivery</p>
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold"
                          >
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
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={statusColors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            My Adoption Requests
          </h1>
          <p className="text-gray-600 mt-2">Track your pet adoption applications</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No adoption requests yet.</p>
            <p className="text-gray-400">Browse pets to start your adoption journey!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{order.pet_name}</h3>
                      <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p><span className="font-medium text-gray-700">Delivery Name:</span> {order.shipping_name}</p>
                      <p><span className="font-medium text-gray-700">Phone:</span> {order.shipping_phone}</p>
                      <p><span className="font-medium text-gray-700">Address:</span> {order.shipping_address}</p>
                    </div>
                    <div className="space-y-1">
                      <p><span className="font-medium text-gray-700">Applied:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                      {order.updated_at && (
                        <p><span className="font-medium text-gray-700">Updated:</span> {new Date(order.updated_at).toLocaleDateString()}</p>
                      )}
                      <p><span className="font-medium text-gray-700">Payment:</span> Cash on Delivery</p>
                    </div>
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
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add pet');
    }
  };

  const handleOrderAction = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      toast.success(`Order ${status}!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage pets and adoption requests</p>
        </div>

        <Tabs defaultValue="pets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="pets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Manage Pets ({pets.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="add-pet" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Add New Pet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <Card key={pet.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-md">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={`${API_URL}/api/pets/${pet.id}/image`}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{pet.name}</h3>
                      <Badge className={pet.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {pet.available ? 'Available' : 'Adopted'}
                      </Badge>
                    </div>
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

          <TabsContent value="orders" className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="bg-white/95 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{order.pet_name}</h3>
                      <p className="text-sm text-gray-600">Order #{order.id.slice(0, 8)}</p>
                    </div>
                    <Badge className={
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="space-y-1">
                      <p><span className="font-medium">Customer:</span> {order.shipping_name}</p>
                      <p><span className="font-medium">Phone:</span> {order.shipping_phone}</p>
                      <p><span className="font-medium">Address:</span> {order.shipping_address}</p>
                    </div>
                    <div className="space-y-1">
                      <p><span className="font-medium">Applied:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                      {order.updated_at && (
                        <p><span className="font-medium">Updated:</span> {new Date(order.updated_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  
                  {order.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleOrderAction(order.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleOrderAction(order.id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="add-pet">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-md">
              <CardHeader>
                <CardTitle>Add New Pet</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPet} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Pet Name</Label>
                      <Input
                        id="name"
                        value={petFormData.name}
                        onChange={(e) => setPetFormData({ ...petFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={petFormData.category}
                        onChange={(e) => setPetFormData({ ...petFormData, category: e.target.value })}
                        placeholder="e.g., Dog, Cat, Bird"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed</Label>
                      <Input
                        id="breed"
                        value={petFormData.breed}
                        onChange={(e) => setPetFormData({ ...petFormData, breed: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={petFormData.gender} 
                        onValueChange={(value) => setPetFormData({ ...petFormData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={petFormData.weight}
                        onChange={(e) => setPetFormData({ ...petFormData, weight: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={petFormData.height}
                        onChange={(e) => setPetFormData({ ...petFormData, height: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={petFormData.description}
                      onChange={(e) => setPetFormData({ ...petFormData, description: e.target.value })}
                      placeholder="Tell us about this pet..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Pet Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold"
                  >
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
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
              PetAdopt
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <Badge className="bg-gray-100 text-gray-800">
              {user?.role === 'admin' ? 'Admin' : 'User'}
            </Badge>
            <Button
              onClick={logout}
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Logout
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
      
      {/* Navigation for regular users */}
      {user.role === 'user' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t p-4">
          <div className="container mx-auto max-w-md">
            <div className="flex space-x-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white"
              >
                Browse Pets
              </Button>
              <Button 
                onClick={() => window.location.href = '/orders'}
                variant="outline"
                className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
              >
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