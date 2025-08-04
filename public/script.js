const chatContainer = document.getElementById("chatContainer");
const inputContainer = document.getElementById("inputContainer");
const questionInput = document.getElementById("question");
const sendQuestionBtn = document.getElementById("sendQuestionBtn");

let spreadCards = [];
let selectedCards = [];

// STEP 1: Generate Reading Button Click
document.getElementById("startReadingBtn").addEventListener("click", () => {
  addMessage("Erika Owl", "Great! Please type your question below.", "erika");
  questionInput.classList.add("active");
  sendQuestionBtn.disabled = false;
});

// STEP 2: Send Question
sendQuestionBtn.addEventListener("click", () => {
  const question = questionInput.value.trim();
  if (!question) return;

  addMessage("You", question, "user");
  questionInput.value = "";

  addMessage("Erika Owl", "Ok, deep breath, set an intention...", "erika");
  addButtonBelow("Shuffle Cards", shuffleCards);
});

// STEP 3: Shuffle Cards
async function shuffleCards() {
  addMessage("Erika Owl", "Shuffling your cards…", "erika");

  const res = await fetch("/api/spread");
  const data = await res.json();
  spreadCards = data.spread;
  selectedCards = [];

  showCardBacks(spreadCards);
}

// STEP 4: Show Card Backs (18 total)
function showCardBacks(spread) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card-row");

  spread.forEach(card => {
    const img = document.createElement("img");
    img.src = "/assets/backs/card-back.png";
    img.classList.add("chat-card");

    img.addEventListener("click", () => {
      if (selectedCards.length >= 6 || selectedCards.includes(card)) return;
      selectedCards.push(card);

      // Flip to reveal the card
      img.src = card.image;
      img.classList.add("flipped");

      if (selectedCards.length === 6) {
        addButtonBelow("Generate Reading", generateReading);
      }
    });

    cardDiv.appendChild(img);
  });

  chatContainer.appendChild(cardDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// STEP 5: Generate Reading
async function generateReading() {
  addMessage("Erika Owl", "Wait a second, I’m generating your reading…", "erika");

  const res = await fetch("/api/reading", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      question: questionInput.value || "General guidance", 
      selectedIds: selectedCards.map(c => c.id) 
    })
  });

  const data = await res.json();
  addMessage("Erika Owl", data.answer, "erika");
}

// Utility: Add Message to Chat
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

// Utility: Add Button Below a Message
function addButtonBelow(text, callback) {
  const btnDiv = document.createElement("div");
  btnDiv.classList.add("chat-action");

  const btn = document.createElement("button");
  btn.classList.add("chat-btn");
  btn.textContent = text;
  btn.addEventListener("click", callback);

  btnDiv.appendChild(btn);
  chatContainer.appendChild(btnDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
