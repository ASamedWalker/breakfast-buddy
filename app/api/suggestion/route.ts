"use server";
import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { calculateCalories } from "@/utils/nutritionCalculator";
import { DetailedNutritionInfo } from "@/types";

export async function POST(req: Request) {
  try {
    const { userInput, userPreferences, mood, weather } = await req.json();

    const systemMessage = `You are a helpful assistant that suggests quick grab-and-go breakfast options. Provide diverse suggestions from various fast-food chains, convenience stores, and deli grocery stores. Consider the following user preferences, mood, and weather: ${JSON.stringify(
      { userPreferences, mood, weather }
    )}

    Always respond in the following format:

    Item: [Name of the breakfast item]
    Description: [Brief description of the item]
    Location: [Where to get it - be specific and varied]
    Price: [Estimated price]
    Calories: [Calorie count]
    DetailedNutrition:
      Protein: [Number in grams]
      Carbs: [Number in grams]
      Fat: [Number in grams]
      Fiber: [Number in grams]
      Sugar: [Number in grams]

    Ensure all fields are filled out with realistic values, even if you need to make an educated guess.`;

    const userMessage = `Based on the following input and considering the user's preferences, mood, and weather, suggest a quick grab-and-go breakfast option: ${userInput}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      max_tokens: 500, // Increased to ensure we get a full response
    });

    const suggestionText = completion.choices[0].message.content;

    if (!suggestionText) {
      throw new Error("No suggestion received from AI");
    }

    // console.log("Full AI response:", suggestionText);

    // Helper function to extract field from the AI response
    const extractField = (field: string): string => {
      const regex = new RegExp(`${field}:\\s*(.+)`, "i");
      const match = suggestionText.match(regex);
      return match ? match[1].trim() : "";
    };

    const parseNumber = (value: string): number => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const detailedNutrition: DetailedNutritionInfo = {
      protein: parseNumber(extractField("Protein")),
      carbs: parseNumber(extractField("Carbs")),
      fat: parseNumber(extractField("Fat")),
      fiber: parseNumber(extractField("Fiber")),
      sugar: parseNumber(extractField("Sugar")),
    };
    const calculatedCalories = calculateCalories(detailedNutrition);

    console.log("Extracted detailed nutrition:", detailedNutrition);

    const suggestion = {
      item: extractField("Item"),
      description: extractField("Description"),
      source: extractField("Location"),
      estimatedPrice: extractField("Price"),
      calories: `${Math.round(calculatedCalories)} cal`,
    };

    // console.log("Extracted suggestion:", suggestion);

    // Validate that all fields have content
    const missingFields = Object.entries(suggestion)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (missingFields.length > 0) {
      throw new Error(
        `Incomplete suggestion: missing fields: ${missingFields.join(", ")}`
      );
    }

    return NextResponse.json({ suggestion, detailedNutrition });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
