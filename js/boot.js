// ===== BOOT SEQUENCE =====
window.addEventListener("DOMContentLoaded", () => {
  const hasBooted = sessionStorage.getItem("hasBooted");
  const bootScreen = document.getElementById("boot-screen");

  if (!hasBooted) {
    // Show welcome message in terminal
    showWelcomeBanner();

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

// ===== WELCOME BANNER =====
function showWelcomeBanner() {
  const banner = `
<span style="color: #00ff00; font-weight: bold; font-size: 1.2em;">════════════════════════════════════════════════════</span>

<span style="color: #ffff00; font-weight: bold;">  Welcome to Muhammad Saad Khan's Portfolio</span>

<span style="color: #00ff00; font-weight: bold; font-size: 1.2em;">════════════════════════════════════════════════════</span>

  <span style="color: #61afef;">→</span> Type <span style="color: #98c379;">'help'</span> to see available commands
  <span style="color: #61afef;">→</span> Type <span style="color: #98c379;">'ls'</span> to explore sections
  <span style="color: #61afef;">→</span> Type <span style="color: #98c379;">'cd &lt;section&gt;'</span> to navigate

<span style="color: #00ff00; font-weight: bold; font-size: 1.2em;">════════════════════════════════════════════════════</span>
  `;
  terminal.output.innerHTML = banner;
}
