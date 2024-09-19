import React, { useState } from "react";
import { UserPreferences, PreferencesFormProps } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PreferencesForm = ({
  initialPreferences,
  onSaved,
}: PreferencesFormProps) => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value.split(", ") }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSaved(preferences);
  };

  const handleRadioChange = (value: "low" | "medium" | "high") => {
    setPreferences((prev) => ({ ...prev, caloriePreference: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
        <Input
          id="dietaryRestrictions"
          name="dietaryRestrictions"
          value={preferences.dietaryRestrictions.join(", ")}
          onChange={handleInputChange}
          placeholder="e.g., vegetarian, vegan, gluten-free"
        />
      </div>
      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Input
          id="allergies"
          name="allergies"
          value={preferences.allergies.join(", ")}
          onChange={handleInputChange}
          placeholder="e.g., nuts, dairy, eggs"
        />
      </div>
      <div>
        <Label htmlFor="favoriteIngredients">Favorite Ingredients</Label>
        <Input
          id="favoriteIngredients"
          name="favoriteIngredients"
          value={preferences.favoriteIngredients.join(", ")}
          onChange={handleInputChange}
          placeholder="e.g., avocado, spinach, berries"
        />
      </div>
      <div>
        <Label htmlFor="dislikedIngredients">Disliked Ingredients</Label>
        <Input
          id="dislikedIngredients"
          name="dislikedIngredients"
          value={preferences.dislikedIngredients.join(", ")}
          onChange={handleInputChange}
          placeholder="e.g., cilantro, olives"
        />
      </div>
      <div>
        <Label>Calorie Preference</Label>
        <RadioGroup
          onValueChange={handleRadioChange}
          defaultValue={preferences.caloriePreference}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low">Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high">High</Label>
          </div>
        </RadioGroup>
      </div>
      <Button variant="orange" type="submit">Save Preferences</Button>
    </form>
  );
};

export default PreferencesForm;
