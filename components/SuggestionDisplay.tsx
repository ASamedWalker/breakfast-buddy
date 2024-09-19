import React, {useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import LoadingBar from "./LoadingBar";
import { RatingStars } from '@/components/RatingStars';
import { Suggestion, SavedSuggestion } from '../types';
import { toast } from 'react-toastify';


interface SuggestionDisplayProps {
  suggestion: Suggestion;
  isLoading: boolean;
  onNewSuggestion: () => void;
  onSave: (savedSuggestion: SavedSuggestion) => void;
}

const SuggestionDisplay = ({
  suggestion,
  isLoading,
  onSave,
  onNewSuggestion,
}: SuggestionDisplayProps) => {
  const [rating, setRating] = useState(0);


  const handleSave = () => {
    const savedSuggestion: SavedSuggestion = {
      ...suggestion,
      id: Date.now().toString(), // Simple ID generation
      rating,
      date: new Date().toISOString()
    };
    onSave(savedSuggestion);
    toast.success('Suggestion saved successfully!');
  };

  const handleRate = (newRating: number) => {
    setRating(newRating);
  };

  const renderInfo = (label: string, value: string) => (
    <div className="flex justify-between items-center">
      <span className="font-semibold">{label}:</span>
      {isLoading ? (
        <div className="w-1/2">
          <LoadingBar />
        </div>
      ) : (
        <Badge variant="secondary">{value || "Not available"}</Badge>
      )}
    </div>
  );

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{suggestion.item || "Breakfast Suggestion"}</CardTitle>
        <CardDescription>
          {suggestion.description || "Loading description..."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderInfo("Location", suggestion.source)}
          <Separator />
          {renderInfo("Estimated price", suggestion.estimatedPrice)}
          <Separator />
          {renderInfo("Calories", suggestion.calories)}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <RatingStars rating={rating} onRate={handleRate} />
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={handleSave} disabled={isLoading}>Save Suggestion</Button>
          <Button onClick={onNewSuggestion} disabled={isLoading}>New Suggestion</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SuggestionDisplay;
