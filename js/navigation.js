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
