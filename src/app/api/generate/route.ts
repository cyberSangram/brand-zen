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

    const modifiedPrompt = `Generate an array of 100 original brand names, if the user provides keywords or tags, always include those creatively in a few names across both sections, based on the following concept:
    ${userPrompt}

Brand Naming Rules:

The first 50 names should be combinations of two meaningful real words (e.g., Mythoscope Studios) — evoke themes like mystery, visuals, mythology, cosmos, storytelling, or film.

The last 50 names must be completely new, invented words that feel brandable, cinematic, and mysterious (e.g., Obscinova = Obscure + Supernova). Note - these output are for an example prompt 


🛡️ Ensure that all 100 names are original and do not conflict with existing well-known brand names. Avoid names already in use by major brands or domains (especially in media, design, or film).

🎯 Return ONLY the final result as a single comma-separated array like this:
brandname1,brandname2,brandname3,...,brandname100`;

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
