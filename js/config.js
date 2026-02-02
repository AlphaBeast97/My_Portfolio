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
