import { useState } from "react";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import PetCard from "@/components/PetCard";
import pet1 from "@/assets/pet-1.jpg";
import pet2 from "@/assets/pet-2.jpg";
import pet3 from "@/assets/pet-3.jpg";

// Sample pets data
const allPets = [
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
  {
    id: "4",
    name: "Buddy",
    breed: "Labrador Mix",
    age: "3 years",
    location: "Houston, TX",
    image: pet1,
    species: "Dog",
  },
  {
    id: "5",
    name: "Whiskers",
    breed: "Persian",
    age: "2 years",
    location: "Phoenix, AZ",
    image: pet2,
    species: "Cat",
  },
  {
    id: "6",
    name: "Coco",
    breed: "Mini Lop",
    age: "1 year",
    location: "Philadelphia, PA",
    image: pet3,
    species: "Rabbit",
  },
];

const BrowsePets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSpeciesChange = (species: string, checked: boolean) => {
    setSelectedSpecies(prev =>
      checked
        ? [...prev, species]
        : prev.filter(s => s !== species)
    );
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

  // Filter pets based on search and filters
  const filteredPets = allPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = selectedSpecies.length === 0 || selectedSpecies.includes(pet.species);
    const matchesAge = selectedAge === "all" || !selectedAge || pet.age.includes(selectedAge);
    const matchesBreed = selectedBreed === "all" || !selectedBreed || pet.breed.toLowerCase().includes(selectedBreed.toLowerCase());

    return matchesSearch && matchesSpecies && matchesAge && matchesBreed;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Browse Pets</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Find your perfect companion from our collection of loving pets.
          </p>
          
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} className="mb-6" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Species Filter */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">Species</h3>
                  <div className="space-y-2">
                    {["Dog", "Cat", "Rabbit", "Bird"].map(species => (
                      <div key={species} className="flex items-center space-x-2">
                        <Checkbox
                          id={species}
                          checked={selectedSpecies.includes(species)}
                          onCheckedChange={(checked) => 
                            handleSpeciesChange(species, checked as boolean)
                          }
                        />
                        <label htmlFor={species} className="text-sm text-muted-foreground">
                          {species}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Age Filter */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">Age</h3>
                  <Select value={selectedAge} onValueChange={setSelectedAge}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="months">Under 1 year</SelectItem>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="2">2 years</SelectItem>
                      <SelectItem value="3">3+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Breed Filter */}
                <div>
                  <h3 className="font-medium text-foreground mb-3">Breed</h3>
                  <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Breeds</SelectItem>
                      <SelectItem value="Golden Retriever">Golden Retriever</SelectItem>
                      <SelectItem value="Labrador">Labrador</SelectItem>
                      <SelectItem value="Tabby">Tabby</SelectItem>
                      <SelectItem value="Persian">Persian</SelectItem>
                      <SelectItem value="Lop">Lop Rabbit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* View Toggle and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredPets.length} pets
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pet Grid */}
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  {...pet}
                  isFavorite={favorites.includes(pet.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onAdopt={handleAdopt}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredPets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No pets found matching your criteria.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecies([]);
                    setSelectedAge("all");
                    setSelectedBreed("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePets;