// ===== PAGE LOADER =====
// Dynamically loads page content from separate HTML files

const pageMap = {
  "home-page": "pages/home.html",
  "about-page": "pages/about.html",
  "experience-page": "pages/experience.html",
  "certifications-page": "pages/certifications.html",
  "projects-page": "pages/projects.html",
  "contact-page": "pages/contact.html",
};

// Cache for loaded pages
const pageCache = {};

// Load a page dynamically
async function loadPage(pageId) {
  // Return from cache if already loaded
  if (pageCache[pageId]) {
    return pageCache[pageId];
  }

  const pageFile = pageMap[pageId];
  if (!pageFile) {
    console.error(`Page ${pageId} not found in pageMap`);
    return null;
  }

  try {
    const response = await fetch(pageFile);
    if (!response.ok) {
      throw new Error(`Failed to load ${pageFile}: ${response.statusText}`);
    }
    const html = await response.text();
    pageCache[pageId] = html;
    return html;
  } catch (error) {
    console.error(`Error loading page ${pageId}:`, error);
    return null;
  }
}

// Initialize and load the home page on page load
async function initializePages() {
  const contentArea = document.getElementById("content-area");
  const homeHtml = await loadPage("home-page");
  if (homeHtml) {
    contentArea.innerHTML = homeHtml;
  }
}

// Call initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePages);
} else {
  initializePages();
}

// Export for use in script.js
window.loadPage = loadPage;
