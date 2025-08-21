import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Heart, Plus, Minus, Calendar, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";

// Sample cart items data
const initialCartItems = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    age: "2 years",
    location: "New York, NY",
    image: pet1,
    species: "Dog",
    shelter: "Happy Paws Rescue",
    adoptionFee: 250,
    dateAdded: "2024-01-18",
    requirements: ["Yard required", "Experience with large dogs preferred"],
  },
  {
    id: "3",
    name: "Snowball",
    breed: "Holland Lop",
    age: "6 months",
    location: "Chicago, IL",
    image: pet3,
    species: "Rabbit",
    shelter: "Small Pets Haven",
    adoptionFee: 75,
    dateAdded: "2024-01-17",
    requirements: ["Indoor habitat", "Hay and pellet diet"],
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [adoptionMessage, setAdoptionMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getTotalFee = () => {
    return cartItems.reduce((total, item) => total + item.adoptionFee, 0);
  };

  const handleSubmitAdoption = async () => {
    setIsSubmitting(true);
    // TODO: Implement actual adoption submission
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Adoption request submitted for:", cartItems);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Adoption Cart
              </h1>
              <p className="text-lg text-muted-foreground">
                Review your selected pets before submitting adoption requests
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-pet-warm" />
              <Badge variant="secondary" className="text-sm">
                {cartItems.length} pets
              </Badge>
            </div>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Selected Pets ({cartItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Pet Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>

                        {/* Pet Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">
                                {item.name}
                              </h3>
                              <p className="text-muted-foreground">{item.breed} • {item.age}</p>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {item.shelter}, {item.location}
                              </div>
                            </div>
                            <div className="text-right mt-2 sm:mt-0">
                              <p className="text-lg font-semibold text-foreground">
                                ${item.adoptionFee}
                              </p>
                              <p className="text-sm text-muted-foreground">Adoption Fee</p>
                            </div>
                          </div>

                          {/* Requirements */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">Requirements:</p>
                            <div className="flex flex-wrap gap-2">
                              {item.requirements.map((req, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-muted-foreground">
                              Added {new Date(item.dateAdded).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Move to favorites
                                }}
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                Save for Later
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < cartItems.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Adoption Message */}
              <Card>
                <CardHeader>
                  <CardTitle>Tell Us About Yourself</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="message">
                      Why do you want to adopt these pets? Tell us about your experience and living situation.
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="I have a large backyard and previous experience with dogs. I work from home and can provide lots of attention and care..."
                      value={adoptionMessage}
                      onChange={(e) => setAdoptionMessage(e.target.value)}
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">
                      This message will be sent to all shelters for the pets in your cart.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Adoption Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cost Breakdown */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="text-foreground">${item.adoptionFee}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Adoption Fees</span>
                      <span className="text-pet-warm">${getTotalFee()}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Important Notes */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Important Notes:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Adoption fees include vaccinations and microchipping</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Meet & greet required before finalization</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Home visit may be required</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>30-day return policy if not a good match</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Submit Button */}
                  <Button
                    className="w-full btn-bounce"
                    size="lg"
                    onClick={handleSubmitAdoption}
                    disabled={isSubmitting || !adoptionMessage.trim()}
                  >
                    {isSubmitting ? (
                      "Submitting Requests..."
                    ) : (
                      <>
                        Submit Adoption Requests
                        <Calendar className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting, you agree to our adoption terms and conditions
                  </p>

                  {/* Continue Shopping */}
                  <div className="pt-4">
                    <Link to="/browse">
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse More Pets
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="bg-muted/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Your adoption cart is empty
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Start browsing pets and add the ones you'd like to adopt to your cart.
            </p>
            <div className="space-x-4">
              <Link to="/browse">
                <Button size="lg" className="btn-bounce">
                  Browse Pets
                </Button>
              </Link>
              <Link to="/favorites">
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4 mr-2" />
                  View Favorites
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;