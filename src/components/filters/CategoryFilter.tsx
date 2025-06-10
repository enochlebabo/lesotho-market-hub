
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Laptop, Building, Star, Users, Briefcase } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  'Vehicles': Car,
  'Electronics': Laptop,
  'Furniture': Building,
  'Fashion': Star,
  'Services': Users,
  'Business': Briefcase,
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Categories</h3>
      
      <div className="space-y-2">
        <Button
          variant={selectedCategory === '' ? 'default' : 'ghost'}
          onClick={() => onCategoryChange('')}
          className="w-full justify-start"
        >
          All Categories
        </Button>
        
        {categories?.map((category) => {
          const Icon = categoryIcons[category.name] || Building;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'ghost'}
              onClick={() => onCategoryChange(category.name)}
              className="w-full justify-start"
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
