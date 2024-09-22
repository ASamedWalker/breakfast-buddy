"use server";

import { NextResponse } from "next/server";
import { searchRestaurants } from "@/utils/uberEatsApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    const restaurants = await searchRestaurants(
      Number(latitude),
      Number(longitude)
    );
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error searching restaurants:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
      return NextResponse.json(
        {
          error: `Uber API Error: ${
            error.response.data.message || "Unknown error"
          }`,
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error(error.request);
      return NextResponse.json(
        { error: "No response received from Uber API" },
        { status: 500 }
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error", error.message);
      return NextResponse.json(
        { error: `Request setup error: ${error.message}` },
        { status: 500 }
      );
    }
  }
}
