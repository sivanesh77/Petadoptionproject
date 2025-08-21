import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Shield, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryFilters from "@/components/CategoryFilters";
import PetCard from "@/components/PetCard";
import heroBackground from "@/assets/hero-bg.jpg";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";

// Sample featured pets data
const featuredPets = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    age: "2 years",
    location: "New York, NY",
    image: pet1,
    species: "Dog",
  },
  {
    id: "2",
    name: "Luna",
    breed: "Tabby Mix",
    age: "1 year",
    location: "Los Angeles, CA",
    image: pet2,
    species: "Cat",
  },
  {
    id: "3",
    name: "Snowball",
    breed: "Holland Lop",
    age: "6 months",
    location: "Chicago, IL",
    image: pet3,
    species: "Rabbit",
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // TODO: Implement search functionality
  };

  const handleFavoriteToggle = (petId: string) => {
    setFavorites(prev =>
      prev.includes(petId)
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

  const handleAdopt = (petId: string) => {
    console.log("Adopting pet:", petId);
    // TODO: Implement adoption functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-pet-cool to-primary py-20 lg:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 41, 56, 0.8), rgba(0, 0, 0, 0.8)), url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Perfect
              <span className="block text-pet-warm">Furry Friend</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Every pet deserves a loving home. Browse thousands of adorable pets waiting for their forever family.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                onSearch={handleSearch}
                className="shadow-hover"
              />
            </div>
            
            {/* Category Filters */}
            <CategoryFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            {/* CTA Button */}
            <div className="mt-8">
              <Link to="/browse">
                <Button size="lg" className="bg-pet-warm hover:bg-pet-warm/90 text-pet-warm-foreground btn-bounce">
                  Browse All Pets
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Wag & Adopt?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make pet adoption simple, safe, and rewarding for both pets and families.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-pet-warm/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pet-warm" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Loving Matches</h3>
              <p className="text-muted-foreground">
                Our careful matching process ensures you find the perfect companion for your lifestyle.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-pet-warm/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-pet-warm" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground">
                All pets are health-checked and vaccinated. Every adoption is secure and transparent.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-pet-warm/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-pet-warm" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Forever Homes</h3>
              <p className="text-muted-foreground">
                We provide ongoing support to ensure successful, lifelong pet-family relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Pets</h2>
            <p className="text-lg text-muted-foreground">
              Meet some of our amazing pets looking for their forever homes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredPets.map((pet) => (
              <PetCard
                key={pet.id}
                {...pet}
                isFavorite={favorites.includes(pet.id)}
                onFavoriteToggle={handleFavoriteToggle}
                onAdopt={handleAdopt}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/browse">
              <Button variant="outline" size="lg" className="btn-bounce">
                View All Pets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
