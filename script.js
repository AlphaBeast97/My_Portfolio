// ===== STATE MANAGEMENT =====
let currentPath = ['~'];
let commandHistory = [];
let historyIndex = -1;

// ===== FILESYSTEM STRUCTURE =====
const fileSystem = {
    '~': {
        type: 'dir',
        page: 'home-page',
        children: {
            'about': { type: 'dir', page: 'about-page', children: {} },
            'skills': { type: 'dir', page: 'skills-page', children: {} },
            'projects': {
                type: 'dir',
                page: 'projects-page',
                children: {
                    'project1': { type: 'dir', page: 'project1-page', children: {} },
                    'project2': { type: 'dir', page: 'project2-page', children: {} },
                    'project3': { type: 'dir', page: 'project3-page', children: {} }
                }
            },
            'contact': { type: 'dir', page: 'contact-page', children: {} }
        }
    }
};

// ===== TERMINAL FUNCTIONS =====
const terminal = {
    output: document.getElementById('terminal-output'),
    input: document.getElementById('terminal-input'),
    prompt: document.getElementById('prompt'),

    print(message, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = message;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    },

    clear() {
        this.output.innerHTML = '';
    },

    updatePrompt() {
        const path = currentPath.join('/').replace('~', '~');
        this.prompt.textContent = `saad@portfolio:${path}$`;
    }
};

// ===== NAVIGATION FUNCTIONS =====
function getCurrentDir() {
    let current = fileSystem;
    for (let dir of currentPath) {
        current = current[dir];
    }
    return current;
}

function navigateTo(path) {
    // Show the page
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(path);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function changePage(pageName) {
    navigateTo(pageName);
}

// Helper function for project navigation (called from HTML buttons)
function navigateToProject(projectName) {
    terminal.input.value = `cd ${projectName}`;
    handleCommand(`cd ${projectName}`);
}

// ===== COMMANDS =====
const commands = {
    help() {
        terminal.print('Available commands:', 'info');
        terminal.print('');
        terminal.print('  <span class="folder">ls</span>           - List available pages/sections');
        terminal.print('  <span class="folder">cd</span> &lt;page&gt;   - Navigate to a page');
        terminal.print('  <span class="folder">cd ..</span>        - Go back to previous page');
        terminal.print('  <span class="folder">pwd</span>          - Show current location');
        terminal.print('  <span class="folder">clear</span>        - Clear terminal output');
        terminal.print('  <span class="folder">help</span>         - Show this help message');
        terminal.print('');
        terminal.print('Try: <span class="success">ls</span> to see available sections', 'info');
    },

    ls() {
        const current = getCurrentDir();
        if (!current || !current.children) {
            terminal.print('No items found', 'error');
            return;
        }

        const items = Object.keys(current.children);
        if (items.length === 0) {
            terminal.print('Empty directory', 'warning');
            return;
        }

        terminal.print('');
        items.forEach(item => {
            const child = current.children[item];
            if (child.type === 'dir') {
                terminal.print(`  <span class="folder">${item}</span>`);
            } else {
                terminal.print(`  <span class="file">${item}</span>`);
            }
        });
        terminal.print('');
    },

    cd(args) {
        if (!args || args.length === 0) {
            terminal.print('cd: missing argument', 'error');
            terminal.print('Usage: cd &lt;directory&gt; or cd ..', 'info');
            return;
        }

        const target = args[0];

        // Handle going back
        if (target === '..') {
            if (currentPath.length > 1) {
                currentPath.pop();
                const current = getCurrentDir();
                if (current.page) {
                    changePage(current.page);
                }
                terminal.updatePrompt();
            } else {
                terminal.print('Already at root directory', 'warning');
            }
            return;
        }

        // Handle going to root
        if (target === '~' || target === '/') {
            currentPath = ['~'];
            changePage('home-page');
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
            terminal.print(`cd: ${target}: No such directory`, 'error');
            terminal.print('Type <span class="success">ls</span> to see available directories', 'info');
        }
    },

    pwd() {
        const path = currentPath.join('/').replace('~', '~');
        terminal.print(path, 'info');
    },

    clear() {
        terminal.clear();
    },

    // Easter egg commands
    whoami() {
        terminal.print('saad - Web Developer & Terminal Enthusiast', 'info');
    },

    date() {
        terminal.print(new Date().toString(), 'info');
    },

    echo(args) {
        terminal.print(args.join(' '));
    }
};

// ===== COMMAND HANDLER =====
function handleCommand(input) {
    input = input.trim();
    
    if (!input) return;

    // Add to history
    commandHistory.push(input);
    historyIndex = commandHistory.length;

    // Echo command
    terminal.print(`<span style="color: #61afef;">saad@portfolio:${currentPath.join('/')}$</span> ${input}`);

    // Parse command
    const parts = input.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command
    if (commands[cmd]) {
        commands[cmd](args);
    } else {
        terminal.print(`Command not found: ${cmd}`, 'error');
        terminal.print('Type <span class="success">help</span> for available commands', 'info');
    }
}

// ===== EVENT LISTENERS =====
terminal.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = terminal.input.value;
        handleCommand(input);
        terminal.input.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminal.input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminal.input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            terminal.input.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        // Simple autocomplete
        const input = terminal.input.value;
        const current = getCurrentDir();
        if (current.children) {
            const matches = Object.keys(current.children).filter(item => 
                item.startsWith(input)
            );
            if (matches.length === 1) {
                terminal.input.value = matches[0];
            } else if (matches.length > 1) {
                terminal.print('');
                matches.forEach(match => {
                    terminal.print(`  <span class="folder">${match}</span>`);
                });
                terminal.print('');
            }
        }
    }
});

// Keep terminal input focused
document.addEventListener('click', (e) => {
    if (!e.target.closest('#terminal-input')) {
        terminal.input.focus();
    }
});

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
    terminal.print('╔════════════════════════════════════════════════════╗', 'success');
    terminal.print('║     Welcome to Saad\'s Terminal Portfolio          ║', 'success');
    terminal.print('╚════════════════════════════════════════════════════╝', 'success');
    terminal.print('');
    terminal.print('Type <span class="success">help</span> to see available commands', 'info');
    terminal.print('Type <span class="success">ls</span> to see available sections', 'info');
    terminal.print('');
    
    terminal.input.focus();
});
