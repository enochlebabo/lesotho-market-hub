
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Camera, Lightbulb, Focus, Image as ImageIcon } from 'lucide-react';
import { analyzeImageQuality, checkForDuplicateImage, ImageQualityResult } from '@/utils/imageQuality';

interface ImageQualityCheckerProps {
  file: File;
  existingImages: File[];
  onAccept: (file: File) => void;
  onReject: (file: File, issues: string[]) => void;
}

const ImageQualityChecker: React.FC<ImageQualityCheckerProps> = ({
  file,
  existingImages,
  onAccept,
  onReject
}) => {
  const [qualityResult, setQualityResult] = useState<ImageQualityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  React.useEffect(() => {
    analyzeImage();
  }, [file]);

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    
    try {
      // Check for duplicates
      const duplicate = await checkForDuplicateImage(file, existingImages);
      setIsDuplicate(duplicate);

      // Analyze quality
      const result = await analyzeImageQuality(file);
      setQualityResult(result);

      // Auto-accept or provide feedback
      if (!duplicate && result.isAcceptable) {
        onAccept(file);
      } else {
        const issues = [...result.issues];
        if (duplicate) {
          issues.unshift('This image appears to be a duplicate');
        }
        onReject(file, issues);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      onReject(file, ['Error analyzing image quality']);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-500">Good</Badge>;
    return <Badge className="bg-red-500">Poor</Badge>;
  };

  const getTipIcon = (issue: string) => {
    if (issue.includes('dark')) return <Lightbulb className="w-4 h-4" />;
    if (issue.includes('blur')) return <Focus className="w-4 h-4" />;
    if (issue.includes('resolution')) return <ImageIcon className="w-4 h-4" />;
    return <Camera className="w-4 h-4" />;
  };

  if (isAnalyzing) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm">Analyzing image quality...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!qualityResult) return null;

  const hasIssues = qualityResult.issues.length > 0 || isDuplicate;

  return (
    <Card className={`border-2 ${hasIssues ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {hasIssues ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span className="font-medium">
                {hasIssues ? 'Image Quality Issues Detected' : 'Image Quality Approved'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {getQualityBadge(qualityResult.score)}
              <span className={`text-sm font-medium ${getQualityColor(qualityResult.score)}`}>
                {qualityResult.score}%
              </span>
            </div>
          </div>

          {hasIssues && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-700">Issues found:</h4>
              <ul className="space-y-1">
                {isDuplicate && (
                  <li className="flex items-start space-x-2 text-sm text-red-600">
                    <ImageIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>This image appears to be a duplicate</span>
                  </li>
                )}
                {qualityResult.issues.map((issue, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-red-600">
                    {getTipIcon(issue)}
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 mb-2">💡 Photography Tips:</h5>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Take photos in natural daylight or well-lit areas</li>
                  <li>• Hold camera steady and ensure subject is in focus</li>
                  <li>• Use your phone's highest resolution setting</li>
                  <li>• Clean your camera lens before taking photos</li>
                  <li>• Take multiple angles of your product</li>
                </ul>
              </div>

              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Need Professional Photos?
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Contact our partner photographers in your district for professional product photography services.
                </p>
                <Button size="sm" variant="outline" className="mt-2 text-yellow-700 border-yellow-300">
                  Find Photographer
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageQualityChecker;
