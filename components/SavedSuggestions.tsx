import React, { useState } from "react";
import { SavedSuggestion } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Heart } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { Button } from "@/components/ui/button";

interface SavedSuggestionsProps {
  suggestions: SavedSuggestion[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const SavedSuggestions = ({
  suggestions,
  onDelete,
  onToggleFavorite,
}: SavedSuggestionsProps) => {
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Saved Suggestions</h2>
        <Select
          onValueChange={(value) => setSortBy(value as "date" | "rating")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="rating">Sort by Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {sortedSuggestions.map((suggestion) => (
        <Card key={suggestion.id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{suggestion.item}</CardTitle>
              <RatingStars rating={suggestion.rating} onRate={() => {}} />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(suggestion.id)}
              >
                <Heart
                  className={
                    suggestion.isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500"
                  }
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(suggestion.id)}
              >
                <Trash2 className="text-red-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p>{suggestion.description}</p>
            <p>From: {suggestion.source}</p>
            <p>Price: {suggestion.estimatedPrice}</p>
            <p>Calories: {suggestion.calories}</p>
            <p>Saved on: {new Date(suggestion.date).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


export default SavedSuggestions;