const COMMON_PASSWORDS = new Set([
  'password', 'password123', '123456', '12345678', '123456789',
  'qwerty', 'abc123', '111111', '000000', '123123', 'admin',
  'letmein', 'welcome', 'monkey', 'dragon', 'master', 'login',
  'princess', 'football', 'shadow', 'sunshine', 'trustno1',
  'iloveyou', 'batman', 'access', 'hello', 'charlie', 'superman',
]);

export const CHECKS = [
  { id: 'length', label: 'At least 12 characters', test: (p) => p.length >= 12 },
  { id: 'lower', label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'upper', label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', label: 'Number', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'Special character', test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

export function findWarnings(password) {
  const warnings = [];

  if (password.length > 0 && password.length < 8) {
    warnings.push('Very short — easily cracked by brute force.');
  }
  if (password.length >= 8 && password.length < 12) {
    warnings.push('On the shorter side. 12+ characters is recommended.');
  }
  if (/^(.)\1+$/.test(password)) {
    warnings.push('All identical characters — extremely weak.');
  }
  if (/^(0123456789|123456|12345678|23456789|abcdef|qwerty|asdfgh)/i.test(password)) {
    warnings.push('Contains a common keyboard or sequential pattern.');
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    warnings.push('This is one of the most commonly used passwords.');
  }
  if (/^[a-z]+$/i.test(password)) {
    warnings.push('Only letters — add numbers and symbols for variety.');
  }
  if (/^[0-9]+$/.test(password)) {
    warnings.push('Only numbers — add letters and symbols for variety.');
  }

  return warnings;
}

// Attack scenarios: guesses per second
const ATTACK_SCENARIOS = [
  { id: 'online', label: 'Online attack (throttled)', rate: 1e3 },
  { id: 'offline', label: 'Offline attack (fast hash)', rate: 1e10 },
  { id: 'massive', label: 'Massive GPU farm', rate: 1e12 },
];

function getCharsetSize(password) {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 33;
  return size;
}

export function calcEntropy(password) {
  if (password.length === 0) return { bits: 0, charsetSize: 0, effectiveBits: 0 };
  const charsetSize = getCharsetSize(password);
  const rawBits = charsetSize > 0 ? password.length * Math.log2(charsetSize) : 0;

  // Reduce effective entropy for patterns and common passwords
  let effectiveBits = rawBits;
  const warnings = findWarnings(password);
  if (COMMON_PASSWORDS.has(password.toLowerCase())) effectiveBits = Math.min(effectiveBits, 10);
  if (/^(.)\1+$/.test(password)) effectiveBits = Math.min(effectiveBits, 6);
  if (/^(0123456789|123456|12345678|23456789|abcdef|qwerty|asdfgh)/i.test(password)) effectiveBits = Math.min(effectiveBits, 20);
  if (/^[a-z]+$/i.test(password)) effectiveBits = Math.min(effectiveBits, rawBits * 0.6);
  if (/^[0-9]+$/.test(password)) effectiveBits = Math.min(effectiveBits, rawBits * 0.5);
  // Repetition penalty: many repeated characters reduce real entropy
  const uniqueChars = new Set(password).size;
  if (password.length > 4 && uniqueChars < password.length * 0.4) {
    effectiveBits *= 0.7;
  }

  effectiveBits = Math.max(0, Math.round(effectiveBits));
  return { bits: Math.round(rawBits), charsetSize, effectiveBits };
}

function formatTime(seconds) {
  if (seconds < 1) return 'instantly';
  if (seconds < 1e3) return `${Math.round(seconds)} seconds`;
  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
  ];
  for (const u of units) {
    const val = seconds / u.seconds;
    if (val >= 1) {
      if (val >= 1e6) return formatLargeNumber(val) + ` ${u.name}s`;
      if (val >= 100) return `${Math.round(val).toLocaleString()} ${u.name}s`;
      return `${val.toFixed(1)} ${u.name}s`;
    }
  }
  return `${Math.round(seconds)} seconds`;
}

function formatLargeNumber(n) {
  if (n >= 1e15) return `${(n / 1e15).toFixed(1)} quadrillion`;
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)} trillion`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  return Math.round(n).toLocaleString();
}

export function estimateCrackTime(entropyBits) {
  // Average case: half the keyspace
  const avgGuesses = Math.pow(2, Math.max(0, entropyBits - 1));
  return ATTACK_SCENARIOS.map(s => ({
    id: s.id,
    label: s.label,
    time: formatTime(avgGuesses / s.rate),
  }));
}

export function getEntropyRating(bits) {
  if (bits < 28) return { label: 'Very poor', color: 'var(--strength-0)' };
  if (bits < 36) return { label: 'Poor', color: 'var(--strength-1)' };
  if (bits < 60) return { label: 'Reasonable', color: 'var(--strength-2)' };
  if (bits < 128) return { label: 'Strong', color: 'var(--strength-3)' };
  return { label: 'Excellent', color: 'var(--strength-4)' };
}

export function calcStrength(password) {
  if (password.length === 0) return { score: 0, label: '', color: 'var(--text-muted)' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  let variety = 0;
  if (/[a-z]/.test(password)) variety++;
  if (/[A-Z]/.test(password)) variety++;
  if (/[0-9]/.test(password)) variety++;
  if (/[^a-zA-Z0-9]/.test(password)) variety++;
  if (variety >= 3) score++;
  if (variety === 4) score++;

  if (findWarnings(password).length > 0) score = Math.max(0, score - 1);
  if (COMMON_PASSWORDS.has(password.toLowerCase())) score = 0;

  score = Math.min(score, 4);

  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = [
    'var(--strength-0)', 'var(--strength-1)', 'var(--strength-2)',
    'var(--strength-3)', 'var(--strength-4)',
  ];

  return { score, label: labels[score], color: colors[score] };
}
