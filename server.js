import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/api/ai", async (req, res) => {
  const { type, text } = req.body;

  let prompt = "";

  if (type === "summary") {
    prompt = "Summarize in bullet points:\n" + text;
  } else if (type === "quiz") {
    prompt = "Generate 5 MCQs with answers:\n" + text;
  } else if (type === "flashcards") {
    prompt = "Create flashcards (Q&A):\n" + text;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
       model: "meta-llama/llama-3-8b-instruct",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", data);

    const result =
      data.choices?.[0]?.message?.content ||
      "⚠️ No response from AI";

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.json({ result: "❌ Error connecting to AI" });
  }
});

app.use(express.static("."));

// ✅ CORRECT POSITION
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);