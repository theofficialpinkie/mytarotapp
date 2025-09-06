// ==========================
// Imports & Setup
// ==========================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const compression = require("compression");

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
    "The Fool": { upright: "New beginnings", reversed: "Recklessness", image: "/assets/faces/placeholder.webp" },
    "The Magician": { upright: "Manifestation", reversed: "Manipulation", image: "/assets/faces/placeholder.webp" }
  };
  console.log("🔄 Using fallback deck for testing");
}

// ==========================
// DEMO: Force specific 6 cards (and optional custom images)
// ==========================
const DEMO_MODE = true;

// 👇 Edit these 6 to whatever you want for the demo (names must exist in deck.js)
const DEMO_CARDS = [
  "The Lovers",
  "The High Priestess",
  "The Hanged Man",
  "The Chariot",
  "The Emperor",
  "Six of Pentacles",
];

// (Optional) override image paths for those cards (leave empty to use deck image)
const DEMO_IMAGES = {
  "The Lovers": "/assets/faces/webp/the-lovers.webp?v=2",
  "The High Priestess": "/assets/faces/webp/the-high-priestess.webp?v=2",
  "The Hanged Man": "/assets/faces/webp/the-hanged-man.webp?v=2",
  "The Chariot": "/assets/faces/webp/the-chariot.webp?v=2",
  "The Emperor": "/assets/faces/webp/the-emperor.webp?v=2",
  "Six of Pentacles": "/assets/faces/webp/six-of-pentacles.webp?v=2",
};

// ==========================
// Create app
// ==========================
const app = express();
console.log("✅ Express app created");

// ==========================
// Middleware
// ==========================
app.use(compression()); // gzip/brotli where supported
app.use(express.json());
console.log("✅ JSON middleware added");

app.use(cors());
console.log("✅ CORS middleware added");

// Serve assets with long cache for images/fonts/videos
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

// General static
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

// Holds the last generated spread (if you need it)
let currentSpread = [];

// ==========================
// Utility: Draw spread of 18 cards (cycled from 6 forced cards in DEMO)
// ==========================
function drawSpread(deck, numCards = 18) {
  console.log(`🎴 Drawing ${numCards} cards`);

  if (!deck || Object.keys(deck).length === 0) {
    console.error("❌ No cards available in deck!");
    return [];
  }

  // DEMO MODE: build the spread only from DEMO_CARDS, cycling to fill numCards

  if (DEMO_MODE) {
  const spread = [];

  // Shuffle the 6 demo cards for uniqueness + random order
  const shuffled = [...DEMO_CARDS].sort(() => Math.random() - 0.5);

  shuffled.forEach((name, i) => {
    const def = deck[name];
    const isReversed = Math.random() < 0.5;

    spread.push({
      id: i + 1,
      name,
      orientation: isReversed ? "Reversed" : "Upright",
      meaning: def ? (isReversed ? def.reversed : def.upright) : "(no definition)",
      image: DEMO_IMAGES[name] || def?.image || "/assets/faces/placeholder.webp",
    });
  });

  // Pad the rest with placeholders to reach 18 total
 while (spread.length < 18) {
  spread.push({
    id: spread.length + 1,
    name: "Placeholder",
    orientation: "Upright",
    meaning: "(demo only)",
    image: "/assets/faces/placeholder.webp",
    isPlaceholder: true   // 👈 NEW
  });
}


  console.log(`✅ DEMO spread generated: ${spread.length} cards (6 unique + padding)`);
  return spread;
}

  // === Original random behavior (not used in DEMO mode) ===
  const keys = Object.keys(deck);
  const available = [...keys];
  const spread = [];

  for (let i = 0; i < Math.min(numCards, keys.length); i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const visibleCardName = available.splice(randomIndex, 1)[0];
    const isReversed = Math.random() < 0.5;

    spread.push({
      id: i + 1,
      name: visibleCardName,
      orientation: isReversed ? "Reversed" : "Upright",
      meaning: isReversed ? deck[visibleCardName].reversed : deck[visibleCardName].upright,
      image: deck[visibleCardName].image || "/assets/faces/placeholder.webp",
    });
  }

  console.log(`✅ Generated spread with ${spread.length} cards`);
  return spread;
}

// ==========================
// GET /api/spread  -> returns 18 cards (cycled from the 6)
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
// POST /api/reading -> uses the same 6 forced cards for the interpretation
// ==========================
app.post("/api/reading", async (req, res) => {
  console.log("🔮 Processing reading request...");
  const { question, selectedCards } = req.body;

  console.log(`❓ Question: ${question}`);
  console.log(`🎯 Selected Cards: ${selectedCards?.map(c => c.name).join(", ")}`);

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI API Key");
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  try {
    // Build the list actually used for the reading
    const cardsForReading = (DEMO_MODE ? selectedCards.map((card, index) => {
      const name = DEMO_CARDS[index % DEMO_CARDS.length];
      const def = tarotDeck[name];
      const orientation = card.orientation; // keep user’s upright/reversed selection

      return {
        name,
        orientation,
        meaning: def ? (orientation === "Reversed" ? def.reversed : def.upright) : "(no definition)",
        image: DEMO_IMAGES[name] || card.image, // keep visible image or override with DEMO image
      };
    }) : selectedCards) || [];

    console.log(`🎭 Cards used for reading: ${cardsForReading.map(c => `${c.name} (${c.orientation})`).join(", ")}`);

    // === OpenAI call ===
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
            content: `My question: "${question || ""}"

Here are the cards drawn (with Erika's definitions):
${cardsForReading.map(c => `- ${c.name} (${c.orientation}): ${c.meaning}`).join("\n")}

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

    // Return the original *visible* cards back to the UI, keep answer from cardsForReading
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
  console.log(`Server running on port ${PORT}`);
});
