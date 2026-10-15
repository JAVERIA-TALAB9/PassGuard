import './style.css'
import { calcStrength, calcEntropy, estimateCrackTime, getEntropyRating } from './counter.js'

const icon = (content, size = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`
const lockIcon = icon('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 22)
const shieldIcon = icon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>', 22)
const eyeOpen = icon('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>')
const eyeClosed = icon('<path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c7 0 10 8 10 8a17.3 17.3 0 0 1-3.1 4.3M6.2 6.2C3.5 8.2 2 12 2 12s3 8 10 8a9.8 9.8 0 0 0 3-.5"/>')
const checkIcon = icon('<polyline points="20 6 9 17 4 12"/>', 15)
const warnIcon = icon('<path d="m10.3 3.9-8.5 14a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3l-8.5-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>', 18)

const checklistItems = [
  { id: 'length', title: 'Length', description: 'At least 12 characters', badge: '#' },
  { id: 'case', title: 'Uppercase & lowercase', description: 'Contains both uppercase and lowercase letters', badge: 'Aa' },
  { id: 'number', title: 'Numbers', description: 'Contains numbers (0–9)', badge: '123' },
  { id: 'special', title: 'Special characters', description: 'Includes symbols such as @, #, or $', badge: '✦' },
].map((check) => `<li data-check="${check.id}"><span class="check-badge">${check.badge}</span><span class="check-copy"><strong>${check.title}</strong><small>${check.description}</small></span><span class="status-pill not-passed"><span>${checkIcon}</span><span class="status-text">Needs work</span></span></li>`).join('')

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">${shieldIcon}</div><div><strong>Pass<span>Guard</span></strong><small>Stronger Passwords.<br>Safer You.</small></div></div>
      <nav class="sidebar-nav" aria-label="Main navigation">
        <button class="nav-item active" type="button">${lockIcon}<span>Password Checker</span></button>
        <button class="nav-item" type="button">${icon('<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>')}<span>About</span></button>
        <button class="nav-item" type="button">${icon('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.3 1.7c-.9.8-1.8 1.2-1.8 2.3M12 16h.01"/>')}<span>Tips</span></button>
      </nav>
      <div class="sidebar-note">${lockIcon}<div><strong>Your password stays<br>on your device.</strong><small>Nothing is sent to a server.</small></div></div>
    </aside>
    <main class="main-content">
      <header class="topbar"><div class="welcome">Welcome to <strong>Pass<span>Guard</span></strong></div><div class="top-actions"><div class="security-tags">${shieldIcon}<span>Private</span><b>•</b><span>Secure</span><b>•</b><span>Offline</span></div><button class="theme-button" type="button" aria-label="Toggle theme">${icon('<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z"/>')}</button></div></header>
      <section class="hero-copy"><h1>Check Your Password Strength</h1><p>Get instant feedback on your password's security, including entropy,<br class="desktop-only"> crack time estimation, and potential weaknesses — all in your browser.</p></section>
      <div class="dashboard-grid">
        <section class="panel checker-panel">
          <div class="password-field"><span class="field-lock">${lockIcon}</span><input type="password" id="password" placeholder="Enter your password" autocomplete="off" spellcheck="false"><button class="toggle-btn" id="toggle" type="button" aria-label="Show or hide password">${eyeOpen}</button></div>
          <div class="input-meta"><button class="show-label" id="show-label" type="button">${eyeOpen}<span>Show password</span></button><span id="length-count">0/64</span></div>
          <button class="analyze-button" id="analyze" type="button">${shieldIcon}<span>Analyze Password</span>${icon('<path d="M5 12h14M13 6l6 6-6 6"/>')}</button>
          <div class="section-heading"><h2>Password Checks</h2><span id="check-count">0/4</span></div><ul class="checklist" id="checklist">${checklistItems}</ul>
        </section>
        <section class="results-column">
          <div class="strength-card panel"><div class="score-ring" id="score-ring"><div><strong id="score">0</strong><small>/100</small></div></div><div class="strength-copy"><small>Password Strength</small><h2 id="strength-label">Waiting for input</h2><p id="strength-message">Start typing to see your results.</p><div class="progress-track"><div id="strength-progress"></div></div></div><div class="shield-corner">${shieldIcon}</div></div>
          <div class="stats-grid"><div class="stat-card stat-blue"><div class="stat-icon">✤</div><small>Entropy</small><strong id="entropy-stat">—</strong><span>Harder to crack</span></div><div class="stat-card stat-green"><div class="stat-icon">◷</div><small>Estimated Crack Time</small><strong id="time-stat">—</strong><span>Average attack</span></div><div class="stat-card stat-purple"><div class="stat-icon">▣</div><small>Attack Scenario</small><strong>Brute force</strong><span>Offline estimate</span></div></div>
          <div class="insight-card panel"><div class="insight-icon">${icon('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>')}</div><div><h3>What Makes This Password Strong?</h3><ul><li>Good length (12+ characters)</li><li>Mix of upper and lower case letters</li><li>Contains numbers and special characters</li><li>Not a common password</li><li>No obvious patterns or repeated characters</li></ul></div><div class="insight-art">${lockIcon}</div></div>
          <div class="notice-card"><span>${warnIcon}</span><div><strong>Keep in Mind</strong><p>Entropy and crack time are estimates based on the assumptions below. Actual security depends on many factors.</p></div></div><div class="tip-card">${shieldIcon}<span><strong>Pro Tip:</strong> Use a unique password for each account and consider a password manager.</span></div>
        </section>
      </div>
    </main>
  </div>
`

const input = document.querySelector('#password')
const toggleButton = document.querySelector('#toggle')
const showLabel = document.querySelector('#show-label')
const checklist = document.querySelector('#checklist')
const lengthCount = document.querySelector('#length-count')
const checkCount = document.querySelector('#check-count')
const score = document.querySelector('#score')
const scoreRing = document.querySelector('#score-ring')
const strengthLabel = document.querySelector('#strength-label')
const strengthMessage = document.querySelector('#strength-message')
const strengthProgress = document.querySelector('#strength-progress')
const entropyStat = document.querySelector('#entropy-stat')
const timeStat = document.querySelector('#time-stat')

let visible = false
function toggleVisibility() {
  visible = !visible
  input.type = visible ? 'text' : 'password'
  toggleButton.innerHTML = visible ? eyeClosed : eyeOpen
  showLabel.innerHTML = `${visible ? eyeClosed : eyeOpen}<span>${visible ? 'Hide password' : 'Show password'}</span>`
}
toggleButton.addEventListener('click', toggleVisibility)
showLabel.addEventListener('click', toggleVisibility)

function updateChecklist(password) {
  const checks = [
    { id: 'length', passed: password.length >= 12 },
    { id: 'case', passed: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { id: 'number', passed: /[0-9]/.test(password) },
    { id: 'special', passed: /[^a-zA-Z0-9]/.test(password) },
  ]
  const passing = checks.filter((check) => check.passed).length
  checks.forEach((check) => {
    const item = checklist.querySelector(`[data-check="${check.id}"]`)
    item.classList.toggle('passed', check.passed)
    item.querySelector('.status-text').textContent = check.passed ? 'Good' : 'Needs work'
    item.querySelector('.status-pill').classList.toggle('not-passed', !check.passed)
  })
  checkCount.textContent = `${passing}/4`
}

function updateResults() {
  const password = input.value.slice(0, 64)
  if (input.value !== password) input.value = password
  lengthCount.textContent = `${password.length}/64`
  if (!password) {
    score.textContent = '0'; strengthLabel.textContent = 'Waiting for input'; strengthMessage.textContent = 'Start typing to see your results.'; strengthProgress.style.width = '0%'; entropyStat.textContent = '—'; timeStat.textContent = '—'; scoreRing.style.setProperty('--score-angle', '0deg'); updateChecklist(''); return
  }
  const result = calcStrength(password)
  const scoreValue = Math.min(100, result.score * 25 + (result.score > 0 ? 5 : 0))
  const { effectiveBits } = calcEntropy(password)
  const rating = getEntropyRating(effectiveBits)
  score.textContent = scoreValue
  strengthLabel.textContent = result.label
  strengthLabel.style.color = result.color
  strengthMessage.textContent = result.score >= 3 ? 'This password looks secure.' : 'Consider adding more variety and length.'
  strengthProgress.style.width = `${scoreValue}%`
  strengthProgress.style.background = result.color
  scoreRing.style.setProperty('--score-angle', `${scoreValue * 3.6}deg`)
  scoreRing.style.setProperty('--score-color', result.color)
  entropyStat.textContent = `${effectiveBits} bits`
  entropyStat.style.color = rating.color
  timeStat.textContent = estimateCrackTime(effectiveBits)[1].time
  updateChecklist(password)
}

document.querySelector('#analyze').addEventListener('click', updateResults)
input.addEventListener('input', updateResults)
input.focus()
