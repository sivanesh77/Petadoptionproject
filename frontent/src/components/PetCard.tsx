import { Heart, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PetCardProps {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  species: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onAdopt?: (id: string) => void;
}

const PetCard = ({
  id,
  name,
  breed,
  age,
  location,
  image,
  species,
  isFavorite = false,
  onFavoriteToggle,
  onAdopt,
}: PetCardProps) => {
  return (
    <Card className="card-hover overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background ${
            isFavorite ? "text-pet-warm" : "text-muted-foreground"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(id);
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        <Badge
          variant="secondary"
          className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm"
        >
          {species}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <span className="text-sm text-muted-foreground">{age}</span>
          </div>
          
          <p className="text-sm text-muted-foreground">{breed}</p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {location}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to pet details
              }}
            >
              View Details
            </Button>
            <Button
              size="sm"
              className="flex-1 btn-bounce"
              onClick={(e) => {
                e.stopPropagation();
                onAdopt?.(id);
              }}
            >
              Adopt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;