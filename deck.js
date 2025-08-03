// Normalize card names for file names
function normalizeCardName(name) {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/'/g, "");
}

// Cards with uploaded face images
const uploadedFaces = [
  "ace-of-pentacles",
  "eight-of-cups",
  "king-of-pentacles",
  "queen-of-wands",
  "the-star",
  "three-of-cups",
  "two-of-swords"
];

// Get correct image path
function imagePath(cardName) {
  const normalized = normalizeCardName(cardName);
  return uploadedFaces.includes(normalized)
    ? `/assets/faces/${normalized}.png`
    : `/assets/faces/placeholder.png`;
}

// Full deck
const deck = {
  // ==== MAJOR ARCANA ====
  "The Fool": { upright: "Adventurous, spontaneous, hopeful, travel, inner child", reversed: "Reckless, naive, hesitant", image: imagePath("The Fool") },
  "The Magician": { upright: "Resourceful, powerful, focused, you have all the tools to succeed", reversed: "Manipulative, scattered, deceptive", image: imagePath("The Magician") },
  "The High Priestess": { upright: "Intuitive, mysterious, wise, a document being signed", reversed: "Disconnected, secretive, blocked", image: imagePath("The High Priestess") },
  "The Empress": { upright: "Nurturing, creative, abundant, self-worth", reversed: "Smothering, insecure, blocked", image: imagePath("The Empress") },
  "The Emperor": { upright: "Authoritative, structured, protective, leadership roles, starting a business", reversed: "Controlling, rigid, domineering", image: imagePath("The Emperor") },
  "The Hierophant": { upright: "Traditional, spiritual, wise, teacher, commitments", reversed: "Rebellious, dogmatic, restricted", image: imagePath("The Hierophant") },
  "The Lovers": { upright: "Romantic, harmonious, soulmate connection, choices from the heart", reversed: "Conflicted, unbalanced, detached", image: imagePath("The Lovers") },
  "The Chariot": { upright: "Driven, determined, victorious, relocation, moving forward", reversed: "Scattered, stuck, unfocused", image: imagePath("The Chariot") },
  "Strength": { upright: "Courageous, compassionate, resilient, healing confidence, inner power", reversed: "Doubtful, insecure, timid", image: imagePath("Strength") },
  "The Hermit": { upright: "Introspective, wise, solitary, spiritual study, shadow work", reversed: "Isolated, withdrawn, lost", image: imagePath("The Hermit") },
  "Wheel of Fortune": { upright: "Fortunate, cyclical, destined, karmic cycles turning", reversed: "Resistant, unlucky, stagnant", image: imagePath("Wheel of Fortune") },
  "Justice": { upright: "Fair, balanced, truthful, karmic truth, legal matters", reversed: "Unjust, biased, dishonest", image: imagePath("Justice") },
  "The Hanged Man": { upright: "Surrendered, patient, reflective, redirection", reversed: "Resistant, indecisive, stalled", image: imagePath("The Hanged Man") },
  "Death": { upright: "Transformative, endings, liberating, ego death", reversed: "Resistant, stuck, fearful of change", image: imagePath("Death") },
  "Temperance": { upright: "Balanced, harmonious, aligned, healing integration", reversed: "Excessive, imbalanced, impatient", image: imagePath("Temperance") },
  "The Devil": { upright: "Attached, addictive, intense, toxic ties", reversed: "Liberated, detached, awakened", image: imagePath("The Devil") },
  "The Tower": { upright: "Chaotic, sudden change, revolutionary shifts, physical move", reversed: "Avoided disaster, internal shifts", image: imagePath("The Tower") },
  "The Star": { upright: "Hopeful, inspired, healing, connecting to earth and oneness", reversed: "Discouraged, disconnected, faithless", image: imagePath("The Star") },
  "The Moon": { upright: "Mysterious, emotional, psychic awakening, dreams", reversed: "Confused, fearful, unclear", image: imagePath("The Moon") },
  "The Sun": { upright: "Joyful, radiant, successful, celebration, children", reversed: "Pessimistic, doubtful, drained", image: imagePath("The Sun") },
  "Judgement": { upright: "Awakened, accountable, renewed, spiritual call", reversed: "Denial, regretful, avoiding responsibility", image: imagePath("Judgement") },
  "The World": { upright: "Complete, fulfilled, accomplished, karmic closure", reversed: "Unfinished, delayed, blocked", image: imagePath("The World") },

  // ==== WANDS ====
  "Ace of Wands": { upright: "New inspiration, spark, creation", reversed: "Delays, lack of motivation, creative block", image: imagePath("Ace of Wands") },
  "Two of Wands": { upright: "Planning, future vision, decisions on how to move forward", reversed: "Fear of change, playing it safe", image: imagePath("Two of Wands") },
  "Three of Wands": { upright: "Expansion, foresight, progress", reversed: "Obstacles, lack of direction, delays", image: imagePath("Three of Wands") },
  "Four of Wands": { upright: "Celebration, home, unity, wedding, events", reversed: "Conflict at home, instability, transition", image: imagePath("Four of Wands") },
  "Five of Wands": { upright: "Conflict, competition, tension", reversed: "Resolution, harmony, avoiding conflict", image: imagePath("Five of Wands") },
  "Six of Wands": { upright: "Victory, recognition, success", reversed: "Ego, failure, lack of acknowledgment", image: imagePath("Six of Wands") },
  "Seven of Wands": { upright: "Perseverance, defence, standing ground", reversed: "Giving up, overwhelm, defensiveness", image: imagePath("Seven of Wands") },
  "Eight of Wands": { upright: "Speed, momentum, rapid change", reversed: "Delays, chaos, frustration", image: imagePath("Eight of Wands") },
  "Nine of Wands": { upright: "Resilience, boundaries, persistence", reversed: "Burnout, paranoia, giving in", image: imagePath("Nine of Wands") },
  "Ten of Wands": { upright: "Burden, hard work, responsibility", reversed: "Release, overwhelm, avoiding duty", image: imagePath("Ten of Wands") },
  "Page of Wands": { upright: "Curiosity, ideas, adventure", reversed: "Immaturity, scattered energy, lack of direction", image: imagePath("Page of Wands") },
  "Knight of Wands": { upright: "Action, passion, fearless pursuit", reversed: "Impulsiveness, anger, recklessness", image: imagePath("Knight of Wands") },
  "Queen of Wands": { upright: "Confidence, warmth, magnetism", reversed: "Jealousy, insecurity, introversion", image: imagePath("Queen of Wands") },
  "King of Wands": { upright: "Leadership, vision, boldness", reversed: "Arrogance, control, ruthless ambition", image: imagePath("King of Wands") },

  // ==== CUPS ====
  "Ace of Cups": { upright: "New love, emotional opening, creativity", reversed: "Blocked emotions, emotional loss", image: imagePath("Ace of Cups") },
  "Two of Cups": { upright: "Partnership, connection, unity", reversed: "Disharmony, breakup, imbalance", image: imagePath("Two of Cups") },
  "Three of Cups": { upright: "Celebration, friendship, community", reversed: "Gossip, overindulgence, isolation", image: imagePath("Three of Cups") },
  "Four of Cups": { upright: "Apathy, contemplation, reevaluation", reversed: "New outlook, opportunities, seizing moment", image: imagePath("Four of Cups") },
  "Five of Cups": { upright: "Regret, grief, focusing on loss", reversed: "Healing, acceptance, moving on", image: imagePath("Five of Cups") },
  "Six of Cups": { upright: "Nostalgia, innocence, childhood", reversed: "Living in the past, unrealistic memories", image: imagePath("Six of Cups") },
  "Seven of Cups": { upright: "Choices, illusions, daydreaming", reversed: "Clarity, decisiveness, reality check", image: imagePath("Seven of Cups") },
  "Eight of Cups": { upright: "Letting go, walking away, soul search", reversed: "Fear of leaving, emotional confusion", image: imagePath("Eight of Cups") },
  "Nine of Cups": { upright: "Satisfaction, wishes coming true, pleasure", reversed: "Dissatisfaction, greed, superficiality", image: imagePath("Nine of Cups") },
  "Ten of Cups": { upright: "Emotional fulfilment, family, joy", reversed: "Broken relationships, discontent, imbalance", image: imagePath("Ten of Cups") },
  "Page of Cups": { upright: "Intuition, creative messages, sensitivity", reversed: "Emotional immaturity, blocked intuition", image: imagePath("Page of Cups") },
  "Knight of Cups": { upright: "Romance, following the heart, charm", reversed: "Moodiness, manipulation, heartbreak", image: imagePath("Knight of Cups") },
  "Queen of Cups": { upright: "Compassion, emotional depth, psychic gifts", reversed: "Co-dependency, emotional overwhelm", image: imagePath("Queen of Cups") },
  "King of Cups": { upright: "Emotional balance, maturity, diplomacy", reversed: "Emotional repression, coldness, manipulation", image: imagePath("King of Cups") },

  // ==== SWORDS ====
  "Ace of Swords": { upright: "Mental clarity, truth, breakthroughs", reversed: "Confusion, misinformation, clouded judgment", image: imagePath("Ace of Swords") },
  "Two of Swords": { upright: "Indecision, stalemate, tough choices", reversed: "Emotional overwhelm, avoidance, lies", image: imagePath("Two of Swords") },
  "Three of Swords": { upright: "Heartbreak, sorrow, emotional pain", reversed: "Healing, forgiveness, release", image: imagePath("Three of Swords") },
  "Four of Swords": { upright: "Rest, recovery, mental restoration", reversed: "Burnout, restlessness, avoidance", image: imagePath("Four of Swords") },
  "Five of Swords": { upright: "Conflict, defeat, ego battles", reversed: "Reconciliation, resolution, regret", image: imagePath("Five of Swords") },
  "Six of Swords": { upright: "Transition, moving on, healing journey", reversed: "Resistance to change, baggage, stagnation", image: imagePath("Six of Swords") },
  "Seven of Swords": { upright: "Deception, secrecy, strategy", reversed: "Truth revealed, guilt, confession", image: imagePath("Seven of Swords") },
  "Eight of Swords": { upright: "Trapped, fear, mental blocks", reversed: "Liberation, perspective shift, freedom", image: imagePath("Eight of Swords") },
  "Nine of Swords": { upright: "Anxiety, nightmares, overthinking", reversed: "Relief, facing fears, healing", image: imagePath("Nine of Swords") },
  "Ten of Swords": { upright: "Painful ending, betrayal, loss", reversed: "Recovery, release, regeneration", image: imagePath("Ten of Swords") },
  "Page of Swords": { upright: "Curiosity, intellect, ideas", reversed: "Gossip, cynicism, mental chaos", image: imagePath("Page of Swords") },
  "Knight of Swords": { upright: "Ambition, quick action, truth-teller", reversed: "Impulsiveness, aggression, recklessness", image: imagePath("Knight of Swords") },
  "Queen of Swords": { upright: "Clarity, truth, independence", reversed: "Coldness, harshness, overcritical", image: imagePath("Queen of Swords") },
  "King of Swords": { upright: "Logic, authority, truth", reversed: "Manipulation, misuse of power", image: imagePath("King of Swords") },

  // ==== PENTACLES ====
  "Ace of Pentacles": { upright: "New opportunity, prosperity, foundation", reversed: "Missed chance, scarcity, instability", image: imagePath("Ace of Pentacles") },
  "Two of Pentacles": { upright: "Balance, juggling, adaptability", reversed: "Overwhelm, disorganisation, financial stress", image: imagePath("Two of Pentacles") },
  "Three of Pentacles": { upright: "Teamwork, skill, collaboration", reversed: "Misalignment, lack of effort, conflict", image: imagePath("Three of Pentacles") },
  "Four of Pentacles": { upright: "Security, control, saving", reversed: "Greed, fear of loss, release", image: imagePath("Four of Pentacles") },
  "Five of Pentacles": { upright: "Hardship, loss, scarcity mindset", reversed: "Recovery, hope, spiritual support", image: imagePath("Five of Pentacles") },
  "Six of Pentacles": { upright: "Generosity, balance, receiving", reversed: "Strings attached, debt, imbalance", image: imagePath("Six of Pentacles") },
  "Seven of Pentacles": { upright: "Patience, long-term view, investment", reversed: "Impatience, lack of results, waste", image: imagePath("Seven of Pentacles") },
  "Eight of Pentacles": { upright: "Mastery, diligence, dedication", reversed: "Perfectionism, lack of focus, burnout", image: imagePath("Eight of Pentacles") },
  "Nine of Pentacles": { upright: "Independence, luxury, self-worth", reversed: "Over-dependence, insecurity, financial worry", image: imagePath("Nine of Pentacles") },
  "Ten of Pentacles": { upright: "Legacy, wealth, family stability", reversed: "Financial loss, instability, broken tradition", image: imagePath("Ten of Pentacles") },
  "Page of Pentacles": { upright: "Opportunity, learning, ambition", reversed: "Laziness, lack of commitment, missed chance", image: imagePath("Page of Pentacles") },
  "Knight of Pentacles": { upright: "Reliability, steady progress, responsibility", reversed: "Stagnation, boredom, overcautiousness", image: imagePath("Knight of Pentacles") },
  "Queen of Pentacles": { upright: "Nurturing, grounded, prosperity", reversed: "Work-life imbalance, insecurity", image: imagePath("Queen of Pentacles") },
  "King of Pentacles": { upright: "Abundance, discipline, leadership", reversed: "Greed, rigidity, obsession with status", image: imagePath("King of Pentacles") }
};

module.exports = deck;
