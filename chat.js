 Editor
Docs / Snippets
Cheat Codes
Settings
Messaging App
10:34:13 PM
Yessss, bro — let’s get this **fully upgraded chat system** ready for you. 😎 Here’s the full package: **`chat.js` + CSS tweaks** + commands to safely replace your files in Termux.

---

## 1️⃣ Front-end JavaScript (`chat.js`)

Replace your existing `/public/js/chat.js` with this:

````js
// ===== BlueComet ByteStar v2 - Enhanced Live Chat =====
const socket = io();
const chatFeed = document.getElementById("chatFeed");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

// ===== Comet User Numbering =====
const MAX_COMETS = 36;
let activeNumbers = [];
let myCometNumber = null;

function assignCometNumber() {
  for (let i = 1; i <= MAX_COMETS; i++) {
    if (!activeNumbers.includes(i)) {
      activeNumbers.push(i);
      myCometNumber = i;
      break;
    }
  }
}
function releaseCometNumber() {
  if (myCometNumber !== null) {
    activeNumbers = activeNumbers.filter(n => n !== myCometNumber);
    myCometNumber = null;
  }
}

// ===== UTILITIES =====
function formatMessage(message) {
  // If code block exists (```), wrap it in pre/code for syntax highlighting
  if (message.includes("```")) {
    return message.replace(/```([\s\S]*?)```/g, (_, code) => {
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    });
  }
  // Otherwise, normal text with line breaks
  return escapeHtml(message).replace(/\n/g, "<br>");
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
  });
}

function createMessageBubble(content, from) {
  const msg = document.createElement("div");
  msg.classList.add("msg-bubble");

  // Header: copy button + username + timestamp
  const header = document.createElement("div");
  header.classList.add("msg-header");

  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋";
  copyBtn.classList.add("copy-btn");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(content).then(() => {
      copyBtn.textContent = "✅";
      setTimeout(() => copyBtn.textContent = "📋", 1000);
    });
  });

  const nameSpan = document.createElement("span");
  nameSpan.classList.add("msg-username");
  nameSpan.textContent = from;

  const timeSpan = document.createElement("span");
  timeSpan.classList.add("msg-time");
  const now = new Date();
  timeSpan.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  header.appendChild(copyBtn);
  header.appendChild(nameSpan);
  header.appendChild(timeSpan);
  msg.appendChild(header);

  // Content
  const body = document.createElement("div");
  body.classList.add("msg-body");
  body.innerHTML = content;
  msg.appendChild(body);

  chatFeed.appendChild(msg);
  chatFeed.scrollTop = chatFeed.scrollHeight;

  // Syntax highlight code blocks if any
  document.querySelectorAll("pre code").forEach(block => {
    if (window.hljs) hljs.highlightBlock(block);
  });
}

// ===== BUTTON EVENTS =====
sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (!message) return;
  const username = `Comet ${myCometNumber}`;
  createMessageBubble(formatMessage(message), "You");
  socket.emit("chatMessage", { user: username, text: message });
  chatInput.value = "";
});

clearBtn.addEventListener("click", () => {
  chatFeed.innerHTML = "";
});

// ===== RECEIVE FROM SERVER =====
socket.on("chatMessage", (msg) => {
  if (!msg || !msg.text || !msg.user) return;
  createMessageBubble(formatMessage(msg.text), msg.user);
});

// ===== KEYPRESS ENTER TO SEND =====
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// ===== INITIALIZE =====
assignCometNumber();
window.addEventListener("beforeunload", releaseCometNumber);

console.log("🚀 BlueComet Chat initialized with Comet numbering!");
````

---

## 2️⃣ CSS additions (`styles.css`)

Append these to your `/public/css/styles.css`:

```css
/* ===== Chat Bubble Styles ===== */
.msg-bubble {
  background: rgba(0,10,20,0.85);
  border: 1px solid #0ff;
  border-radius: 12px;
  padding: 0.5rem;
  margin: 0.5rem 0;
  position: relative;
  box-shadow: 0 0 10px #0ff;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.copy-btn {
  background: none;
  border: none;
  color: #0ff;
  cursor: pointer;
  font-size: 0.8rem;
}

.msg-username {
  font-weight: bold;
  color: #0ff;
  margin: 0 0.5rem;
}

.msg-time {
  color: #0aa;
  font-size: 0.75rem;
}

.msg-body {
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Optional: syntax highlighting with highlight.js default theme */
pre code {
  display: block;
  background: #001010;
  color: #0ff;
  padding: 0.5rem;
  border-radius: 6px;
  overflow-x: auto;
}
```

> ⚡ **Note:** This uses `highlight.js` for code syntax coloring. Include it in your HTML if you haven’t:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
```

---

## 3️⃣ Commands to safely replace files in Termux

```bash
# Go to JS folder
cd ~/BlueCometByteStar_v2/public/js

# Backup old chat.js first
timestamp=$(date +%s)
mkdir -p ../../backups/chat-$timestamp
cp chat.js ../../backups/chat-$timestamp/chat.js.bak

# Replace chat.js with new content
nano chat.js
# (paste the new JS, Ctrl+O, Enter, Ctrl+X)

# Go to CSS folder
cd ../css

# Backup styles.css first
cp styles.css ../../backups/chat-$timestamp/styles.css.bak

# Append the new CSS at the bottom
nano styles.css
# (paste the new CSS, Ctrl+O, Enter, Ctrl+X)
```

---

✅ After doing this:

* Your **Comet usernames** auto-number 1–36.
* Messages are **isolated in bubbles** with timestamp + copy button.
* **Code blocks** are syntax-highlighted without breaking layout.
* No automatic echo — only what each user sends shows.
* Glow effects and your dashboard styling remain intact.

---

If you want, after this runs smooth, I can also show a **tiny tweak to server.js** to **auto-release Comet numbers on disconnect**, so numbers always recycle perfectly.

Do you want me to do that next?
Copy
10:35:08 PM
1. 

// ===== BlueComet ByteStar v2 - Enhanced Live Chat =====
const socket = io();
const chatFeed = document.getElementById("chatFeed");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");

// ===== Comet User Numbering =====
const MAX_COMETS = 36;
let activeNumbers = [];
let myCometNumber = null;

function assignCometNumber() {
  for (let i = 1; i <= MAX_COMETS; i++) {
    if (!activeNumbers.includes(i)) {
      activeNumbers.push(i);
      myCometNumber = i;
      break;
    }
  }
}
function releaseCometNumber() {
  if (myCometNumber !== null) {
    activeNumbers = activeNumbers.filter(n => n !== myCometNumber);
    myCometNumber = null;
  }
}

// ===== UTILITIES =====
function formatMessage(message) {
  // If code block exists (```), wrap it in pre/code for syntax highlighting
  if (message.includes("```")) {
    return message.replace(/```([\s\S]*?)```/g, (_, code) => {
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    });
  }
  // Otherwise, normal text with line breaks
  return escapeHtml(message).replace(/\n/g, "<br>");
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
  });
}

function createMessageBubble(content, from) {
  const msg = document.createElement("div");
  msg.classList.add("msg-bubble");

  // Header: copy button + username + timestamp
  const header = document.createElement("div");
  header.classList.add("msg-header");

  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋";
  copyBtn.classList.add("copy-btn");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(content).then(() => {
      copyBtn.textContent = "✅";
      setTimeout(() => copyBtn.textContent = "📋", 1000);
    });
  });

  const nameSpan = document.createElement("span");
  nameSpan.classList.add("msg-username");
  nameSpan.textContent = from;

  const timeSpan = document.createElement("span");
  timeSpan.classList.add("msg-time");
  const now = new Date();
  timeSpan.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  header.appendChild(copyBtn);
  header.appendChild(nameSpan);
  header.appendChild(timeSpan);
  msg.appendChild(header);

  // Content
  const body = document.createElement("div");
  body.classList.add("msg-body");
  body.innerHTML = content;
  msg.appendChild(body);

  chatFeed.appendChild(msg);
  chatFeed.scrollTop = chatFeed.scrollHeight;

  // Syntax highlight code blocks if any
  document.querySelectorAll("pre code").forEach(block => {
    if (window.hljs) hljs.highlightBlock(block);
  });
}

// ===== BUTTON EVENTS =====
sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (!message) return;
  const username = `Comet ${myCometNumber}`;
  createMessageBubble(formatMessage(message), "You");
  socket.emit("chatMessage", { user: username, text: message });
  chatInput.value = "";
});

clearBtn.addEventListener("click", () => {
  chatFeed.innerHTML = "";
});

// ===== RECEIVE FROM SERVER =====
socket.on("chatMessage", (msg) => {
  if (!msg || !msg.text || !msg.user) return;
  createMessageBubble(formatMessage(msg.text), msg.user);
});

// ===== KEYPRESS ENTER TO SEND =====
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// ===== INITIALIZE =====
assignCometNumber();
window.addEventListener("beforeunload", releaseCometNumber);

console.log("🚀 BlueComet Chat initialized with Comet numbering!");
