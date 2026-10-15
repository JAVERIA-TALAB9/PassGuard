# 🔐 PassGuard — Password Strength Checker

**Stronger Passwords. Safer You.**

PassGuard is a browser-based password security tool that helps users understand password strength through real-time feedback, entropy analysis, estimated cracking time, and common-password weakness detection.

Built with **HTML, CSS, and JavaScript**, PassGuard combines a clean, responsive dashboard with practical cybersecurity concepts to make password security easier to understand.

## ✨ Features

- **Password Strength Scoring** — Evaluates password length, character variety, and common weaknesses.
- **Entropy Analysis** — Estimates password complexity in bits.
- **Crack Time Estimation** — Estimates how long guessing might take under different attack scenarios.
- **Common Password Detection** — Identifies common passwords, sequential patterns, and repeated characters.
- **Security Checklist** — Checks length, uppercase and lowercase letters, numbers, and special characters.
- **Show/Hide Password** — Toggle password visibility while testing.
- **Privacy-Focused Design** — Password analysis runs locally in the browser; passwords are not sent to a backend server.
- **Interactive Dashboard** — View strength scores, security checks, and analysis results in one place.

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (ES Modules)
- Vite

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your computer
- npm (included with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/PassGuard.git
   ```

2. Navigate to the project directory:

   ```bash
   cd PassGuard
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## 📂 Project Structure

```text
PassGuard/
├── public/
├── index.html
├── main.js
├── counter.js
├── style.css
├── package.json
├── package-lock.json
└── README.md
```

## 🔒 Privacy & Security

PassGuard performs its password analysis directly in the browser without transmitting passwords to a backend server.

**Important:** Strength scores, entropy, and cracking-time estimates are educational approximations, not guarantees of real-world security. Actual cracking difficulty depends on password selection, attack methods, hashing algorithms, hardware, and other factors. The common-password check uses a limited local list and does not detect every compromised password.

For better security, use long, unique passwords, consider a password manager, and enable multifactor authentication wherever possible.

## 🎯 Project Goals

- Apply JavaScript to a practical cybersecurity use case.
- Demonstrate password-strength assessment and security-awareness concepts.
- Build a user-friendly, privacy-conscious security utility.
- Combine frontend development with application-security knowledge.

## 👩‍💻 Author

**Javeria Talab**  
BS Computer Science Student | Application Security & Web Development

- Portfolio: https://javeriatalab.site
- GitHub: https://github.com/JAVERIA-TALAB9
- LinkedIn: https://www.linkedin.com/in/javeria-talab-03845a318/

## ⭐ Feedback

If you find this project useful, consider giving the repository a star. Suggestions and constructive feedback are welcome!

---

*Built to explore the intersection of web development, cybersecurity, and privacy-conscious design.*
