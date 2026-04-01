// ===== BlueComet ByteStar v2 - Live Chat Logic =====
const socket = io();

const chatFeed = document.getElementById("chatFeed");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

// ===== UTILITIES =====
function formatMessage(message) {
  // Check if message includes code markers (``` or <code>)
  if (message.includes("```")) {
    const codeBlock = message.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
    return codeBlock;
  }
  return message.replace(/\n/g, "<br>");
}

function appendMessage(content, from = "User") {
  const msg = document.createElement("div");
  msg.classList.add("msg");
  msg.innerHTML = `<strong>${from}:</strong> ${formatMessage(content)}`;
  chatFeed.appendChild(msg);

  // Auto-scroll
  chatFeed.scrollTop = chatFeed.scrollHeight;

  // Highlight any code
  document.querySelectorAll("pre code").forEach(block => hljs.highlightElement(block));
}

// ===== BUTTON EVENTS =====
sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage(message, "You");
  socket.emit("chatMessage", message);
  chatInput.value = "";
});

clearBtn.addEventListener("click", () => {
  chatFeed.innerHTML = "";
});

// ===== RECEIVE FROM SERVER =====
socket.on("chatMessage", (msg) => {
  appendMessage(msg, "Comet");
});

// ===== KEYPRESS ENTER TO SEND =====
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

console.log("🚀 BlueComet Chat initialized!");
