import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import PetCard from "@/components/PetCard";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";

// Sample favorite pets data
const favoritePets = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    age: "2 years",
    location: "New York, NY",
    image: pet1,
    species: "Dog",
    dateAdded: "2024-01-15",
  },
  {
    id: "2",
    name: "Luna",
    breed: "Tabby Mix",
    age: "1 year",
    location: "Los Angeles, CA",
    image: pet2,
    species: "Cat",
    dateAdded: "2024-01-12",
  },
  {
    id: "5",
    name: "Whiskers",
    breed: "Persian",
    age: "2 years",
    location: "Phoenix, AZ",
    image: pet2,
    species: "Cat",
    dateAdded: "2024-01-10",
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState<string[]>(
    favoritePets.map(pet => pet.id)
  );

  const handleRemoveFromFavorites = (petId: string) => {
    setFavorites(prev => prev.filter(id => id !== petId));
  };

  const handleAddToCart = (petId: string) => {
    console.log("Adding to cart:", petId);
    // TODO: Implement cart functionality
  };

  const activeFavorites = favoritePets.filter(pet => 
    favorites.includes(pet.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                My Favorites
              </h1>
              <p className="text-lg text-muted-foreground">
                Pets you've saved for later consideration
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pet-warm" />
              <Badge variant="secondary" className="text-sm">
                {activeFavorites.length} pets
              </Badge>
            </div>
          </div>
        </div>

        {/* Favorites Content */}
        {activeFavorites.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-pet-warm" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Favorites</p>
                      <p className="text-2xl font-bold">{activeFavorites.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-pet-warm/20 rounded-full flex items-center justify-center">
                      <span className="text-xs">🐶</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dogs</p>
                      <p className="text-2xl font-bold">
                        {activeFavorites.filter(p => p.species === "Dog").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-pet-warm/20 rounded-full flex items-center justify-center">
                      <span className="text-xs">🐱</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cats</p>
                      <p className="text-2xl font-bold">
                        {activeFavorites.filter(p => p.species === "Cat").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        activeFavorites.forEach(pet => handleAddToCart(pet.id));
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add All to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFavorites([])}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Favorites
                    </Button>
                    <Link to="/browse">
                      <Button variant="outline" size="sm">
                        Find More Pets
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pet Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeFavorites.map((pet) => (
                <div key={pet.id} className="relative">
                  <PetCard
                    {...pet}
                    isFavorite={true}
                    onFavoriteToggle={handleRemoveFromFavorites}
                    onAdopt={handleAddToCart}
                  />
                  <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1">
                    <p className="text-xs text-muted-foreground">
                      Added {new Date(pet.dateAdded).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-muted/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              No favorites yet
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Start browsing pets and click the heart icon to save your favorites here.
            </p>
            <div className="space-x-4">
              <Link to="/browse">
                <Button size="lg" className="btn-bounce">
                  Browse Pets
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;