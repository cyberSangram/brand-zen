import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { config as dotenvConfig } from "dotenv";
import json5 from "json5";

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

    const modifiedPrompt = `
Generate an array of 30 original brand names, if the user provides keywords or tags, always include those creatively in a few names across both sections, based on the following concept:
    ${userPrompt}

    Use simple words to create brand names (be creative)

Naming Rules:

1. The first 15 names must be made by combining two real, meaningful words (e.g., "Mythoscope Studios") — evoking themes of mystery, vision, film, storytelling, cosmos, or mythology.

2. The last 15 names must be entirely new, invented words that sound cinematic, brandable, and mysterious (e.g., "Obscinova" = Obscure + Supernova). Note - show the breakdown of words that are formed using the combination of 2 two words in case of invented words in the "idea" key. In the description explain the meaning of the individual words too 

3. If the user provides tags or keywords, incorporate them creatively into a few names across both sections.

4. Ensure names are original and do not conflict with existing well-known brands, especially in the film, media, or design industries.

✅ Return the result ONLY as a clean JavaScript-style array of 30 items. Do not include backticks (\`\`\`) or any syntax highlighting.

Each item must be formatted like this:

["Brand Name", { idea: "Short poetic idea", description: "A brief sweet paragraph explanation based on the theme of the name." }]

⚠️ Output format should look like this (Convert this to a JSON string ):

[
  ["Mythoscope Studios", { idea: "Seeing stories beyond the veil", description: "Combines myth and vision to reveal cinematic legends." }],
  ["Obscinova", { idea: "Obscure + Supernova", description: "Explosive visuals emerge from mysterious depths." }],
  ...
]

Do NOT wrap the output in code blocks, do NOT include markdown, do NOT break lines unnecessarily.
`;

    const result = await model.generateContent(modifiedPrompt);
    const output = result.response.text();

    console.log(output);
    const brandNames = json5.parse(output);

    return NextResponse.json({ brandNames });
  } catch (err) {
    console.error("Error in generating content:", err);
    return NextResponse.json({
      msg: "There was an error!",
      error: err.message,
    });
  }
}
