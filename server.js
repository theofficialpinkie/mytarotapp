// ==========================
// Imports & Setup
// ==========================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// ✅ Load environment variables
dotenv.config();

// ✅ Load deck.js
let tarotDeck;
try {
  tarotDeck = require("./deck");
  console.log("✅ Deck loaded successfully");
  console.log(`📊 Deck contains ${Object.keys(tarotDeck).length} cards`);
} catch (error) {
  console.error("❌ Error loading deck.js:", error.message);
  tarotDeck = {
    "The Fool": { upright: "New beginnings", reversed: "Recklessness", image: "/assets/faces/placeholder.png" },
    "The Magician": { upright: "Manifestation", reversed: "Manipulation", image: "/assets/faces/placeholder.png" }
  };
  console.log("🔄 Using fallback deck for testing");
}

// ✅ Create app
const app = express();
console.log("✅ Express app created");

// ==========================
// Middleware
// ==========================

const compression = require('compression');
app.use(compression()); // gzip/brotli where supported

app.use(express.json());
console.log("✅ JSON middleware added");

app.use(cors());
console.log("✅ CORS middleware added");

app.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), {
  maxAge: '30d',
  immutable: true,
  etag: false,
  setHeaders(res, filePath) {
    if (/\.(woff2?|ttf|otf|png|jpg|jpeg|webp|mp4)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    }
  }
}));


app.use(express.static(path.join(__dirname, "public")));
console.log("✅ Static middleware added");



// Debug every request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error logging middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).send("Server Error");
});

// ==========================
// Test route
// ==========================
app.get("/test", (req, res) => {
  console.log("🧪 Test route accessed");
  res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
});

let currentSpread = [];

// ==========================
// Utility: Draw spread of 18 random cards
// ==========================
function drawSpread(deck, numCards = 18) {
  console.log(`🎴 Drawing ${numCards} cards`);
  const keys = Object.keys(deck);
  console.log(`📦 Available cards: ${keys.length}`);

  if (keys.length === 0) {
    console.error("❌ No cards available in deck!");
    return [];
  }

  const available = [...keys];
  const spread = [];

  for (let i = 0; i < Math.min(numCards, keys.length); i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const cardName = available.splice(randomIndex, 1)[0];
    const isReversed = Math.random() < 0.5;

    spread.push({
      id: i + 1,
      name: cardName,
      orientation: isReversed ? "Reversed" : "Upright",
      meaning: isReversed ? deck[cardName].reversed : deck[cardName].upright,
      image: deck[cardName].image || "/assets/faces/placeholder.png"
    });
  }

  console.log(`✅ Generated spread with ${spread.length} cards`);
  return spread;
}

// ==========================
// GET Spread (18 Cards)
// ==========================
app.get("/api/spread", (req, res) => {
  console.log("🔄 Generating new spread...");
  try {
    currentSpread = drawSpread(tarotDeck, 18);
    res.json({ spread: currentSpread });
  } catch (error) {
    console.error("❌ Error generating spread:", error);
    res.status(500).json({ error: "Failed to generate spread" });
  }
});

// ==========================
// POST Reading for Selected 6 Cards
// ==========================
app.post("/api/reading", async (req, res) => {
  console.log("🔮 Processing reading request...");
  const { question, selectedCards } = req.body;

  console.log(`❓ Question: ${question}`);
  console.log(`🎯 Selected Cards: ${selectedCards.map(c => c.name).join(", ")}`);

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OpenAI API Key");
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  try {
    console.log("🤖 Calling OpenAI...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Erika Owl, a warm, intuitive tarot reader.
Your style blends deep intuition with grounded insight.
Answer exactly like the "Jamie" and "Austin" examples:

Style:
- Start with Final Interpretation at the very top (clear yes/no or directional answer in 1–2 sentences)
- Then unfold the story of the cards in a flowing, narrative style
- Interpret each card in context, weaving them into the story
- Keep it warm, empowering, conversational (spiritual bestie tone)
- Always find an uplifting, empowering angle
- End with a short affirmation

Structure:
1. **Final Interpretation** (clear answer)
2. **Card Story** (flowing interpretation of each card in context)
3. **Empowering Takeaway** (uplifting truth)
4. **Closing Affirmation** (short sentence to carry forward)`
          },
          {
            role: "user",
            content: `My question: "${question}"

Here are the cards drawn (with Erika's definitions):
${selectedCards.map(c => `- ${c.name} (${c.orientation}): ${c.meaning}`).join("\n")}

Write in the Jamie/Austin style with Final Interpretation first.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const tarotText = data?.choices?.[0]?.message?.content || "No reading received.";
    console.log("✅ Reading complete");

    res.json({ question, cards: selectedCards, answer: tarotText });

  } catch (err) {
    console.error("❌ Error in /api/reading:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// Error Handling for Crashes
// ==========================
process.on("uncaughtException", err => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", err => {
  console.error("❌ Unhandled Rejection:", err);
});

// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, "public")}`);
});
