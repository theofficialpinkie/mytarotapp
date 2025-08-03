// Elements
const chatContainer = document.getElementById("chatContainer");
const inputContainer = document.getElementById("inputContainer");

const startBtn = document.getElementById("startReadingBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const getReadingBtn = document.getElementById("getReadingBtn");
const questionInput = document.getElementById("question");

let selectedCards = [];
let spreadCards = [];

// Step 1: Start Reading
startBtn.addEventListener("click", () => {
  addMessage("Erika Owl", "Wonderful! What’s your question for today’s reading?", "erika");
  inputContainer.classList.remove("hidden");
  shuffleBtn.classList.remove("hidden");
  startBtn.parentElement.remove(); // Remove Generate Reading button
});

// Step 2: Shuffle Cards after question asked
shuffleBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) return;

  // Show question as user bubble
  addMessage("You", question, "user");

  addMessage("Erika Owl", "Perfect. Let’s shuffle the cards…", "erika");

  // Get spread from server
  const res = await fetch("/api/spread");
  const data = await res.json();
  spreadCards = data.spread;
  selectedCards = [];

  // Show back of cards
  showCardBacks(spreadCards);
});

// Step 3: Show 18 Card Backs
function showCardBacks(spread) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card-row");

  spread.forEach(card => {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card");

    const cardBack = document.createElement("img");
    cardBack.src = "/assets/backs/card-back.png";
    cardBack.classList.add("chat-card");

    cardBack.addEventListener("click", () => {
      if (selectedCards.includes(card) || selectedCards.length >= 6) return;
      selectedCards.push(card);

      // Flip card
      cardBack.src = card.image;
      cardBack.classList.add("flipped");

      // Show Generate Reading when 6 selected
      if (selectedCards.length === 6) {
        getReadingBtn.classList.remove("hidden");
        addMessage("Erika Owl", "Beautiful, I have your 6 cards. Ready for your reading?", "erika");
      }
    });

    cardWrapper.appendChild(cardBack);
    cardDiv.appendChild(cardWrapper);
  });

  chatContainer.appendChild(cardDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Step 4: Generate Reading
getReadingBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim() || "General guidance";

  addMessage("Erika Owl", "Let’s see what the cards reveal…", "erika");

  const res = await fetch("/api/reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, selectedIds: selectedCards.map(c => c.id) })
  });

  const data = await res.json();
  addMessage("Erika Owl", data.answer, "erika");

  getReadingBtn.classList.add("hidden");
});

// Helper: Add message to chat
function addMessage(sender, text, type) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message", type);

  if (type === "erika") {
    msgDiv.innerHTML = `
      <img src="/assets/erika-avatar.png" class="avatar">
      <div class="chat-bubble"><strong>${sender}:</strong> ${text}</div>
    `;
  } else {
    msgDiv.innerHTML = `
      <div class="chat-bubble"><strong>${sender}:</strong> ${text}</div>
    `;
  }

  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
