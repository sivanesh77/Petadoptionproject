import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Pets", icon: "🐾" },
  { id: "cat", label: "Cats", icon: "🐱" },
  { id: "dog", label: "Dogs", icon: "🐶" },
  { id: "rabbit", label: "Rabbits", icon: "🐰" },
  { id: "bird", label: "Birds", icon: "🐦" },
];

const CategoryFilters = ({
  selectedCategory = "all",
  onCategoryChange,
}: CategoryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          className={`btn-bounce ${
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
          onClick={() => onCategoryChange?.(category.id)}
        >
          <span className="mr-2">{category.icon}</span>
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilters;