"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { Textarea } from "@/components/ui/textarea";
import SuggestionDisplay from "./SuggestionDisplay";
import WeeklyMealPlanner from "./WeeklyMealPlanner";
import PreferencesForm from "@/components/PreferencesForm";
import SavedSuggestions from "@/components/SavedSuggestions";
import { UserPreferences } from "../types";
import { SavedSuggestion } from "../types";

const InputSection = () => {
  const [userInput, setUserInput] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    favoriteIngredients: [],
    dislikedIngredients: [],
    caloriePreference: "medium",
  });
  const [savedSuggestions, setSavedSuggestions] = useState<SavedSuggestion[]>(
    []
  );
  const [mood, setMood] = useState<string>("");
  const [weather, setWeather] = useState<string>("");

  useEffect(() => {
    // Load saved suggestions from localStorage on component mount
    const loaded = localStorage.getItem("savedSuggestions");
    if (loaded) {
      setSavedSuggestions(JSON.parse(loaded));
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getSuggestion();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const getSuggestion = async () => {
    setIsLoading(true);
    setIsLoadingDetails(true);
    setError(null);

    try {
      const response = await axios.post("/api/suggestion", {
        userInput,
        userPreferences,
        mood,
        weather,
      });
      setSuggestion(response.data.suggestion);
      toast.success("Suggestion generated successfully!");
      // Simulate a delay for loading details
      setTimeout(() => setIsLoadingDetails(false), 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to get a suggestion. Please try again.");
      setIsLoadingDetails(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSuggestion = () => {
    getSuggestion();
  };

  const handleSavePreferences = (newPreferences: UserPreferences) => {
    setUserPreferences(newPreferences);
    setShowPreferences(false);
    toast.success("Suggestion generated successfully!");
  };

  const handleSaveSuggestion = (savedSuggestion: SavedSuggestion) => {
    const updatedSavedSuggestions = [
      ...savedSuggestions,
      { ...savedSuggestion, isFavorite: false },
    ];
    setSavedSuggestions(updatedSavedSuggestions);
    localStorage.setItem(
      "savedSuggestions",
      JSON.stringify(updatedSavedSuggestions)
    );
    toast.success("Suggestion saved successfully!");
  };

  const handleDeleteSuggestion = (id: string) => {
    const updatedSuggestions = savedSuggestions.filter(
      (suggestion) => suggestion.id !== id
    );
    setSavedSuggestions(updatedSuggestions);
    localStorage.setItem(
      "savedSuggestions",
      JSON.stringify(updatedSuggestions)
    );
    toast.success("Suggestion deleted successfully!");
  };

  const handleToggleFavorite = (id: string) => {
    const updatedSuggestions = savedSuggestions.map((suggestion) =>
      suggestion.id === id
        ? { ...suggestion, isFavorite: !suggestion.isFavorite }
        : suggestion
    );
    setSavedSuggestions(updatedSuggestions);
    localStorage.setItem(
      "savedSuggestions",
      JSON.stringify(updatedSuggestions)
    );
    toast.success("Favorite status updated!");
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>What&apos;s for breakfast?</CardTitle>
          <CardDescription>
            Tell us your preferences, mood, and the weather for a personalized
            breakfast suggestion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowPreferences(!showPreferences)}
            className="mb-4"
            variant="orange"
          >
            {showPreferences ? "Hide Preferences" : "Show Preferences"}
          </Button>
          {showPreferences && (
            <PreferencesForm
              initialPreferences={userPreferences}
              onSaved={handleSavePreferences}
            />
          )}
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Select onValueChange={setMood} value={mood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="tired">Tired</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setWeather} value={weather}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={userInput}
              onChange={handleInputChange}
              placeholder="Tell me your preferences, dietary needs, or how much time you have for breakfast..."
              className="mb-4 mt-4"
            />
            <Button variant="orange" type="submit" disabled={isloading}>
              {isloading ? <LoadingSpinner /> : "Get Breakfast Suggestion"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {isloading && <LoadingSpinner />}
      {error && <ErrorMessage title={error} description={error} />}
      {suggestion && (
        <SuggestionDisplay
          suggestion={suggestion}
          isLoading={isLoadingDetails}
          onNewSuggestion={handleNewSuggestion}
          onSave={handleSaveSuggestion}
        />
      )}
      <SavedSuggestions
        suggestions={savedSuggestions}
        onDelete={handleDeleteSuggestion}
        onToggleFavorite={handleToggleFavorite}
      />
      <WeeklyMealPlanner savedSuggestions={savedSuggestions} />
    </div>
  );
};

export default InputSection;
