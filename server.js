const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static(".")); // Serve index.html

// Full 78-card deck with upright/reversed meanings
const tarotDeck = {
  "The Fool": { upright: "Adventurous, spontaneous, hopeful, new beginnings, travel, inner child", reversed: "Reckless, naive, hesitant" },
  "The Magician": { upright: "Resourceful, powerful, focused, manifestation, you have all the tools to succeed", reversed: "Manipulative, scattered, deceptive" },
  "The High Priestess": { upright: "Intuitive, mysterious, wise, a document being signed", reversed: "Disconnected, secretive, blocked intuition" },
  "The Empress": { upright: "Nurturing, creative, abundant, self-worth", reversed: "Smothering, insecure, blocked creativity" },
  "The Emperor": { upright: "Authoritative, structured, protective, leadership roles, starting a business", reversed: "Controlling, rigid, domineering" },
  "The Hierophant": { upright: "Traditional, spiritual, wise, teacher, commitments", reversed: "Rebellious, dogmatic, restricted" },
  "The Lovers": { upright: "Romantic, harmonious, soulmate connection, choices from the heart", reversed: "Conflicted, unbalanced, detached" },
  "The Chariot": { upright: "Driven, determined, victorious, relocation, moving forward", reversed: "Scattered, stuck, unfocused" },
  "Strength": { upright: "Courageous, compassionate, resilient, healing confidence, inner power", reversed: "Doubtful, insecure, timid" },
  "The Hermit": { upright: "Introspective, wise, solitary, spiritual study, shadow work", reversed: "Isolated, withdrawn, lost" },
  "Wheel of Fortune": { upright: "Fortunate, cyclical, destined, karmic cycles turning", reversed: "Resistant, unlucky, stagnant" },
  "Justice": { upright: "Fair, balanced, truthful, karmic truth, legal matters", reversed: "Unjust, biased, dishonest" },
  "The Hanged Man": { upright: "Surrendered, patient, reflective, redirection", reversed: "Resistant, indecisive, stalled" },
  "Death": { upright: "Transformative, endings, liberating, ego death", reversed: "Resistant, stuck, fearful of change" },
  "Temperance": { upright: "Balanced, harmonious, aligned, healing integration", reversed: "Excessive, imbalanced, impatient" },
  "The Devil": { upright: "Attached, addictive, intense, toxic ties", reversed: "Liberated, detached, awakened" },
  "The Tower": { upright: "Chaotic, sudden change, revolutionary shifts, physical move", reversed: "Avoided disaster, internal shifts" },
  "The Star": { upright: "Hopeful, inspired, healing, connecting to earth and oneness", reversed: "Discouraged, disconnected, faithless" },
  "The Moon": { upright: "Mysterious, emotional, psychic awakening, dreams", reversed: "Confused, fearful, unclear" },
  "The Sun": { upright: "Joyful, radiant, successful, celebration, children", reversed: "Pessimistic, doubtful, drained" },
  "Judgement": { upright: "Awakened, accountable, renewed, spiritual call", reversed: "Denial, regretful, avoiding responsibility" },
  "The World": { upright: "Complete, fulfilled, accomplished, karmic closure", reversed: "Unfinished, delayed, blocked" },
  // (Wands, Cups, Swords, Pentacles go here — omitted for brevity but keep from previous deck)
};

// Draw random 6 cards
function drawCards(deck, numCards = 6) {
  const keys = Object.keys(deck);
  const drawn = [];
  for (let i = 0; i < numCards; i++) {
    const cardName = keys[Math.floor(Math.random() * keys.length)];
    const isReversed = Math.random() < 0.5;
    drawn.push({
      name: `${cardName}${isReversed ? " (Reversed)" : ""}`,
      meaning: isReversed ? deck[cardName].reversed : deck[cardName].upright,
      orientation: isReversed ? "Reversed" : "Upright"
    });
  }
  return drawn;
}

app.post("/api/tarot", async (req, res) => {
  const { question } = req.body;
  const drawnCards = drawCards(tarotDeck);

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
            content: `
You are Erika Owl, a warm, intuitive tarot reader.
Your style blends deep intuition with grounded insight.

Always answer in a narrative style that:
- Directly addresses the user's specific question
- Weaves the meaning of the drawn tarot cards into a flowing, cohesive story
- Gives a clear, direct answer at the end
- Speaks in a "spiritual bestie" tone
`
          },
          {
            role: "user",
            content: `
The question is: "${question}"
The drawn cards are:
${drawnCards.map(c => `- ${c.name}: ${c.meaning}`).join("\n")}

Please interpret them in the style described above.
`
          }
        ]
      })
    });

    const data = await response.json();
    const tarotText = data?.choices?.[0]?.message?.content || "No reading received.";

    res.json({ 
      question, 
      cards: drawnCards, 
      answer: tarotText 
    });

  } catch (err) {
    console.error("Error in tarot endpoint:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
