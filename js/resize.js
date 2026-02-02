// ===== TERMINAL RESIZE FUNCTIONALITY =====
const terminalElement = document.getElementById("terminal");
const resizeHandle = document.getElementById("terminal-resize-handle");
let isResizing = false;
let startY = 0;
let startHeight = 0;

// Load saved terminal height
const savedHeight = localStorage.getItem("terminalHeight");
if (savedHeight) {
  terminalElement.style.height = savedHeight + "px";
}

resizeHandle.addEventListener("mousedown", (e) => {
  isResizing = true;
  startY = e.clientY;
  startHeight = terminalElement.offsetHeight;
  document.body.style.cursor = "ns-resize";
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isResizing) return;

  const deltaY = startY - e.clientY;
  const newHeight = Math.max(
    120,
    Math.min(window.innerHeight * 0.6, startHeight + deltaY),
  );
  terminalElement.style.height = newHeight + "px";
});

document.addEventListener("mouseup", () => {
  if (isResizing) {
    isResizing = false;
    document.body.style.cursor = "";
    // Save terminal height
    localStorage.setItem("terminalHeight", terminalElement.offsetHeight);
  }
});
