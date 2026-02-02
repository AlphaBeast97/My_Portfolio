// ===== BOOT SEQUENCE =====
window.addEventListener("DOMContentLoaded", () => {
  const hasBooted = sessionStorage.getItem("hasBooted");
  const bootScreen = document.getElementById("boot-screen");

  if (!hasBooted) {
    // Show boot sequence for 3.5 seconds
    setTimeout(() => {
      bootScreen.classList.add("hidden");
      sessionStorage.setItem("hasBooted", "true");
      // Focus terminal after boot
      setTimeout(() => {
        terminal.input.focus();
      }, 500);
    }, 3500);
  } else {
    // Skip boot if already booted this session
    bootScreen.classList.add("hidden");
  }
});

// ===== STATE MANAGEMENT =====
let currentPath = ["~"];
let commandHistory = [];
let historyIndex = -1;

// ===== CERTIFICATES DATA =====
// To add a new certificate:
// 1. Add image to assets/images/ folder (name it 2.jpg, 3.jpg, etc.)
// 2. Add new object to this array with imageId matching the filename
const certificates = [
  {
    id: 1,
    imageId: "1", // Will load assets/images/1.jpg (or .png)
    title: "Full-Stack Development Internship",
    issuer: "Remote Internship Certificate",
    date: "2024-2025 (1 Month)",
    description:
      "Completed remote full-stack development internship with hands-on experience in modern web technologies",
    status: "certified",
    icon: "💼",
  },
  {
    id: 2,
    imageId: null, // No image for in-progress items
    title: "BS-Information Engineering Technology",
    issuer: "University of Lahore",
    date: "In Progress (4th Semester)",
    description:
      "Focus on modern web technologies, software engineering, and system design",
    status: "in-progress",
    icon: "🎓",
  },
  // Add more certificates here following the same format
];

// ===== FILESYSTEM STRUCTURE =====
const fileSystem = {
  "~": {
    type: "dir",
    page: "home-page",
    children: {
      about: { type: "dir", page: "about-page", children: {} },
      experience: { type: "dir", page: "experience-page", children: {} },
      certifications: {
        type: "dir",
        page: "certifications-page",
        children: {},
      },
      projects: {
        type: "dir",
        page: "projects-page",
        children: {},
      },
      contact: { type: "dir", page: "contact-page", children: {} },
    },
  },
};

// ===== TERMINAL FUNCTIONS =====
const terminal = {
  output: document.getElementById("terminal-output"),
  input: document.getElementById("terminal-input"),
  prompt: document.getElementById("prompt"),

  print(message, className = "") {
    const line = document.createElement("div");
    line.className = `terminal-line ${className}`;
    line.innerHTML = message;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  },

  clear() {
    this.output.innerHTML = "";
  },

  updatePrompt() {
    const path = currentPath.join("/").replace("~", "~");
    this.prompt.textContent = `saad@portfolio:${path}$`;
  },
};

// ===== NAVIGATION FUNCTIONS =====
function getCurrentDir() {
  let current = fileSystem;
  for (let dir of currentPath) {
    current = current[dir];
  }
  return current;
}

async function navigateTo(path) {
  // Check if page exists in DOM
  let targetPage = document.getElementById(path);

  if (!targetPage) {
    // Try to load page dynamically
    const pageHtml = await window.loadPage(path);
    if (pageHtml) {
      const contentArea = document.getElementById("content-area");
      contentArea.insertAdjacentHTML("beforeend", pageHtml);
      targetPage = document.getElementById(path);

      // Load certificates if on certifications page
      if (path === "certifications-page") {
        setTimeout(loadCertificates, 100);
      }
    }
  }

  if (targetPage) {
    // Hide all pages
    document
      .querySelectorAll(".page")
      .forEach((page) => page.classList.remove("active"));

    // Show target page
    targetPage.classList.add("active");

    // Auto-scroll to top of content area
    const contentArea = document.getElementById("content-area");
    contentArea.scrollTo({ top: 0, behavior: "smooth" });

    // Visual feedback - flash the content area
    contentArea.classList.add("page-transition");
    setTimeout(() => {
      contentArea.classList.remove("page-transition");
    }, 500);

    // Print confirmation in terminal
    terminal.print(`→ Loaded: ${path.replace("-page", "")}`, "success");
  }
}

function changePage(pageName) {
  navigateTo(pageName);
}

// ===== CERTIFICATES LOADING =====
function loadCertificates() {
  const container = document.getElementById("certificates-container");
  if (!container) return;

  certificates.forEach((cert) => {
    const certCard = document.createElement("div");
    certCard.className = "cert-card";

    // Status badge styling
    let statusHTML = "";
    let statusStyle = "";
    if (cert.status === "certified") {
      statusHTML = "✓ Certified";
      statusStyle =
        "color: var(--text-green); margin-top: 1rem; font-weight: bold;";
    } else if (cert.status === "in-progress") {
      statusHTML = "⟳ In Progress";
      statusStyle =
        "color: var(--text-yellow); margin-top: 1rem; font-weight: bold;";
    } else if (cert.status === "planned") {
      statusHTML = "⧗ Planned";
      statusStyle = "color: #888; margin-top: 1rem; font-weight: bold;";
      certCard.style.opacity = "0.6";
    }

    certCard.innerHTML = `
      <div class="cert-icon">${cert.icon}</div>
      <h3>${cert.title}</h3>
      <p class="cert-issuer">${cert.issuer}</p>
      <p class="cert-date">${cert.date}</p>
      <p class="cert-desc">${cert.description}</p>
      ${
        cert.imageId
          ? `
        <div class="cert-image-preview" style="margin-top: 1rem;">
          <img src="assets/images/${cert.imageId}.jpg" 
               alt="${cert.title}" 
               style="width: 100%; max-width: 300px; border: 2px solid var(--text-green); cursor: pointer;"
               onclick="viewCertificate('${cert.imageId}')"
               onerror="this.onerror=null; this.src='assets/images/${cert.imageId}.png';">
          <p style="font-size: 0.85rem; color: #888; margin-top: 0.5rem;">Click to view full size</p>
        </div>
      `
          : ""
      }
      <p style="${statusStyle}">${statusHTML}</p>
    `;

    container.appendChild(certCard);
  });
}

// View certificate in modal/new tab
function viewCertificate(imageId) {
  // Try jpg first, fallback to png
  const imgJpg = `assets/images/${imageId}.jpg`;
  const imgPng = `assets/images/${imageId}.png`;

  // Open in new tab
  const img = new Image();
  img.onload = () => window.open(imgJpg, "_blank");
  img.onerror = () => window.open(imgPng, "_blank");
  img.src = imgJpg;
}

// ===== COMMANDS =====
const commands = {
  help() {
    terminal.print("Available commands:", "info");
    terminal.print("");
    terminal.print("<span class='success'>Navigation:</span>");
    terminal.print(
      '  <span class="folder">ls</span>           - List available pages/sections',
    );
    terminal.print(
      '  <span class="folder">cd</span> &lt;page&gt;   - Navigate to a page',
    );
    terminal.print(
      '  <span class="folder">cd ..</span>        - Go back to previous page',
    );
    terminal.print(
      '  <span class="folder">pwd</span>          - Show current location',
    );
    terminal.print(
      '  <span class="folder">clear</span>        - Clear terminal output',
    );
    terminal.print("");
    terminal.print("<span class='success'>Easter Eggs (API Powered):</span>");
    terminal.print(
      '  <span class="folder">weather</span>      - Current weather in Lahore',
    );
    terminal.print(
      '  <span class="folder">joke</span>         - Random programming joke',
    );
    terminal.print(
      '  <span class="folder">fact</span>         - Random interesting fact',
    );
    terminal.print(
      '  <span class="folder">crypto</span>       - Bitcoin & Ethereum prices',
    );
    terminal.print(
      '  <span class="folder">github</span>       - My GitHub statistics',
    );
    terminal.print("");
    terminal.print(
      'Try: <span class="success">ls</span> to see available sections',
      "info",
    );
  },

  ls() {
    const current = getCurrentDir();
    if (!current || !current.children) {
      terminal.print("No items found", "error");
      return;
    }

    const items = Object.keys(current.children);
    if (items.length === 0) {
      terminal.print("Empty directory", "warning");
      return;
    }

    terminal.print("");
    items.forEach((item) => {
      const child = current.children[item];
      if (child.type === "dir") {
        terminal.print(`  <span class="folder">${item}</span>`);
      } else {
        terminal.print(`  <span class="file">${item}</span>`);
      }
    });
    terminal.print("");
  },

  cd(args) {
    if (!args || args.length === 0) {
      terminal.print("cd: missing argument", "error");
      terminal.print("Usage: cd &lt;directory&gt; or cd ..", "info");
      return;
    }

    const target = args[0];

    // Handle going back
    if (target === "..") {
      if (currentPath.length > 1) {
        currentPath.pop();
        const current = getCurrentDir();
        if (current.page) {
          changePage(current.page);
        }
        terminal.updatePrompt();
      } else {
        terminal.print("Already at root directory", "warning");
      }
      return;
    }

    // Handle going to root
    if (target === "~" || target === "/") {
      currentPath = ["~"];
      changePage("home-page");
      terminal.updatePrompt();
      return;
    }

    // Handle normal navigation
    const current = getCurrentDir();
    if (current.children && current.children[target]) {
      currentPath.push(target);
      const targetDir = current.children[target];
      if (targetDir.page) {
        changePage(targetDir.page);
      }
      terminal.updatePrompt();
    } else {
      terminal.print(`cd: ${target}: No such directory`, "error");
      terminal.print(
        'Type <span class="success">ls</span> to see available directories',
        "info",
      );
    }
  },

  pwd() {
    const path = currentPath.join("/").replace("~", "~");
    terminal.print(path, "info");
  },

  clear() {
    terminal.clear();
  },

  // Easter egg commands
  whoami() {
    terminal.print("saad - Web Developer & Terminal Enthusiast", "info");
  },

  date() {
    terminal.print(new Date().toString(), "info");
  },

  echo(args) {
    terminal.print(args.join(" "));
  },

  // API Easter Eggs
  async weather() {
    terminal.print("Fetching weather for Lahore...", "info");
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=31.5204&longitude=74.3587&current_weather=true",
      );
      const data = await response.json();
      const weather = data.current_weather;
      terminal.print("");
      terminal.print(`<span class="success">🌤️  Weather in Lahore</span>`);
      terminal.print(`   Temperature: ${weather.temperature}°C`);
      terminal.print(`   Wind Speed: ${weather.windspeed} km/h`);
      terminal.print(`   Time: ${new Date(weather.time).toLocaleString()}`);
      terminal.print("");
    } catch (error) {
      terminal.print("Failed to fetch weather data", "error");
    }
  },

  async joke() {
    terminal.print("Loading programming joke...", "info");
    try {
      const response = await fetch(
        "https://official-joke-api.appspot.com/jokes/programming/random",
      );
      const data = await response.json();
      const joke = data[0];
      terminal.print("");
      terminal.print(`<span class="success">😄 ${joke.setup}</span>`);
      setTimeout(() => {
        terminal.print(`   ${joke.punchline}`, "info");
        terminal.print("");
      }, 1000);
    } catch (error) {
      terminal.print("Failed to fetch joke", "error");
    }
  },

  async fact() {
    terminal.print("Loading random fact...", "info");
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/random.json?language=en",
      );
      const data = await response.json();
      terminal.print("");
      terminal.print(`<span class="success">💡 ${data.text}</span>`);
      terminal.print("");
    } catch (error) {
      terminal.print("Failed to fetch fact", "error");
    }
  },

  async crypto() {
    terminal.print("Fetching crypto prices...", "info");
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
      );
      const data = await response.json();
      terminal.print("");
      terminal.print(`<span class="success">💰 Cryptocurrency Prices</span>`);
      terminal.print(`   Bitcoin: $${data.bitcoin.usd.toLocaleString()}`);
      terminal.print(`   Ethereum: $${data.ethereum.usd.toLocaleString()}`);
      terminal.print("");
    } catch (error) {
      terminal.print("Failed to fetch crypto prices", "error");
    }
  },

  async github() {
    terminal.print("Fetching GitHub stats...", "info");
    try {
      const response = await fetch("https://api.github.com/users/AlphaBeast97");
      const data = await response.json();
      terminal.print("");
      terminal.print(
        `<span class="success">🐙 GitHub Stats - @${data.login}</span>`,
      );
      terminal.print(`   Name: ${data.name}`);
      terminal.print(`   Public Repos: ${data.public_repos}`);
      terminal.print(`   Followers: ${data.followers}`);
      terminal.print(`   Following: ${data.following}`);
      terminal.print(`   Bio: ${data.bio || "No bio"}`);
      terminal.print("");
    } catch (error) {
      terminal.print("Failed to fetch GitHub stats", "error");
    }
  },
};

// ===== COMMAND HANDLER =====
function handleCommand(input) {
  input = input.trim();

  if (!input) return;

  // Add to history
  commandHistory.push(input);
  historyIndex = commandHistory.length;

  // Echo command
  terminal.print(
    `<span style="color: #61afef;">saad@portfolio:${currentPath.join("/")}$</span> ${input}`,
  );

  // Parse command
  const parts = input.split(" ");
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Execute command (support async)
  if (commands[cmd]) {
    const result = commands[cmd](args);
    // Handle async commands
    if (result instanceof Promise) {
      result.catch((err) => {
        terminal.print(`Command error: ${err.message}`, "error");
      });
    }
  } else {
    terminal.print(`Command not found: ${cmd}`, "error");
    terminal.print(
      'Type <span class="success">help</span> for available commands',
      "info",
    );
  }
}

// ===== EVENT LISTENERS =====
terminal.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const input = terminal.input.value;
    handleCommand(input);
    terminal.input.value = "";
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminal.input.value = commandHistory[historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      terminal.input.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      terminal.input.value = "";
    }
  } else if (e.key === "Tab") {
    e.preventDefault();
    // Simple autocomplete
    const input = terminal.input.value;
    const current = getCurrentDir();
    if (current.children) {
      const matches = Object.keys(current.children).filter((item) =>
        item.startsWith(input),
      );
      if (matches.length === 1) {
        terminal.input.value = matches[0];
      } else if (matches.length > 1) {
        terminal.print("");
        matches.forEach((match) => {
          terminal.print(`  <span class="folder">${match}</span>`);
        });
        terminal.print("");
      }
    }
  }
});

// Keep terminal input focused
document.addEventListener("click", (e) => {
  if (!e.target.closest("#terminal-input")) {
    terminal.input.focus();
  }
});

// ===== INITIALIZATION =====
window.addEventListener("DOMContentLoaded", () => {
  // Load certificates dynamically
  loadCertificates();

  terminal.print(
    "╔════════════════════════════════════════════════════╗",
    "success",
  );
  terminal.print(
    "║     Welcome to Saad's Terminal Portfolio          ║",
    "success",
  );
  terminal.print(
    "╚════════════════════════════════════════════════════╝",
    "success",
  );
  terminal.print("");
  terminal.print(
    'Type <span class="success">help</span> to see available commands',
    "info",
  );
  terminal.print(
    'Type <span class="success">ls</span> to see available sections',
    "info",
  );
  terminal.print("");

  terminal.input.focus();
});
