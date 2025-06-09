// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = new Array(this.columns).fill(1);
    }
    
    handleResize() {
        this.init();
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Terminal Commands
class Terminal {
    constructor() {
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            projects: this.showProjects.bind(this),
            skills: this.showSkills.bind(this),
            achievements: this.showAchievements.bind(this),
            contact: this.showContact.bind(this),
            clear: this.clearTerminal.bind(this),
            matrix: this.matrixAnimation.bind(this),
            hack: this.hackingAnimation.bind(this),
            whoami: this.whoami.bind(this),
            ls: this.listFiles.bind(this),
            pwd: this.printWorkingDirectory.bind(this),
            date: this.showDate.bind(this),
            uname: this.showSystem.bind(this),
            history: this.showHistory.bind(this),
            exit: this.exitTerminal.bind(this)
        };
        this.commandHistory = [];
        this.historyIndex = -1;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            }
        });
    }
    
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        
        this.input.value = this.commandHistory[this.historyIndex] || '';
    }
    
    processCommand() {
        const command = this.input.value.trim().toLowerCase();
        
        if (command) {
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
            
            this.addToOutput(`<span class="blue">vk@cybersec:~$</span> ${command}`);
            
            if (this.commands[command]) {
                this.commands[command]();
            } else {
                this.addToOutput(`<span class="red">Command not found: ${command}</span>`);
                this.addToOutput(`<span class="orange">Type 'help' to see available commands</span>`);
            }
        }
        
        this.input.value = '';
        this.scrollToBottom();
    }
    
    addToOutput(content, delay = 0) {
        setTimeout(() => {
            const line = document.createElement('div');
            line.innerHTML = content;
            line.className = 'terminal-line';
            this.output.appendChild(line);
            this.scrollToBottom();
        }, delay);
    }
    
    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    showHelp() {
        const helpText = `
<span class="green">Available Commands:</span>
<span class="blue">help</span>        - Show this help message
<span class="blue">about</span>       - Display personal information
<span class="blue">projects</span>    - List all projects
<span class="blue">skills</span>      - Show technical skills
<span class="blue">achievements</span> - Display achievements and awards
<span class="blue">contact</span>     - Show contact information
<span class="blue">ls</span>          - List directory contents
<span class="blue">pwd</span>         - Print working directory
<span class="blue">date</span>        - Show current date and time
<span class="blue">history</span>     - Show command history
<span class="blue">hack</span>        - Run hacking simulation
<span class="blue">clear</span>       - Clear terminal screen
<span class="blue">exit</span>        - Exit terminal mode
        `;
        this.addToOutput(helpText);
    }
    
    showAbout() {
        const aboutText = `
<span class="green">PERSONAL INFORMATION</span>
<span class="orange">Name:</span> VigneshKumar R
<span class="orange">Title:</span> Computer Network & Cybersecurity Enthusiast
<span class="orange">Education:</span> B.E (ECE) - Sri Eshwar College of Engineering
<span class="orange">CGPA:</span> 8.48 (2022-2026)
<span class="orange">Email:</span> mailltovigneshkumar@gmail.com
<span class="orange">Phone:</span> +91 9384943252

<span class="blue">Summary:</span>
Passionate cybersecurity professional with expertise in IoT network 
security, VPN tunneling, and wireless mesh networks. Published patent 
holder with multiple hackathon victories and IEEE leadership experience.
        `;
        this.addToOutput(aboutText);
    }
    
    showProjects() {
        const projectsText = `
<span class="green">PROJECTS DIRECTORY</span>

<span class="orange">[1] VPN Tunneled Security for IoT Networks</span>
    Status: <span class="green">PATENT PUBLISHED</span> (202541002284 A)
    Tech: Cisco Packet Tracer, DNS, IoT, VPN Tunneling
    Year: 2024

<span class="orange">[2] Ad-hoc Mesh Network for Vehicles</span>
    Status: <span class="blue">COMPLETED</span>
    Tech: Cisco Packet Tracer, ESP 8266, IR Sensor, IEEE 802.11
    Year: 2024

<span class="orange">[3] Optimized Wireless Networking Topology</span>
    Status: <span class="blue">COMPLETED</span>
    Tech: Cisco Packet Tracer, ESP8266, IEEE 802.11
    Year: 2024

<span class="orange">[4] AVIAMMO: Ammonia Based Fuel Generation</span>
    Status: <span class="green">PATENT PUBLISHED</span> (202541002285 A)
    Tech: ESP8266, Blynk, Peltier Law
    Year: 2024
        `;
        this.addToOutput(projectsText);
    }
    
    showSkills() {
        const skillsText = `
<span class="green">TECHNICAL SKILLS MATRIX</span>

<span class="orange">Programming Languages:</span>
  • C [████████████████████] 90%
  • Python [███████████████████] 85%
  • C++ [██████████████████] 80%

<span class="orange">Networking:</span>
  • TCP/UDP [███████████████████████] 95%
  • IPv4/IPv6 [██████████████████████] 90%
  • OSPF/RIP [█████████████████████] 88%
  • SDN, MPLS, VLAN, Subnetting

<span class="orange">Security:</span>
  • Network Security [██████████████████████] 92%
  • Ethical Hacking [█████████████████████] 87%
  • Penetration Testing [█████████████████████] 85%

<span class="orange">Tools & Platforms:</span>
  Wireshark, Packet Tracer, Nmap, Kali Linux, Termux, 
  VS Code, GitHub, Netsim

<span class="orange">Certifications:</span>
  CNSP - Merit, CCNA (3 Modules), EHE, 
  Google Cybersecurity Professional
        `;
        this.addToOutput(skillsText);
    }
    
    showAchievements() {
        const achievementsText = `
<span class="green">ACHIEVEMENTS LOG</span>

<span class="orange">🏆 Avishkaar'24 - Winner</span>
   Prize: <span class="green">₹1,25,000</span>
   Event: 48 hours Hackathon - GeeksForGeeks
   Year: 2024

<span class="orange">🥈 Hackfest'24 - II Prize</span>
   Prize: <span class="green">₹10,000</span>
   Event: SAP - KPRIET (Regional Round)
   Year: 2024

<span class="orange">👨‍💼 IEEE Chairman</span>
   Organization: Institute of Electrical and Electronics Engineers
   Experience: 2 years
   Member ID: 99492003

<span class="orange">💡 Ideas4Life - Top 70</span>
   Organization: Ministry of Environment
   Status: Results yet to publish
   Year: 2024

<span class="orange">💻 LeetCode Profile</span>
   Global Rank: 553,773
   Problems Completed: 200
   Contest Rating: 1450
        `;
        this.addToOutput(achievementsText);
    }
    
    showContact() {
        const contactText = `
<span class="green">CONTACT INFORMATION</span>

<span class="orange">Email:</span> mailltovigneshkumar@gmail.com
<span class="orange">Phone:</span> +91 9384943252
<span class="orange">Location:</span> India

<span class="blue">Professional Networks:</span>
LinkedIn: Available on request
GitHub: Available on request

<span class="yellow">Note:</span> Feel free to reach out for collaboration,
networking opportunities, or cybersecurity discussions!
        `;
        this.addToOutput(contactText);
    }
    
    whoami() {
        this.addToOutput('<span class="green">vignesh_kumar</span>');
        this.addToOutput('<span class="blue">Computer Network & Cybersecurity Enthusiast</span>');
    }
    
    listFiles() {
        const filesText = `
<span class="blue">drwxr-xr-x</span> 3 vignesh cybersec 4096 Jun 09 06:03 <span class="blue">projects/</span>
<span class="blue">drwxr-xr-x</span> 2 vignesh cybersec 4096 Jun 09 06:03 <span class="blue">skills/</span>
<span class="blue">drwxr-xr-x</span> 2 vignesh cybersec 4096 Jun 09 06:03 <span class="blue">achievements/</span>
<span class="green">-rw-r--r--</span> 1 vignesh cybersec 2048 Jun 09 06:03 <span class="green">resume.pdf</span>
<span class="green">-rw-r--r--</span> 1 vignesh cybersec 1024 Jun 09 06:03 <span class="green">contact.txt</span>
<span class="green">-rw-r--r--</span> 1 vignesh cybersec  512 Jun 09 06:03 <span class="green">about.md</span>
        `;
        this.addToOutput(filesText);
    }
    
    printWorkingDirectory() {
        this.addToOutput('<span class="blue">/home/vignesh/portfolio</span>');
    }
    
    showDate() {
        const now = new Date();
        this.addToOutput(`<span class="green">${now.toString()}</span>`);
    }
    
    showSystem() {
        const systemText = `
<span class="green">CyberSec Terminal v2.1.0</span>
<span class="blue">Kernel:</span> Linux vignesh-cybersec 5.15.0-cyber
<span class="blue">OS:</span> VigneshKumar Portfolio OS
<span class="blue">Architecture:</span> x86_64
<span class="blue">Shell:</span> /bin/cybershell
        `;
        this.addToOutput(systemText);
    }
    
    showHistory() {
        this.addToOutput('<span class="green">Command History:</span>');
        this.commandHistory.forEach((cmd, index) => {
            this.addToOutput(`<span class="blue">${index + 1}</span> ${cmd}`);
        });
    }
    
    matrixAnimation() {
        this.addToOutput('<span class="green">Initializing Matrix Protocol...</span>');
        
        let count = 0;
        const interval = setInterval(() => {
            const chars = '01アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
            let line = '';
            for (let i = 0; i < 50; i++) {
                line += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            this.addToOutput(`<span class="green">${line}</span>`);
            count++;
            if (count > 10) {
                clearInterval(interval);
                this.addToOutput('<span class="blue">Matrix Protocol terminated.</span>');
            }
        }, 100);
    }
    
    hackingAnimation() {
        const steps = [
            'Initializing hacking sequence...',
            'Scanning for vulnerabilities...',
            'Found 47 open ports...',
            'Attempting SQL injection...',
            'Bypassing firewall...',
            'Accessing mainframe...',
            'Downloading encrypted files...',
            'Decrypting with quantum algorithms...',
            'Access granted! Just kidding 😄',
            'This is just for fun - I\'m an ethical hacker!'
        ];
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                const color = index === steps.length - 2 ? 'green' : 
                             index === steps.length - 1 ? 'orange' : 'blue';
                this.addToOutput(`<span class="${color}">${step}</span>`);
            }, index * 800);
        });
    }
    
    clearTerminal() {
        this.output.innerHTML = '';
    }
    
    exitTerminal() {
        this.addToOutput('<span class="orange">Closing terminal...</span>');
        setTimeout(() => {
            document.getElementById('terminal-console').classList.add('hidden');
            document.getElementById('main-portfolio').style.display = 'block';
        }, 1000);
    }
}

// Skill Bar Animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.dataset.skill;
                entry.target.style.width = skillLevel + '%';
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('.nav-link[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Navigation
function setupMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Terminal Toggle
function setupTerminalToggle() {
    const consoleBtn = document.getElementById('console-btn');
    const terminalConsole = document.getElementById('terminal-console');
    const closeTerminal = document.getElementById('close-terminal');
    const mainPortfolio = document.getElementById('main-portfolio');
    const terminalInput = document.getElementById('terminal-input');
    
    consoleBtn.addEventListener('click', () => {
        terminalConsole.classList.remove('hidden');
        mainPortfolio.style.display = 'none';
        setTimeout(() => terminalInput.focus(), 100);
    });
    
    closeTerminal.addEventListener('click', () => {
        terminalConsole.classList.add('hidden');
        mainPortfolio.style.display = 'block';
    });
}

// Project Card Interactions
function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0)';
        });
    });
}

// Particle Effect
class ParticleEffect {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.3';
        
        document.body.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.fillStyle = '#00ff41';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Matrix Rain
    new MatrixRain();
    
    // Initialize Typing Animation
    const heroTyping = document.getElementById('hero-typing');
    if (heroTyping) {
        new TypingAnimation(heroTyping, [
            'Network R&D & Security',
            'TWO Published Patent Holder',
            'IEEE Chairman of Experience 2 Years',
            '5 - Hackathon Winner',
            'IoT and Network Security'
        ], 80);
    }
    
    // Initialize Terminal
    new Terminal();
    
    // Setup all functionalities
    animateSkillBars();
    setupSmoothScrolling();
    setupMobileNav();
    setupTerminalToggle();
    setupProjectCards();
    
    // Initialize Particle Effect
    new ParticleEffect();
    
    // Add loading animation
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    });
});
