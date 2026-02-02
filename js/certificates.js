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
