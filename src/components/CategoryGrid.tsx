
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Car, Laptop, Briefcase, Star, Users, Building } from 'lucide-react';

const categories = [
  {
    name: 'Vehicles',
    icon: Car,
    count: '2,453',
    description: 'Cars, trucks, motorcycles',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Electronics',
    icon: Laptop,
    count: '1,876',
    description: 'Laptops, phones, gadgets',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Furniture',
    icon: Building,
    count: '987',
    description: 'Home & office furniture',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Fashion',
    icon: Star,
    count: '1,234',
    description: 'Clothing & accessories',
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    name: 'Services',
    icon: Users,
    count: '567',
    description: 'Professional services',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    name: 'Business',
    icon: Briefcase,
    count: '345',
    description: 'Equipment & supplies',
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for in our organized categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={category.name}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`${category.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className={`w-6 h-6 ${category.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {category.count}
                      </span>
                      <span className="text-sm text-gray-500">items</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
