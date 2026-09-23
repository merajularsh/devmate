import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a senior software engineer doing a code review.
Analyze the code the user sends and respond with ONLY valid JSON (no markdown, no backticks) in this exact shape:
{
  "language": "detected programming language",
  "summary": "2-3 sentence plain-English explanation of what the code does",
  "issues": [
    { "line": number or null, "severity": "high" | "medium" | "low", "problem": "what is wrong", "fix": "how to fix it" }
  ],
  "improvedCode": "the full corrected version of the code"
}
Severity guide: high = bugs, crashes, security holes; medium = performance or bad practice; low = style and readability.
If there are no issues, return an empty issues array. If the input is not code, set language to "unknown" and explain in summary.`;

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    // Debug: check if key is loaded
    console.log("API Key present?", !!process.env.ANTHROPIC_API_KEY);
    console.log("API Key first 20 chars:", process.env.ANTHROPIC_API_KEY?.slice(0, 20));

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return Response.json({ error: "Please paste some code." }, { status: 400 });
    }
    if (code.length > 8000) {
      return Response.json({ error: "Code is too long (max 8000 characters)." }, { status: 400 });
    }

    console.log("Calling Claude API...");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Language hint: ${language || "auto-detect"}\n\nCode:\n${code}`,
        },
      ],
    });

    const block = message.content[0];
    const text = block.type === "text" ? block.text : "";
    const cleaned = text.replace(/```json|```/g, "").trim();

    const review = JSON.parse(cleaned);
    return Response.json(review);
  } catch (error) {
    console.error("Review error details:", error);
    return Response.json(
      { error: `Review failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}