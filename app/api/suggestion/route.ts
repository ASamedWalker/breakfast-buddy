"use server";
import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { toast } from "react-toastify";

export async function POST(req: Request) {
  try {
    const { userInput, userPreferences, mood, weather } = await req.json();

    if (!userInput || !userPreferences) {
      return NextResponse.json(
        { error: "Missing userInput or userPreferences" },
        { status: 400 }
      );
    }

    const preferencesString = `
      Dietary Restrictions: ${userPreferences.dietaryRestrictions.join(", ")}
      Allergies: ${userPreferences.allergies.join(", ")}
      Favorite Ingredients: ${userPreferences.favoriteIngredients.join(", ")}
      Disliked Ingredients: ${userPreferences.dislikedIngredients.join(", ")}
      Calorie Preference: ${userPreferences.caloriePreference}
    `;

    const contextString = `
    User's Mood: ${mood || "Not specified"}
    Current Weather: ${weather || "Not specified"}
  `;

    const systemMessage = `You are a helpful assistant that suggests quick grab-and-go breakfast options.

    Provide diverse suggestions from various fast-food chains, convenience stores, and deli grocery stores. Consider the following user preferences and context:

    ${preferencesString}

    ${contextString}

    Tailor your suggestion based on the user's mood and the weather. For example, suggest comforting foods for a bad mood or rainy weather, or refreshing options for hot weather.

    Always respond in the following format:

    Item: [Name of the breakfast item]
    Description: [Brief description of the item, including how it relates to the user's mood or weather]
    Location: [Where to get it - be specific and varied]
    Price: [Estimated price]
    Calories: [Approximate calories]

    Ensure all fields are filled out, even if you need to make an educated guess.`;

  const userMessage = `Based on the following input and considering the user's preferences, mood, and weather, suggest a quick grab-and-go breakfast option: ${userInput}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_tokens: 250,
    });

    const suggestionText = completion.choices[0].message.content;

    if (!suggestionText) {
      throw new Error("Suggestion text is null or undefined");
    }

    // Use regex to extract each field
    const extractField = (field: string) => {
      const regex = new RegExp(`${field}:\\s*(.+)`, "i");
      const match = suggestionText.match(regex);
      return match ? match[1].trim() : "";
    };

    const parts = suggestionText
      .split("\n")
      .filter((part) => part.trim() !== "");
    if (parts.length < 5) {
      toast.error("Failed to generate a suggestion. Please try again.");
    }

    const suggestion = {
      item: extractField("Item"),
      description: extractField("Description"),
      source: extractField("Location"),
      estimatedPrice: extractField("Price"),
      calories: extractField("Calories"),
    };

    // Validate that all fields have content
    if (Object.values(suggestion).some((value) => !value)) {
      toast.error("Failed to generate a suggestion. Please try again.");
      // You might want to handle this case, perhaps by re-prompting the AI or informing the user
    }

    return NextResponse.json({ suggestion });
  } catch (error) {
    toast.error(`Failed to generate a suggestion. Please try again. ${error}`);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
