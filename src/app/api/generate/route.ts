import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { config as dotenvConfig } from "dotenv";

dotenvConfig(); // Load environment variables from .env file

export const config = {
  runtime: "edge", // Use Edge Functions runtime
};

export async function POST(req: NextRequest) {
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const data = await req.json().catch(() => {
      throw new Error("Invalid JSON payload");
    });

    const { brandDescription, tagsArray } = data;
    const userPrompt = `Brand Description: ${brandDescription}. Tags: ${tagsArray.join(
      ", "
    )}.`;

    const modifiedPrompt = `You are a brand name generator. Your task is to create 100 unique and original brand names based on the user's input. The user will provide a brand description and a list of keywords or tags in an array format.

        Instructions:

        Understand the Brand: Carefully analyze the provided brand description to understand the brand's core values, target audience, and industry.
        Keyword Integration: Incorporate the provided keywords/tags into the brand names.
        Creative Expansion: Generate additional relevant keywords based on the brand description and industry.
        Word Combinations: Create 10-20 brand names by combining parts of the keywords (e.g., "Evolution" + "Cinematics" = "EvoCine," "CineEvolution").
        Word Variations: Create 10-20 brand names by generating creative variations of keywords (e.g., "River" = "Riverr," "Rivver," "Rivrr") and combining them with other tags (e.g., "RiverrScape," "RivverMount").
        Originality: Ensure all generated brand names are unique and do not exist on the internet. Avoid using copyrighted brand names.
        Language: All brand names must be in English.
        Clean Output: Provide the brand names in a comma-separated list, with no additional text or formatting.
        Error Handling: If the user's input is unclear or faulty, generate 100 random, unique brand names following the same originality and language guidelines.
        Filter Vulgarity: Remove any vulgar or offensive words during the brand name creation process.
        Output Format:

        brand-name1,brand-name2,brand-name3, ... brand-name100...... Here's the user prompt - ${userPrompt}`;

    const result = await model.generateContent(modifiedPrompt);
    const output = result.response.text();

    const brandNames = output.split(",");
    console.log(brandNames);

    return NextResponse.json({ brandNames });
  } catch (err) {
    console.error("Error in generating content:", err);
    return NextResponse.json({
      msg: "There was an error!",
      error: err.message,
    });
  }
}
