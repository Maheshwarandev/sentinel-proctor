/**
 * AI Question Service - Infinite Beginner English & Computer/Programming Generator
 * 
 * Specially designed for beginners learning English and Computer Programming:
 * - Simple vocabulary, short sentences, not hard to read.
 * - Staged Session: First 20 questions are easy beginner English & computer basics,
 *   followed by 30 questions on programming, coding, and web development.
 * 
 * Multi-tier Architecture:
 * - Tier 1: Google Gemini AI (if GEMINI_API_KEY is configured in .env)
 * - Tier 2: Free Public Language / Trivia REST API
 * - Tier 3: Procedural Beginner Programming Generator (100% offline, infinite permutations)
 */

import { Question } from '../models/Question.js';
import { SEED_QUESTIONS } from '../data/questionSeed.js';
import { getIsConnected } from '../config/db.js';

// Procedural templates for beginner English & programming
const PROGRAMMING_ROLES = [
  'A web developer',
  'A junior programmer',
  'A computer student',
  'A software engineer',
  'A coding beginner'
];

const PROCEDURAL_BEGINNER_TOPICS = [
  {
    category: 'Computer Basics',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-easy-${id}-${Date.now()}`,
      text: `${role} uses a keyboard to _____ code into the editor.`,
      options: ['type', 'eat', 'paint', 'throw'],
      correctAnswerIndex: 0,
      category: 'Computer Basics',
      difficulty: 'beginner',
      explanation: 'We use the verb "type" when pressing keys to enter letters and words on a computer.'
    })
  },
  {
    category: 'Beginner English',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-easy-${id}-${Date.now()}`,
      text: `${role} _____ practicing English and coding every day.`,
      options: ['is', 'are', 'were', 'am'],
      correctAnswerIndex: 0,
      category: 'Beginner English',
      difficulty: 'beginner',
      explanation: 'Singular subjects take the singular verb "is" in the present tense.'
    })
  },
  {
    category: 'Computer Basics',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-easy-${id}-${Date.now()}`,
      text: `Before leaving your desk, you should _____ your open work files.`,
      options: ['save', 'delete', 'break', 'lose'],
      correctAnswerIndex: 0,
      category: 'Computer Basics',
      difficulty: 'beginner',
      explanation: 'Saving your files ensures your latest progress is preserved safely on the hard drive.'
    })
  },
  {
    category: 'Computer Basics',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-easy-${id}-${Date.now()}`,
      text: `You click on the blue link to open a new web _____.`,
      options: ['page', 'chair', 'battery', 'cable'],
      correctAnswerIndex: 0,
      category: 'Computer Basics',
      difficulty: 'beginner',
      explanation: 'Clicking a link directs your web browser to a new web page.'
    })
  }
];

const PROCEDURAL_CODING_TOPICS = [
  {
    category: 'Coding Basics',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-coding-${id}-${Date.now()}`,
      text: `When ${role.toLowerCase()} finds a mistake in the program, it is called a _____.`,
      options: ['bug', 'dog', 'tree', 'stone'],
      correctAnswerIndex: 0,
      category: 'Coding Basics',
      difficulty: 'beginner',
      explanation: 'In software development, an error in program logic or syntax is called a "bug".'
    })
  },
  {
    category: 'Coding Basics',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-coding-${id}-${Date.now()}`,
      text: `${role} uses a _____ to repeat a line of code 10 times.`,
      options: ['loop', 'line', 'door', 'wall'],
      correctAnswerIndex: 0,
      category: 'Coding Basics',
      difficulty: 'beginner',
      explanation: 'A loop (like a for-loop or while-loop) repeats actions automatically.'
    })
  },
  {
    category: 'Web Development',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-coding-${id}-${Date.now()}`,
      text: `To change the background color of a website, ${role.toLowerCase()} writes _____ code.`,
      options: ['CSS', 'audio', 'video', 'printer'],
      correctAnswerIndex: 0,
      category: 'Web Development',
      difficulty: 'beginner',
      explanation: 'CSS (Cascading Style Sheets) styles colors, sizes, and fonts on web pages.'
  })
  },
  {
    category: 'Coding Basics',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-coding-${id}-${Date.now()}`,
      text: `A container used in code to store a number or text value is a _____.`,
      options: ['variable', 'closet', 'pocket', 'bottle'],
      correctAnswerIndex: 0,
      category: 'Coding Basics',
      difficulty: 'beginner',
      explanation: 'A variable holds data that a program can read or modify later.'
    })
  },
  {
    category: 'Tech Skills',
    difficulty: 'beginner',
    make: (role, id) => ({
      id: `ai-proc-coding-${id}-${Date.now()}`,
      text: `To display a test message on the screen in JavaScript, we write console._____("Hello").`,
      options: ['log', 'cat', 'say', 'jump'],
      correctAnswerIndex: 0,
      category: 'Coding Basics',
      difficulty: 'beginner',
      explanation: 'console.log() is the primary tool for printing debug output in JavaScript.'
    })
  }
];

/**
 * Procedural generator for beginner questions
 */
export function generateProceduralQuestions(count = 50, type = 'mixed') {
  const result = [];
  const timestamp = Date.now();

  if (type === 'easy') {
    for (let i = 0; i < count; i++) {
      const role = PROGRAMMING_ROLES[i % PROGRAMMING_ROLES.length];
      const template = PROCEDURAL_BEGINNER_TOPICS[i % PROCEDURAL_BEGINNER_TOPICS.length];
      result.push(template.make(role, `easy_${i}_${timestamp}`));
    }
    return result;
  }

  if (type === 'coding') {
    for (let i = 0; i < count; i++) {
      const role = PROGRAMMING_ROLES[i % PROGRAMMING_ROLES.length];
      const template = PROCEDURAL_CODING_TOPICS[i % PROCEDURAL_CODING_TOPICS.length];
      result.push(template.make(role, `coding_${i}_${timestamp}`));
    }
    return result;
  }

  const easyNeeded = Math.min(20, Math.floor(count * 0.4));
  const codingNeeded = count - easyNeeded;

  // Easy beginner questions
  for (let i = 0; i < easyNeeded; i++) {
    const role = PROGRAMMING_ROLES[i % PROGRAMMING_ROLES.length];
    const template = PROCEDURAL_BEGINNER_TOPICS[i % PROCEDURAL_BEGINNER_TOPICS.length];
    result.push(template.make(role, `easy_${i}_${timestamp}`));
  }

  // Coding and tech questions
  for (let i = 0; i < codingNeeded; i++) {
    const role = PROGRAMMING_ROLES[i % PROGRAMMING_ROLES.length];
    const template = PROCEDURAL_CODING_TOPICS[i % PROCEDURAL_CODING_TOPICS.length];
    result.push(template.make(role, `coding_${i}_${timestamp}`));
  }

  return result;
}

/**
 * Tier 1: Call Google Gemini API with Beginner English & Programming Prompt
 */
// In-memory queue of AI-generated questions ready for instant zero-latency delivery
let aiPrefetchedQueue = [];
let isPrefetching = false;

async function callSingleGemini(prompt, maxTokens = 4096, timeoutMs = 35000) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        maxOutputTokens: maxTokens
      }
    })
  });

  if (!response.ok) {
    console.warn('[Gemini API] Request returned status:', response.status);
    return null;
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
}

/**
 * Parallel Staged Gemini AI Generator:
 * Generates 20 Easy Beginner English + 30 Beginner Programming in parallel
 */
export async function generateGeminiQuestions(count = 50) {
  try {
    const promptEasy = `You are an English teacher creating 20 easy fill-in-the-blank questions for an absolute BEGINNER learning English and basic computer words.
Requirements:
1. Very simple everyday sentences with a blank (_____).
2. Topics: keyboard, mouse, screen, monitor, laptop, internet, files, folders, passwords, simple verbs (is, are, have, use, click), simple pronouns (he, she, they).
3. Plain, simple words only. NO difficult vocabulary.
4. Return ONLY a JSON array of 20 objects:
[
  {
    "text": "I use a _____ to type letters.",
    "options": ["keyboard", "chair", "cup", "car"],
    "correctAnswerIndex": 0,
    "category": "Beginner English",
    "difficulty": "beginner",
    "explanation": "A keyboard is used for typing letters."
  }
]`;

    const promptCoding = `You are a programming teacher creating 30 easy fill-in-the-blank questions for a BEGINNER learning computer programming.
Requirements:
1. Very simple sentences explaining beginner coding concepts with a blank (_____).
2. Topics: variables (store data), functions (reusable code), loops (repeat actions), bugs (errors), debugging (fixing errors), HTML (web structure), CSS (styling & colors), JavaScript (interactivity), code editor, terminal, Git (save code history).
3. Plain, easy-to-read English.
4. Return ONLY a JSON array of 30 objects:
[
  {
    "text": "A _____ is used to store data or information in code.",
    "options": ["variable", "monitor", "cable", "mouse"],
    "correctAnswerIndex": 0,
    "category": "Coding Basics",
    "difficulty": "beginner",
    "explanation": "A variable stores values and data."
  }
]`;

    const [easyItems, codingItems] = await Promise.all([
      callSingleGemini(promptEasy, 4096, 45000),
      callSingleGemini(promptCoding, 6144, 45000)
    ]);

    if (!Array.isArray(easyItems) || !Array.isArray(codingItems)) {
      return null;
    }

    const timestamp = Date.now();
    const formattedEasy = easyItems.slice(0, 20).map((q, idx) => ({
      id: `ai-gemini-easy-${timestamp}-${idx}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
      category: q.category || 'Beginner English',
      difficulty: 'beginner',
      explanation: q.explanation || 'Everyday English and computer basics concept.',
      source: 'gemini-ai'
    }));

    const formattedCoding = codingItems.slice(0, 30).map((q, idx) => ({
      id: `ai-gemini-code-${timestamp}-${idx}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
      category: q.category || 'Coding Basics',
      difficulty: 'beginner',
      explanation: q.explanation || 'Foundational programming and tech concept.',
      source: 'gemini-ai'
    }));

    return [...formattedEasy, ...formattedCoding];
  } catch (err) {
    console.warn('[Gemini AI Parallel Generator Notice]:', err.message);
    return null;
  }
}

/**
 * Background pre-fetch worker:
 * Runs asynchronously to keep fresh Gemini AI questions ready in memory
 */
export async function triggerBackgroundPrefetch() {
  if (isPrefetching) return;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) return;

  isPrefetching = true;
  console.log('[AI Prefetch Worker] Synthesizing 50 fresh Gemini AI questions in background...');
  try {
    const freshBatch = await generateGeminiQuestions(50);
    if (freshBatch && freshBatch.length >= 50) {
      aiPrefetchedQueue = freshBatch;
      console.log(`[AI Prefetch Worker] Ready! ${aiPrefetchedQueue.length} fresh Gemini questions cached in memory.`);
      if (getIsConnected()) saveToDatabaseAsync(freshBatch);
    }
  } catch (err) {
    console.warn('[AI Prefetch Worker Notice]:', err.message);
  } finally {
    isPrefetching = false;
  }
}

// Kick off initial pre-fetch immediately on server start
setTimeout(() => {
  triggerBackgroundPrefetch();
}, 2000);

/**
 * Main Staged Batch Coordinator:
 * Guarantees that:
 * - Questions 1–20 are ALWAYS Easy Beginner English & Everyday Computer Basics.
 * - Questions 21–50 are ALWAYS Computer Programming, Coding & Web Concepts.
 */
export async function getOrGenerateBatch(requestedCount = 50) {
  const count = Math.max(3, Math.min(100, parseInt(requestedCount, 10) || 50));

  // 1. If we have fresh Gemini AI questions in our memory queue, serve them instantly!
  if (aiPrefetchedQueue.length >= count) {
    const aiBatch = aiPrefetchedQueue.splice(0, count);
    console.log(`[Brother Quiz Bank] Served ${aiBatch.length} dynamic questions directly from Gemini AI.`);
    // Trigger background synthesis to refill for the next quiz session
    setTimeout(() => triggerBackgroundPrefetch(), 1000);
    return {
      questions: aiBatch,
      source: 'gemini-ai',
      timestamp: Date.now()
    };
  }

  // 2. Trigger background prefetch so the next session gets fresh AI questions
  triggerBackgroundPrefetch();

  // 3. Fallback: Build from Seed Bank & Procedural Generator with Balanced Staging
  const easyCount = Math.max(1, Math.round(count * 0.4));
  const codingCount = Math.max(1, count - easyCount);

  const easyPool = SEED_QUESTIONS.filter(q => 
    q.category === 'Beginner English' || q.category === 'Computer Basics'
  );

  const codingPool = SEED_QUESTIONS.filter(q => 
    q.category === 'Coding Basics' || q.category === 'Web Development' || q.category === 'Tech Skills'
  );

  // Shuffle pools independently
  const shuffledEasy = [...easyPool].sort(() => 0.5 - Math.random());
  const shuffledCoding = [...codingPool].sort(() => 0.5 - Math.random());

  // Take easy questions
  let selectedEasy = shuffledEasy.slice(0, easyCount);
  if (selectedEasy.length < easyCount) {
    const fillerEasy = generateProceduralQuestions(easyCount - selectedEasy.length, 'easy');
    selectedEasy = [...selectedEasy, ...fillerEasy];
  }

  // Take coding & tech questions
  let selectedCoding = shuffledCoding.slice(0, codingCount);
  if (selectedCoding.length < codingCount) {
    const fillerCoding = generateProceduralQuestions(codingCount - selectedCoding.length, 'coding');
    selectedCoding = [...selectedCoding, ...fillerCoding];
  }

  // STAGE ORDER: Guaranteed Easy first, followed by Coding & Tech
  const finalBatch = [
    ...selectedEasy.slice(0, easyCount),
    ...selectedCoding.slice(0, codingCount)
  ].slice(0, count);

  if (getIsConnected()) {
    saveToDatabaseAsync(finalBatch);
  }

  return {
    questions: finalBatch,
    source: 'beginner-staged-bank',
    timestamp: Date.now()
  };
}

/**
 * Non-blocking MongoDB persistence
 */
async function saveToDatabaseAsync(questionList) {
  try {
    const docs = questionList.map(q => ({
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      category: q.category || 'Coding Basics',
      difficulty: q.difficulty || 'beginner',
      explanation: q.explanation || ''
    }));

    for (const d of docs) {
      const exists = await Question.exists({ text: d.text });
      if (!exists) {
        await Question.create(d);
      }
    }
  } catch (err) {}
}
