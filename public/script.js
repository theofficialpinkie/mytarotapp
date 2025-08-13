console.log("🎯 Script.js loaded!");

document.addEventListener('DOMContentLoaded', function() {
  console.log("🎯 DOM Content Loaded");
  
  const chatContainer = document.getElementById("chatContainer");
  const inputContainer = document.getElementById("inputContainer");
  const questionInput = document.getElementById("question");
  const sendQuestionBtn = document.getElementById("sendQuestionBtn");
  const startReadingBtn = document.getElementById("startReadingBtn");

  console.log("Elements found:", {
    chatContainer: !!chatContainer,
    inputContainer: !!inputContainer,
    questionInput: !!questionInput,
    sendQuestionBtn: !!sendQuestionBtn,
    startReadingBtn: !!startReadingBtn
  });

  if (!startReadingBtn) {
    console.error("❌ Start reading button not found!");
    return;
  }

  let spreadCards = [];
  let selectedCards = [];
  let currentQuestion = "";
  let isProcessing = false; // 🎯 ADD: Prevent double processing

  // STEP 1: Generate Reading Button Click
  startReadingBtn.addEventListener("click", () => {
    console.log("🎯 Start reading button clicked!");
    addMessage("Erika Owl", "Great! Please type your question below.", "erika");
    if (questionInput) {
      questionInput.classList.add("active");
      questionInput.focus(); // Focus the input
    }
    if (sendQuestionBtn) {
      sendQuestionBtn.disabled = false;
    }
  });

  // STEP 2: Send Question - also handle Enter key
  if (questionInput) {
    questionInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !sendQuestionBtn.disabled) {
        sendQuestion();
      }
    });
  }

  if (sendQuestionBtn) {
    sendQuestionBtn.addEventListener("click", sendQuestion);
  }

  function sendQuestion() {
    if (isProcessing) {
      console.log("❌ Already processing, ignoring click");
      return;
    }

    console.log("🎯 Send question triggered!");
    const question = questionInput.value.trim();
    if (!question) {
      console.log("❌ No question entered");
      return;
    }

    isProcessing = true;
    currentQuestion = question;
    console.log("🎯 Question stored:", currentQuestion);

    addMessage("You", question, "user");
    questionInput.value = "";
    sendQuestionBtn.disabled = true;

    addMessage("Erika Owl", "Ok, deep breath, set an intention...", "erika");
    addButtonBelow("Shuffle Cards", shuffleCards);
    
    setTimeout(() => { isProcessing = false; }, 1000); // Reset processing flag
  }

  // STEP 3: Shuffle Cards
  async function shuffleCards() {
    if (isProcessing) {
      console.log("❌ Already processing shuffle");
      return;
    }

    console.log("🎯 Shuffling cards...");
    isProcessing = true;

    addMessage("Erika Owl", "Shuffling your cards…", "erika");

    try {
      console.log("🎯 Fetching spread from API...");
      const res = await fetch("/api/spread");
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("🎯 Spread received:", data);
      
      spreadCards = data.spread;
      selectedCards = [];

      showCardBacks(spreadCards);
    } catch (error) {
      console.error("❌ Error shuffling cards:", error);
      addMessage("Erika Owl", "Sorry, there was an error shuffling the cards. Please try again.", "erika");
    } finally {
      isProcessing = false;
    }
  }

  // STEP 4: Show Card Backs
  function showCardBacks(spread) {
    console.log("🎯 Showing card backs for", spread.length, "cards");
    
    if (!chatContainer) {
      console.error("❌ Chat container not found!");
      return;
    }
    
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-row");

    spread.forEach((card, index) => {
      const img = document.createElement("img");
      img.src = "/assets/backs/card-back.webp";
      img.classList.add("chat-card");
      img.alt = `Card ${index + 1}`;
      img.dataset.cardId = card.id; // 🎯 ADD: Store card ID

      img.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        console.log("🎯 Card clicked:", card.name, "ID:", card.id);
        console.log("🎯 Current selected cards:", selectedCards.length);
        
        // Check if already selected by comparing IDs
        const alreadySelected = selectedCards.some(selected => selected.id === card.id);
        
        if (selectedCards.length >= 6) {
          console.log("❌ Maximum 6 cards already selected");
          return;
        }
        
        if (alreadySelected) {
          console.log("❌ Card already selected");
          return;
        }
        
        selectedCards.push(card);
        console.log("🎯 Selected cards count:", selectedCards.length);
        console.log("🎯 Selected card names:", selectedCards.map(c => c.name));

        // Visual feedback
        img.src = card.image;
        img.classList.add("flipped");
        img.style.opacity = "0.7"; // Show it's selected

        if (selectedCards.length === 6) {
          console.log("🎯 All 6 cards selected, showing generate reading button");
          // Small delay to prevent double-clicks
          setTimeout(() => {
            addButtonBelow("Generate Reading", generateReading);
          }, 500);
        }
      });

      // Handle image load errors
      img.addEventListener('error', () => {
        console.warn("⚠️ Image failed to load:", img.src);
        // Use a simple data URL as fallback
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='130' viewBox='0 0 80 130'%3E%3Crect width='80' height='130' fill='%23333' stroke='%23gold' stroke-width='2'/%3E%3Ctext x='40' y='65' text-anchor='middle' fill='%23gold' font-family='Arial' font-size='10'%3ETarot%3C/text%3E%3C/svg%3E";
      });

      cardDiv.appendChild(img);
    });

    chatContainer.appendChild(cardDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // STEP 5: Generate Reading
  async function generateReading() {
    if (isProcessing) {
      console.log("❌ Already generating reading");
      return;
    }

    console.log("🎯 Generating reading...");
    console.log("🎯 Using question:", currentQuestion);
    console.log("🎯 Selected cards:", selectedCards.map(c => `${c.name} (${c.orientation})`));
    
    if (selectedCards.length !== 6) {
      console.error("❌ Expected 6 cards, got:", selectedCards.length);
      addMessage("Erika Owl", "Please select exactly 6 cards first.", "erika");
      return;
    }

    isProcessing = true;
    addMessage("Erika Owl", "Wait a second, I'm generating your reading…", "erika");

    try {
      const readingRequest = {
        question: currentQuestion || "General guidance",
        selectedIds: selectedCards.map(c => c.id)
      };
      
      console.log("🎯 Sending reading request:", readingRequest);
      
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(readingRequest)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("🎯 Reading received:", data);
      
      addMessage("Erika Owl", data.answer, "erika");
    } catch (error) {
      console.error("❌ Error generating reading:", error);
      addMessage("Erika Owl", "Sorry, there was an error generating your reading. Please try again.", "erika");
    } finally {
      isProcessing = false;
    }
  }

  // Utility: Add Message to Chat
  function addMessage(sender, text, type) {
    console.log("🎯 Adding message:", { sender, type, text: text.substring(0, 50) + "..." });
    
    if (!chatContainer) {
      console.error("❌ Chat container not found!");
      return;
    }
    
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message", type);

    if (type === "erika") {
      msgDiv.innerHTML = `
        <img src="/assets/erika-avatar.png" class="avatar" alt="Erika Avatar">
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
    console.log("🎯 Adding button:", text);
    
    if (!chatContainer) {
      console.error("❌ Chat container not found!");
      return;
    }
    
    const btnDiv = document.createElement("div");
    btnDiv.classList.add("chat-action");

    const btn = document.createElement("button");
    btn.classList.add("chat-btn");
    btn.textContent = text;
    
    // 🎯 ADD: Prevent double-clicks
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (btn.disabled) return;
      btn.disabled = true;
      btn.textContent = "Processing...";
      
      callback();
      
      // Re-enable after delay
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = text;
      }, 2000);
    });

    btnDiv.appendChild(btn);
    chatContainer.appendChild(btnDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
});

console.log("🎯 Script.js finished loading!");