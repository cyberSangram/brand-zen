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
    // console.log(tagsArray);
    // const userPrompt = `Brand Description: ${brandDescription}`;

    // const modifiedPrompt = `You are a brand name generator. Your task is to create 100 unique and original brand names based on the user's input. The user will provide a brand description and a list of keywords or tags in an array format.
    //  Output Format:

    //      brand-name1,brand-name2,brand-name3, ... brand-name100...... Here's the user prompt - ${userPrompt}`;

    const modifiedPrompt = `You are a highly creative brand name generator. Your task is to produce short, unique, and memorable two-word brand names based on a provided brand description and a list of keywords. The user will provide a brand description and a list of keywords or tags in an array format.

    Instructions:
    
        generate 100 brand names and do make sure that you only write the names of the brand without any explaination or sentences
        Understand the Brand: Carefully analyze the brand description to grasp the brand's core values, target audience, and overall aesthetic.
        Incorporate Keywords: Seamlessly integrate the provided keywords or variations of them into the generated brand names.
        Generate Unique Names: Create brand names that are original, catchy, and not already in widespread use.
        Consider Tone and Style: Match the tone and style of the brand names to the brand description.
        Provide Variety: Generate brand names in the following styles, 16 names per style:
        Classic & Sophisticated
        Modern & Minimalist
        Playful & Inviting
        Artisan & Earthy
        Unique & Evocative
        but never ever write the styles in the output
        Keyword Integration: Within each style, ensure that 8 of the generated names directly incorporate the user-provided keywords or slight variations.
        Word Combinations: Generate 20 brand names using combinations of:
        10 combinations of the user-provided keywords.
        10 combinations of words that the AI creates based on the meaning of the keywords.
        Short and Precise Two-Word Names: Ensure all generated brand names consist of two short, concise, and easy-to-pronounce words.
        Output: Provide the brand names in the following format:
        Classic & Sophisticated: [16 brand names]
        Modern & Minimalist: [16 brand names]
        Playful & Inviting: [16 brand names]
        Artisan & Earthy: [16 brand names]
        Unique & Evocative: [16 brand names]
        Word Combinations: [20 brand names]
        
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
