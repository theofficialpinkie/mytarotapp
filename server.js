const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const tarotDeck = require("./deck"); // Import full 78-card deck

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

let currentSpread = [];

// Utility: Draw spread of 18 random cards
function drawSpread(deck, numCards = 18) {
  const keys = Object.keys(deck);
  const available = [...keys];
  const spread = [];

  for (let i = 0; i < numCards; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const cardName = available.splice(randomIndex, 1)[0];
    const isReversed = Math.random() < 0.5;

    spread.push({
      id: i + 1,
      name: cardName,
      orientation: isReversed ? "Reversed" : "Upright",
      meaning: isReversed ? deck[cardName].reversed : deck[cardName].upright,
      image: `/assets/faces/placeholder.png` // Placeholder image for all cards now
    });
  }
  return spread;
}

// GET spread (18 cards)
app.get("/api/spread", (req, res) => {
  currentSpread = drawSpread(tarotDeck, 18);
  res.json({ spread: currentSpread });
});

// POST reading for selected 6 cards
app.post("/api/reading", async (req, res) => {
  const { question, selectedIds } = req.body;
  const selectedCards = currentSpread.filter(c => selectedIds.includes(c.id));

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
          {
            role: "system",
            content: `You are Erika Owl, a warm, intuitive tarot reader. 
Your style blends deep intuition with grounded insight. 

When responding:  
- Always start with a clear, direct answer to the user’s question in the very first sentences.  
- Present a central theme that runs through the reading, weaving it into the interpretation of each card.  
- Speak in a "spiritual bestie" tone—warm, empowering, conversational, with a dash of playful sass.  
- Interpret the cards in a flowing narrative that feels like a story, not a list.  
- Include punchy, memorable lines (without overdoing it) that make the insight stick.  
- Keep the response 
- End with a short, powerful affirmation or takeaway** that leaves the user feeling clear, confident, and aligned.  


Structure to follow:  
1. Opening clarity – Give a direct yes/no or clear directional answer in the first sentence.  
2. Theme introduction – State the central energy guiding the reading.  
3. Card story – Interpret each card in context, reinforcing the theme.  
4. Punchy insight – Share a key truth or empowering takeaway.  
5. Closing affirmation – Short, uplifting sentence the user can carry forward.`
          },
          {
            role: "user",
            content: `
The question is: "${question}"
The drawn cards are:
${selectedCards.map(c => `- ${c.name} (${c.orientation}): ${c.meaning}`).join("\n")}
Please interpret them in the style described above.
`
          }
        ]
      })
    });

    const data = await response.json();
    const tarotText = data?.choices?.[0]?.message?.content || "No reading received.";
    res.json({ question, cards: selectedCards, answer: tarotText });

  } catch (err) {
    console.error("Error in reading endpoint:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
