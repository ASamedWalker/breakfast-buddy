import React from "react";
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

interface SuggestionProps {
  suggestion: {
    item: string;
    description: string;
    source: string;
    estimatedPrice: string;
    calories: string;
  };
  isLoading: boolean;
  onSave: () => void;
  onNewSuggestion: () => void;
}

const SuggestionDisplay = ({
  suggestion,
  isLoading,
  onSave,
  onNewSuggestion,
}: SuggestionProps) => {
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
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSave} disabled={isLoading}>
          Save Suggestion
        </Button>
        <Button variant="orange" onClick={onNewSuggestion} disabled={isLoading}>
          New Suggestion
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionDisplay;
