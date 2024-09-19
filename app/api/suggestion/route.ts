"use server";
import { NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json(
        { error: "User input is required" },
        { status: 400 }
      );
    }

    const systemMessage = `You are a helpful assistant that suggests quick grab-and-go breakfast options. Provide diverse suggestions from various fast-food chains, convenience stores, and deli grocery stores. Avoid repeatedly suggesting the same store. Always respond in the following format:

    Item: [Name of the breakfast item]
    Description: [Brief description of the item]
    Location: [Where to get it - be specific and varied]
    Price: [Estimated price]
    Calories: [Approximate calories]

    Ensure all fields are filled out, even if you need to make an educated guess.`;

    const userMessage = `Based on the following input, suggest a quick grab-and-go breakfast option: ${userInput}

    Choose from a variety of locations such as Starbucks, Dunkin' Donuts, McDonald's, Subway, local delis, 7-Eleven, Whole Foods, Panera Bread, or any other relevant fast-food chain, convenience store, or grocery store. Don't always choose the same location.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 150,
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
      throw new Error("Incomplete suggestion received from AI");
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
      console.warn(
        "Some fields are missing in the AI response:",
        suggestionText
      );
      // You might want to handle this case, perhaps by re-prompting the AI or informing the user
    }

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
