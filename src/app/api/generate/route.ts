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
Generate an array of 30 original brand names based on the following concept provided by the user:
    ${userPrompt}

**Process:**

1.  **Internal Word Generation:** First, internally generate a list of 50 unique, creative words (nouns, adjectives, verbs, neologisms) directly inspired by the theme, mood, and keywords within the userPrompt. These words should change with each generation and serve as the foundation for the brand names. Think about concepts like mystery, vision, film, storytelling, cosmos, mythology, etc., as relevant to the user's prompt.
2.  **Brand Name Creation:** Using the 50 generated words as primary inspiration and building blocks, create the 30 brand names according to the rules below.

**Naming Rules & Structure:**

1.  **Names 1-15 (Real Word Combinations):**
    * Craft these names by combining two existing, meaningful English words.
    * Draw inspiration heavily from the 50 internally generated words, the userPrompt theme, and any provided keywords/tags. Aim for evocative combinations related to the core concept (e.g., "ChronoWeave Films", "AetherLight Pictures").
    * If the user provides keywords or tags, creatively incorporate them into a few names in this section.

2.  **Names 16-30 (Invented Words):**
    * Create entirely new, invented words that sound cinematic, brandable, and thematic (e.g., mysterious, visionary).
    * **Crucially:** Construct these names by blending, combining parts of, or modifying words *from the list of 50 generated words*, or by combining an element from the generated list with a suitable real word element.
    * In the \`idea\` field for these names, show the breakdown of how the invented word was formed (e.g., "idea: Obscura + Lume [generated word]").
    * In the \`description\` field, explain the meaning derived from the combined or modified parts, linking it back to the theme.
    * If the user provides keywords or tags, creatively incorporate them into a few names in this section as well.

3.  **General Requirements:**
    * Ensure all 30 names are original and avoid obvious conflicts with well-known brands, especially in relevant industries (film, media, design, tech).
    * Keep names relatively simple and memorable, yet unique.
    * Do not reuse the exact same generated word combinations excessively; strive for variety.

**Output Format:**
✅ Return the result ONLY as a clean JavaScript-style array of 30 items, formatted as a JSON string. Do NOT include backticks (\`\`\`), markdown, or any syntax highlighting around the final array output.
✅ Ensure there are no unnecessary line breaks within the JSON structure.
✅ Each item in the array must strictly follow this format:
    ["Brand Name", { idea: "Short poetic idea / Word breakdown for invented names", description: "A brief sweet paragraph explanation based on the theme of the name." }]

⚠️ Example structure of the final output (should be a single JSON string):
[
  ["ChronoWeave Films", { idea: "Weaving time into visual stories", description: "Combines chronology and narrative craft, suggesting films that masterfully manipulate time." }],
  ["Lumivox", { idea: "Lumi [generated: light] + Vox [generated: voice]", description: "An invented name suggesting the 'voice of light', representing visionary storytelling through cinematic expression." }],
  ...
]

Do NOT include explanations or introductory text before the array. Output ONLY the JSON array string.`;

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
