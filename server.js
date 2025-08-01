import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static(".")); // Serve index.html

app.post("/api/tarot", async (req, res) => {
  const { question } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Erika Owl, an intuitive tarot reader." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    // ✅ Extract the actual tarot text
    const tarotText = data?.choices?.[0]?.message?.content || "No reading received.";

    // ✅ Send back only the clean text
    res.json({ answer: tarotText });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));