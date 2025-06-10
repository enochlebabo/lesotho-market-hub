
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, X, Image, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ImageQualityChecker from '@/components/upload/ImageQualityChecker';

const ListProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<File[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<File[]>([]);
  const [rejectedPhotos, setRejectedPhotos] = useState<{ file: File; issues: string[] }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: ''
  });

  const categories = [
    'Vehicles', 'Electronics', 'Furniture', 'Fashion', 'Books', 
    'Sports', 'Home & Garden', 'Services', 'Other'
  ];

  const conditions = ['New', 'Excellent', 'Good', 'Fair', 'Poor'];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalPhotos = photos.length + pendingPhotos.length + files.length;

    if (totalPhotos > 30) {
      toast({
        title: "Too many photos",
        description: "Maximum 30 photos allowed per listing.",
        variant: "destructive"
      });
      return;
    }

    // Add files to pending for quality check
    setPendingPhotos(prev => [...prev, ...files]);
  };

  const handlePhotoAccept = (file: File) => {
    setPhotos(prev => [...prev, file]);
    setPendingPhotos(prev => prev.filter(f => f !== file));
    
    toast({
      title: "Photo approved!",
      description: "Image quality check passed.",
    });
  };

  const handlePhotoReject = (file: File, issues: string[]) => {
    setRejectedPhotos(prev => [...prev, { file, issues }]);
    setPendingPhotos(prev => prev.filter(f => f !== file));
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeRejectedPhoto = (index: number) => {
    setRejectedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const retryRejectedPhoto = (file: File) => {
    setRejectedPhotos(prev => prev.filter(rejected => rejected.file !== file));
    setPendingPhotos(prev => [...prev, file]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length < 5) {
      toast({
        title: "Not enough photos",
        description: "Please upload at least 5 high-quality photos of your product.",
        variant: "destructive"
      });
      return;
    }

    if (pendingPhotos.length > 0) {
      toast({
        title: "Photos still processing",
        description: "Please wait for all photos to complete quality checks.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Product listed successfully!",
      description: "Your product has been added to the marketplace."
    });

    navigate('/products');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-xl font-semibold">List Your Product</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Listing</CardTitle>
            <p className="text-muted-foreground">Fill in the details to list your product</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Photos (Required: 5-30 high-quality photos)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Upload Photos</p>
                    <p className="text-sm text-muted-foreground">
                      Choose high-quality images - we'll check them automatically
                    </p>
                  </label>
                </div>
                
                <div className="mt-2 text-sm text-muted-foreground flex items-center justify-between">
                  <span>Photos: {photos.length} approved, {pendingPhotos.length} processing, {rejectedPhotos.length} rejected</span>
                  <span className="text-green-600 font-medium">Minimum 5 required</span>
                </div>

                {/* Pending Photos - Being Processed */}
                {pendingPhotos.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium">Processing Photos:</h4>
                    {pendingPhotos.map((photo, index) => (
                      <ImageQualityChecker
                        key={`pending-${index}`}
                        file={photo}
                        existingImages={photos}
                        onAccept={handlePhotoAccept}
                        onReject={handlePhotoReject}
                      />
                    ))}
                  </div>
                )}

                {/* Approved Photos */}
                {photos.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <h4 className="text-sm font-medium text-green-700">Approved Photos:</h4>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-20 object-cover rounded border-2 border-green-200"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected Photos */}
                {rejectedPhotos.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <h4 className="text-sm font-medium text-red-700">Photos Need Improvement:</h4>
                    </div>
                    <div className="space-y-3">
                      {rejectedPhotos.map((rejected, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                          <img
                            src={URL.createObjectURL(rejected.file)}
                            alt={`Rejected ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{rejected.file.name}</p>
                            <ul className="text-xs text-red-600 mt-1">
                              {rejected.issues.map((issue, issueIndex) => (
                                <li key={issueIndex}>• {issue}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => retryRejectedPhoto(rejected.file)}
                              className="text-blue-600 border-blue-300"
                            >
                              Retry
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeRejectedPhoto(index)}
                              className="text-red-600 border-red-300"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., iPhone 12 Pro Max"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price (LSL)</label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Condition</label>
                  <Select onValueChange={(value) => setFormData({...formData, condition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition.toLowerCase()}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Maseru"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                List Product
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListProduct;
