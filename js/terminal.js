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
