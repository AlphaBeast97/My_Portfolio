// ===== EVENT LISTENERS & INITIALIZATION =====

// Keyboard shortcuts
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

// Page load initialization
window.addEventListener("DOMContentLoaded", () => {
  // Load certificates dynamically
  loadCertificates();

  // Focus terminal
  terminal.input.focus();
});
