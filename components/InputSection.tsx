"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { Textarea } from "@/components/ui/textarea";
import SuggestionDisplay from "./SuggestionDisplay";

const InputSection = () => {
  const [userInput, setUserInput] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isloadingDetails, setIsLoadingDetails] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getSuggestion();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const getSuggestion = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/suggestion', { userInput });
      setSuggestion(response.data.suggestion);
      // Simulate a delay for loading details
      setTimeout(() => setIsLoadingDetails(false), 1500);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to get a suggestion. Please try again.');
      setIsLoadingDetails(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSave = () => {
    console.log("Saving suggestion....", suggestion);
  }

  const handleNewSuggestion = () => {
    getSuggestion();
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>What&apos;s for breakfast?</CardTitle>
          <CardDescription>
            Tell us your preferences, and we&apos;ll suggest a quick breakfast
            option.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <Textarea
              value={userInput}
              onChange={handleInputChange}
              placeholder="Tell me your preferences, dietary needs, or how much time you have for breakfast..."
              className="mb-4"
            />
            <Button variant="orange" type="submit" disabled={isloading}>
              {isloading ? <LoadingSpinner /> : "Get Breakfast Suggestion"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {isloading && <LoadingSpinner />}
      {error && <ErrorMessage title={error} description={error} />}
      {suggestion &&
        <SuggestionDisplay
        suggestion={suggestion}
        isLoading={isloadingDetails}
        onSave={handleFormSave}
        onNewSuggestion={handleNewSuggestion}
        />
      }
    </div>
  );
};

export default InputSection;
