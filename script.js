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
        children: {
          project1: { type: "dir", page: "project1-page", children: {} },
          project2: { type: "dir", page: "project2-page", children: {} },
          project3: { type: "dir", page: "project3-page", children: {} },
        },
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

function navigateTo(path) {
  // Show the page
  document
    .querySelectorAll(".page")
    .forEach((page) => page.classList.remove("active"));
  const targetPage = document.getElementById(path);
  if (targetPage) {
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

// Helper function for project navigation (called from HTML buttons)
function navigateToProject(projectName) {
  terminal.input.value = `cd ${projectName}`;
  handleCommand(`cd ${projectName}`);
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
    terminal.print(
      '  <span class="folder">help</span>         - Show this help message',
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

  // Execute command
  if (commands[cmd]) {
    commands[cmd](args);
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
