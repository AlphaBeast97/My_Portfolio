// ===== COMMANDS =====
const commands = {
  help() {
    terminal.print("Available commands:", "info");
    terminal.print("");
    terminal.print("<span class='success'>Navigation:</span>");
    terminal.print(
      '  <span class="folder">ls</span>           - List available pages/sections',
    );
    terminal.print(
      '  <span class="folder">cd</span> &lt;page&gt;   - Navigate to a page',
    );
    terminal.print(
      '  <span class="folder">cd ..</span>        - Go back to previous page',
    );
    terminal.print(
      '  <span class="folder">pwd</span>          - Show current location',
    );
    terminal.print(
      '  <span class="folder">clear</span>        - Clear terminal output',
    );
    terminal.print("");
    terminal.print("<span class='success'>Easter Eggs (API Powered):</span>");
    terminal.print(
      '  <span class="folder">weather</span>      - Current weather in Lahore',
    );
    terminal.print(
      '  <span class="folder">joke</span>         - Random programming joke',
    );
    terminal.print(
      '  <span class="folder">fact</span>         - Random interesting fact',
    );
    terminal.print(
      '  <span class="folder">crypto</span>       - Bitcoin & Ethereum prices',
    );
    terminal.print(
      '  <span class="folder">github</span>       - My GitHub statistics',
    );
    terminal.print("");
    terminal.print(
      'Try: <span class="success">ls</span> to see available sections',
      "info",
    );
  },

  ls() {
    const current = getCurrentDir();
    if (!current || !current.children) {
      terminal.print("No items found", "error");
      return;
    }

    const items = Object.keys(current.children);
    if (items.length === 0) {
      terminal.print("Empty directory", "warning");
      return;
    }

    terminal.print("");
    items.forEach((item) => {
      const child = current.children[item];
      if (child.type === "dir") {
        terminal.print(`  <span class="folder">${item}</span>`);
      } else {
        terminal.print(`  <span class="file">${item}</span>`);
      }
    });
    terminal.print("");
  },

  cd(args) {
    if (!args || args.length === 0) {
      terminal.print("cd: missing argument", "error");
      terminal.print("Usage: cd &lt;directory&gt; or cd ..", "info");
      return;
    }

    const target = args[0];

    // Handle going back
    if (target === "..") {
      if (currentPath.length > 1) {
        currentPath.pop();
        const current = getCurrentDir();
        if (current.page) {
          changePage(current.page);
        }
        terminal.updatePrompt();
      } else {
        terminal.print("Already at root directory", "warning");
      }
      return;
    }

    // Handle going to root
    if (target === "~" || target === "/") {
      currentPath = ["~"];
      changePage("home-page");
      terminal.updatePrompt();
      return;
    }

    // Handle normal navigation
    const current = getCurrentDir();
    if (current.children && current.children[target]) {
      currentPath.push(target);
      const targetDir = current.children[target];
      if (targetDir.page) {
        changePage(targetDir.page);
      }
      terminal.updatePrompt();
    } else {
      terminal.print(`cd: ${target}: No such directory`, "error");
      terminal.print(
        'Type <span class="success">ls</span> to see available directories',
        "info",
      );
    }
  },

  pwd() {
    const path = currentPath.join("/").replace("~", "~");
    terminal.print(path, "info");
  },

  clear() {
    terminal.clear();
  },

  // Easter egg commands
  whoami() {
    terminal.print("saad - Web Developer & Terminal Enthusiast", "info");
  },

  date() {
    terminal.print(new Date().toString(), "info");
  },

  echo(args) {
    terminal.print(args.join(" "));
  },

  // API Easter Eggs
  async weather() {
    terminal.print("Fetching weather for Lahore...", "info");
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=31.5204&longitude=74.3587&current_weather=true",
      );
      const data = await response.json();
      const weather = data.current_weather;
      terminal.print("");
      terminal.print(`<span class="success">🌤️  Weather in Lahore</span>`);
      terminal.print(`   Temperature: ${weather.temperature}°C`);
      terminal.print(`   Wind Speed: ${weather.windspeed} km/h`);
      terminal.print(`   Time: ${new Date(weather.time).toLocaleString()}`);
      terminal.print("");
    } catch (error) {
      terminal.print("Failed to fetch weather data", "error");
    }
  },

  async joke() {
    terminal.print("Loading programming joke...", "info");
    try {
      const response = await fetch(
        "https://official-joke-api.appspot.com/jokes/programming/random",
      );
      const data = await response.json();
      const joke = data[0];
      terminal.print("");
      terminal.print(`<span class="success">😄 ${joke.setup}</span>`);
      setTimeout(() => {
        terminal.print(`   ${joke.punchline}`, "info");
        terminal.print("");
      }, 1000);
    } catch (error) {
      terminal.print("Failed to fetch joke", "error");
    }
  },

  async fact() {
    terminal.print("Loading random fact...", "info");
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/random.json?language=en",
      );
      const data = await response.json();
      terminal.print("");
      terminal.print(`<span class="success">💡 ${data.text}</span>`);
      terminal.print("");
    } catch (error) {
      terminal.print("Failed to fetch fact", "error");
    }
  },

  async crypto() {
    terminal.print("Fetching crypto prices...", "info");
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
      );
      const data = await response.json();
      terminal.print("");
      terminal.print(`<span class="success">💰 Cryptocurrency Prices</span>`);
      terminal.print(`   Bitcoin: $${data.bitcoin.usd.toLocaleString()}`);
      terminal.print(`   Ethereum: $${data.ethereum.usd.toLocaleString()}`);
      terminal.print("");
    } catch (error) {
      terminal.print("Failed to fetch crypto prices", "error");
    }
  },

  async github() {
    terminal.print("Fetching GitHub stats...", "info");
    try {
      const response = await fetch("https://api.github.com/users/AlphaBeast97");
      const data = await response.json();
      terminal.print("");
      terminal.print(
        `<span class="success">🐙 GitHub Stats - @${data.login}</span>`,
      );
      terminal.print(`   Name: ${data.name}`);
      terminal.print(`   Public Repos: ${data.public_repos}`);
      terminal.print(`   Followers: ${data.followers}`);
      terminal.print(`   Following: ${data.following}`);
      terminal.print(`   Bio: ${data.bio || "No bio"}`);
      terminal.print("");
    } catch (error) {
      terminal.print("Failed to fetch GitHub stats", "error");
    }
  },
};

// ===== COMMAND HANDLER =====
function handleCommand(input) {
  input = input.trim();

  if (!input) return;

  // Add to history
  commandHistory.push(input);
  historyIndex = commandHistory.length;

  // Echo command
  terminal.print(
    `<span style="color: #61afef;">saad@portfolio:${currentPath.join("/")}$</span> ${input}`,
  );

  // Parse command
  const parts = input.split(" ");
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Execute command (support async)
  if (commands[cmd]) {
    const result = commands[cmd](args);
    // Handle async commands
    if (result instanceof Promise) {
      result.catch((err) => {
        terminal.print(`Command error: ${err.message}`, "error");
      });
    }
  } else {
    terminal.print(`Command not found: ${cmd}`, "error");
    terminal.print(
      'Type <span class="success">help</span> for available commands',
      "info",
    );
  }
}
