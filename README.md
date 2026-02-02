# 🖥️ Terminal Portfolio

A unique, terminal-based portfolio website that uses Linux filesystem navigation instead of traditional menus. Built with vanilla JavaScript, HTML5, and CSS3 - no frameworks required.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![No Frameworks](https://img.shields.io/badge/Frameworks-None-blue)

## ✨ Features

### Core Functionality

- 🔄 **Virtual Filesystem Navigation** - Navigate like a real terminal using `cd`, `ls`, `pwd`
- 💻 **Persistent Terminal** - Fixed at bottom, always accessible
- 📄 **Dynamic Page Loading** - Pages load on-demand with caching
- 🎨 **Boot Sequence** - Authentic terminal startup animation
- 🎯 **Command History** - Navigate previous commands with ↑/↓ arrows
- ⌨️ **Tab Autocomplete** - Smart directory name completion
- 📏 **Resizable Terminal** - Drag to adjust terminal height (saved in localStorage)

### API-Powered Easter Eggs

- 🌤️ `weather` - Real-time weather for Lahore
- 😄 `joke` - Random programming jokes
- 💡 `fact` - Interesting random facts
- 💰 `crypto` - Bitcoin & Ethereum prices
- 🐙 `github` - Live GitHub statistics

### Pages

- 🏠 **Home** - Landing page with glitch effect
- 👤 **About** - Bio and skills with progress bars
- 💼 **Experience** - Timeline with Nexium internship
- 📜 **Certifications** - Dynamic certificate loading
- 🚀 **Projects** - 5 real projects with GitHub links
- 📧 **Contact** - Email, LinkedIn, GitHub, Resume

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (Live Server, Python HTTP server, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AlphaBeast97/terminal-portfolio.git
   cd terminal-portfolio
   ```

2. **Serve the files**

   Using Live Server (VS Code):
   - Install Live Server extension
   - Right-click `index.html` → "Open with Live Server"

   Using Python:

   ```bash
   python -m http.server 8000
   ```

   Using Node.js:

   ```bash
   npx http-server
   ```

3. **Open in browser**
   ```
   http://localhost:5500  # Live Server
   http://localhost:8000  # Python
   ```

## 📖 Usage

### Navigation Commands

```bash
help          # Show all available commands
ls            # List available sections
cd <section>  # Navigate to a section (e.g., cd projects)
cd ..         # Go back to previous page
pwd           # Show current location
clear         # Clear terminal output
```

### API Commands

```bash
weather       # Current weather in Lahore
joke          # Random programming joke
fact          # Random interesting fact
crypto        # Bitcoin & Ethereum prices
github        # My GitHub statistics
```

### Example Session

```bash
saad@portfolio:~$ ls
about  experience  certifications  projects  contact

saad@portfolio:~$ cd projects
→ Loaded: projects

saad@portfolio:~/projects$ cd ..
→ Loaded: home
```

## 📁 Project Structure

```
terminal-portfolio/
├── index.html              # Main HTML shell (63 lines)
├── pageLoader.js           # Dynamic page loading with caching
│
├── css/                    # Modular stylesheets (7 files)
│   ├── base.css           # Variables, reset, body
│   ├── boot.css           # Boot screen animations
│   ├── layout.css         # Content area, page transitions
│   ├── pages.css          # About, skills, experience, certs, contact
│   ├── components.css     # Projects, buttons, reusable UI
│   ├── terminal.css       # Terminal styling
│   └── responsive.css     # Mobile breakpoints
│
├── js/                     # Modular JavaScript (8 files)
│   ├── config.js          # State, certificates, filesystem
│   ├── terminal.js        # Terminal I/O functions
│   ├── boot.js            # Boot sequence & welcome banner
│   ├── navigation.js      # Page routing logic
│   ├── certificates.js    # Certificate loading
│   ├── commands.js        # All command implementations
│   ├── resize.js          # Terminal resize functionality
│   └── init.js            # Event listeners & initialization
│
├── pages/                  # HTML page content (6 files)
│   ├── home.html
│   ├── about.html
│   ├── experience.html
│   ├── certifications.html
│   ├── projects.html
│   └── contact.html
│
├── assets/
│   ├── images/            # Certificate images
│   └── MSAADKHAN_RESUME.pdf
│
└── PROJECT-PLAN.md        # Development roadmap
```

## 🎨 Customization

### Adding a New Page

1. **Create HTML file** in `pages/`:

   ```html
   <!-- pages/blog.html -->
   <div id="blog-page" class="page">
     <div class="page-container">
       <h1>Blog</h1>
       <p>Your content here...</p>
     </div>
   </div>
   ```

2. **Update filesystem** in `js/config.js`:

   ```javascript
   const fileSystem = {
     "~": {
       children: {
         blog: { type: "dir", page: "blog-page", children: {} },
       },
     },
   };
   ```

3. **Add to pageLoader** in `pageLoader.js`:
   ```javascript
   const pageMap = {
     "blog-page": "pages/blog.html",
   };
   ```

### Adding a Certificate

1. **Add image** to `assets/images/` (e.g., `3.jpg`)

2. **Update certificates array** in `js/config.js`:
   ```javascript
   const certificates = [
     {
       id: 3,
       imageId: "3",
       title: "Your Certificate Name",
       issuer: "Issuing Organization",
       date: "2024",
       description: "Description here...",
       status: "certified",
       icon: "🎓",
     },
   ];
   ```

### Adding a Command

Add to `commands` object in `js/commands.js`:

```javascript
const commands = {
  mycommand() {
    terminal.print("Hello from my custom command!", "success");
  },
};
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **Vanilla JavaScript** - No frameworks or dependencies
- **Web APIs**:
  - Fetch API (for external data)
  - LocalStorage API (for user preferences)
  - SessionStorage API (for boot tracking)

## 🌐 APIs Used

| API                                                               | Purpose           | Free Tier        |
| ----------------------------------------------------------------- | ----------------- | ---------------- |
| [Open-Meteo](https://open-meteo.com/)                             | Weather data      | ✅ Unlimited     |
| [Official Joke API](https://github.com/15Dkatz/official_joke_api) | Programming jokes | ✅ Unlimited     |
| [Useless Facts API](https://uselessfacts.jsph.pl/)                | Random facts      | ✅ Unlimited     |
| [CoinGecko](https://www.coingecko.com/en/api)                     | Crypto prices     | ✅ 50 calls/min  |
| [GitHub API](https://docs.github.com/en/rest)                     | GitHub stats      | ✅ 60 calls/hour |

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (responsive design)

## 🎯 Performance

- **Initial Load**: ~50KB (gzipped)
- **Page Load**: Instant (dynamic loading with cache)
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)

## 📝 License

MIT License - Feel free to use this project as a template for your own portfolio!

## 👤 Author

**Muhammad Saad Khan**

- GitHub: [@AlphaBeast97](https://github.com/AlphaBeast97)
- LinkedIn: [saad-khan](https://linkedin.com/in/saad-khan-4213a9284)
- Email: ksaad5272@gmail.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

## 📚 Documentation

For detailed technical documentation, see [DOCUMENTATION.md](DOCUMENTATION.md)

---

**Built with ❤️ and lots of ☕**
