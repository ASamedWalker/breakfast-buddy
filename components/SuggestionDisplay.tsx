import React, { useState, useEffect } from "react";
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
import { RatingStars } from "@/components/RatingStars";
import { Suggestion, SavedSuggestion, DetailedNutritionInfo } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";
import { calculateCalories } from "@/utils/nutritionCalculator";

interface SuggestionDisplayProps {
  suggestion: Suggestion;
  detailedNutrition?: DetailedNutritionInfo;
  isLoading: boolean;
  onNewSuggestion: () => void;
  onSave: (savedSuggestion: SavedSuggestion) => void;
}

interface Restaurant {
  id: string;
  name: string;
}

const SuggestionDisplay = ({
  suggestion,
  isLoading,
  detailedNutrition,
  onSave,
  onNewSuggestion,
}: SuggestionDisplayProps) => {
  const [rating, setRating] = useState(0);
  const [showDetailedNutrition, setShowDetailedNutrition] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);

  const handleSave = () => {
    const savedSuggestion: SavedSuggestion = {
      ...suggestion,
      id: Date.now().toString(), // Simple ID generation
      rating,
      date: new Date().toISOString(),
    };
    onSave(savedSuggestion);
    toast.success("Suggestion saved successfully!");
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

  const renderDetailedNutrition = () => (
    <div className="mt-4 space-y-2">
      <h4 className="font-semibold">Detailed Nutrition Information:</h4>
      {renderInfo("Protein", `${detailedNutrition?.protein}g`)}
      {renderInfo("Carbs", `${detailedNutrition?.carbs}g`)}
      {renderInfo("Fat", `${detailedNutrition?.fat}g`)}
      {renderInfo("Fiber", `${detailedNutrition?.fiber}g`)}
      {renderInfo("Sugar", `${detailedNutrition?.sugar}g`)}
    </div>
  );

  const calculatedCalories = detailedNutrition
    ? Math.round(calculateCalories(detailedNutrition))
    : null;
  const suggestedCalories = suggestion.calories
    ? parseInt(suggestion.calories)
    : null;

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
          {calculatedCalories && calculatedCalories !== suggestedCalories && (
            <p className="text-sm text-yellow-600">
              Calculated calories: {calculatedCalories} cal
            </p>
          )}
          {detailedNutrition && (
            <>
              <Separator />
              <Button
                variant="ghost"
                onClick={() => setShowDetailedNutrition(!showDetailedNutrition)}
                className="w-full flex justify-between items-center"
              >
                <span className="font-semibold text-sm uppercase tracking-wide text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                  Detailed Nutrition
                </span>
                {showDetailedNutrition ? <ChevronUp /> : <ChevronDown />}
              </Button>
              {showDetailedNutrition && renderDetailedNutrition()}
            </>
          )}
          <div>
            <h3 className="text-lg font-semibold mb-2">Nearby Restaurants:</h3>
            <Button
              onClick={fetchNearbyRestaurants}
              disabled={isLoadingRestaurants}
            >
              {isLoadingRestaurants ? "Refreshing..." : "Refresh Restaurants"}
            </Button>
            /
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <RatingStars rating={rating} onRate={handleRate} />
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={handleSave} disabled={isLoading}>
            Save Suggestion
          </Button>
          <Button onClick={onNewSuggestion} disabled={isLoading}>
            New Suggestion
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
export default SuggestionDisplay;
