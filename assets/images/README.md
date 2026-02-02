# Certificate Images

## How to Add a New Certificate

### Step 1: Add the Image

- Save your certificate image as `2.jpg` (or `2.png`)
- Place it in this folder (`assets/images/`)
- Next certificate will be `3.jpg`, then `4.jpg`, etc.

### Step 2: Update the Code

Open `script.js` and find the `certificates` array (around line 7).

Add a new object:

```javascript
const certificates = [
  {
    id: 1,
    imageId: "1",
    title: "Full-Stack Development Internship",
    issuer: "Remote Internship Certificate",
    date: "2024-2025 (1 Month)",
    description: "Completed remote full-stack development internship...",
    status: "certified",
    icon: "💼",
  },
  // ADD NEW CERTIFICATE HERE:
  {
    id: 2,
    imageId: "2", // ← Matches the filename (2.jpg or 2.png)
    title: "Your New Certificate Title",
    issuer: "Issuing Organization",
    date: "Month Year",
    description: "Brief description of what you achieved",
    status: "certified", // Options: "certified", "in-progress", "planned"
    icon: "🎖️", // Any emoji icon
  },
];
```

### Status Options:

- `"certified"` - Green checkmark (✓ Certified)
- `"in-progress"` - Yellow spinner (⟳ In Progress)
- `"planned"` - Gray clock (⧗ Planned)

### Icon Ideas:

- 🎖️ Medal
- 🏆 Trophy
- 📜 Scroll
- ⭐ Star
- 🥇 Gold Medal
- 💼 Briefcase
- 🎓 Graduation Cap

That's it! The certificate will automatically appear on your portfolio.

## Current Certificates:

- `1.jpg` or `1.png` - Full-Stack Development Internship
