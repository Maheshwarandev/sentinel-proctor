/**
 * Daily Writing Topic Service
 * Provides exactly 1 educational 10-point handwriting topic per calendar day for Module 3.
 * 
 * Features:
 * - Deterministic per calendar day (YYYY-MM-DD): The entire day receives the exact same topic.
 * - Multi-tier synthesis:
 *   1. Google Gemini AI generation (cached for the day)
 *   2. Curated beginner computer & programming topics (8 comprehensive topics)
 * - In-memory and database persistence so topic remains constant throughout the day.
 */

import { getIsConnected } from '../config/db.js';
import mongoose from 'mongoose';

// Optional Mongoose Model for Daily Topic Persistence
const dailyTopicSchema = new mongoose.Schema({
  dateKey: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  points: [{ type: String, required: true }],
  source: { type: String, default: 'curated' },
  createdAt: { type: Date, default: Date.now }
});

export const DailyTopicModel = mongoose.models.DailyTopic || mongoose.model('DailyTopic', dailyTopicSchema);

export const CURATED_WRITING_TOPICS = [
  {
    id: 'topic-comp-basics',
    title: 'How a Computer Works: 10 Fundamental Concepts',
    category: 'Computer Basics',
    description: 'Understand the essential hardware and software components that power modern computers.',
    points: [
      'A computer is an electronic device that takes raw input data, processes it according to instructions, and produces meaningful output.',
      'The Central Processing Unit (CPU) functions as the core brain of the computer, executing billions of calculations every second.',
      'Random Access Memory (RAM) provides super-fast temporary memory for open apps and active files while the machine is on.',
      'Solid State Drives (SSDs) and Hard Drives provide permanent storage where programs and documents remain safe when powered off.',
      'Input devices such as keyboards, mice, and microphones convert human actions into digital signals the computer can process.',
      'Output devices including computer monitors, speakers, and printers convert digital signals back into human-readable visual and audio forms.',
      'An Operating System (such as Microsoft Windows or Linux) manages all system hardware and coordinates software execution.',
      'Software consists of carefully written program instructions that tell the physical hardware components exactly what to do.',
      'Computers internally store and process all information using binary code, which consists exclusively of 1s and 0s.',
      'Regular data backups to external drives or cloud storage protect important files from hardware failure or accidental loss.'
    ]
  },
  {
    id: 'topic-prog-basics',
    title: 'What is Computer Programming: 10 Essential Rules',
    category: 'Programming Basics',
    description: 'Foundational concepts every beginner software developer must learn and practice.',
    points: [
      'Computer programming is the art and discipline of writing step-by-step instructions that a machine can execute.',
      'Programming languages like JavaScript, Python, and C++ translate human-readable logic into binary machine code.',
      'A variable acts as a labeled storage box in memory used to store and manipulate dynamic data values.',
      'Functions are modular, reusable blocks of code designed to perform a specific task without repeating instructions.',
      'Loops allow programmers to repeat an operation hundreds or thousands of times automatically until a condition is met.',
      'Conditional statements like if-else enable computer programs to make intelligent decisions based on incoming data.',
      'A software bug is an error or flaw in program code that causes unexpected behavior or incorrect calculations.',
      'Debugging is the systematic problem-solving process of locating, diagnosing, and fixing mistakes in source code.',
      'Writing clean, readable code with descriptive naming is essential so other developers can easily understand your work.',
      'Consistent daily problem-solving and hands-on practice are the true keys to becoming a proficient software developer.'
    ]
  },
  {
    id: 'topic-web-internet',
    title: 'How the Internet and World Wide Web Work: 10 Core Facts',
    category: 'Internet & Web',
    description: 'Explore the global infrastructure connecting billions of devices and websites.',
    points: [
      'The internet is a vast global network of physical cables, routers, and satellites connecting billions of computers together.',
      'A web browser is a client application (like Chrome or Edge) that requests, retrieves, and displays web pages for users.',
      'A web server is a high-performance computer that hosts website files and serves them across the internet upon request.',
      'Every device connected to the internet is assigned a unique IP address that identifies its location on the network.',
      'The Domain Name System (DNS) functions like a phonebook, translating friendly names like google.com into numeric IP addresses.',
      'HTML (HyperText Markup Language) establishes the raw structural skeleton and content layout of every web page.',
      'CSS (Cascading Style Sheets) controls the visual styling, responsive layouts, colors, and typography of modern websites.',
      'JavaScript brings web pages to life by enabling interactive buttons, dynamic calculations, animations, and live updates.',
      'HTTP and HTTPS are the standard communication protocols used to securely transmit web pages and encrypted data.',
      'Cybersecurity hygiene requires creating complex unique passwords and staying vigilant against suspicious phishing links.'
    ]
  },
  {
    id: 'topic-coder-habits',
    title: '10 Daily Disciplines for a Successful Beginner Programmer',
    category: 'Developer Habits',
    description: 'Practical daily routines to build strong technical skills and disciplined focus.',
    points: [
      'Commit to practicing coding every single day, even for 30 focused minutes, to build muscle memory and sharp intuition.',
      'Carefully read and analyze the problem statement on paper before writing a single line of code in the editor.',
      'Deconstruct complex engineering challenges into small, manageable milestones that can be solved one step at a time.',
      'Never copy and paste code without line-by-line comprehension of its internal mechanics and potential edge cases.',
      'Master touch typing without looking at the keyboard to dramatically boost typing speed, accuracy, and writing flow.',
      'Learn the keyboard shortcuts of modern development tools like VS Code to navigate and edit files with maximum speed.',
      'Adopt version control systems like Git early to track source code history, branch experiments, and prevent data loss.',
      'Treat compiler and terminal error messages as helpful diagnostic guides rather than frustrating roadblocks.',
      'Maintain handwritten study notes in a physical notebook to deepen conceptual understanding and retention.',
      'Stay patient and resilient, recognizing that encountering bugs and debugging them is how great engineers learn.'
    ]
  },
  {
    id: 'topic-data-databases',
    title: 'Understanding Data and Databases: 10 Fundamental Points',
    category: 'Data & Databases',
    description: 'The principles behind structured information, storage systems, and data integrity.',
    points: [
      'Data represents raw facts, numbers, text, and observations collected and structured for automated processing.',
      'Fundamental data types in programming include integers (numbers), strings (text), and booleans (true or false values).',
      'A database is a dedicated software system optimized for safely storing, indexing, and retrieving large volumes of information.',
      'Relational databases (like PostgreSQL and MySQL) store data in structured tables composed of defined rows and columns.',
      'A Primary Key is a unique identifier assigned to each record in a table to ensure data can be precisely retrieved.',
      'Structured Query Language (SQL) is the standard language used by software systems to query, filter, and modify database records.',
      'The acronym CRUD outlines the four foundational database actions: Create, Read, Update, and Delete.',
      'Database normalization organizes information efficiently to eliminate redundant duplicate records and save storage.',
      'Automated database backups protect organizations against catastrophic data loss caused by hardware crashes.',
      'Data security protocols encrypt sensitive records both in transit across networks and at rest inside physical storage.'
    ]
  },
  {
    id: 'topic-web-dev-intro',
    title: 'Introduction to Web Development: 10 Key Building Blocks',
    category: 'Web Development',
    description: 'Learn how modern websites and web applications are designed, built, and launched.',
    points: [
      'Web development is broadly divided into Frontend (what the user sees) and Backend (server data processing).',
      'HTML tags like headings, paragraphs, and buttons form the foundational layout of every website.',
      'CSS Flexbox and CSS Grid allow developers to create modern, responsive layouts that adjust to any screen size.',
      'JavaScript allows web pages to react to user actions such as mouse clicks, keyboard keystrokes, and form submissions.',
      'An Application Programming Interface (API) allows the frontend web page to communicate securely with backend servers.',
      'JSON (JavaScript Object Notation) is the standard lightweight text format used for sending data over the web.',
      'A responsive website adapts seamlessly whether viewed on a desktop monitor, a tablet, or a mobile smartphone.',
      'Modern web developers use browser developer tools (F12) to inspect HTML elements and debug JavaScript in real time.',
      'Web accessibility standards ensure that websites can be comfortably navigated by people of all abilities.',
      'Deploying a website means hosting its files on an internet-connected server so anyone around the world can visit it.'
    ]
  },
  {
    id: 'topic-algorithms-logic',
    title: 'Algorithms and Problem-Solving: 10 Core Rules for Beginners',
    category: 'Computational Thinking',
    description: 'Master the logical thinking process required to solve technical problems efficiently.',
    points: [
      'An algorithm is a clear, finite sequence of step-by-step instructions designed to solve a specific problem.',
      'Writing pseudocode or drawing flowcharts on paper helps clarify your logic before writing actual code.',
      'Breaking a large, difficult problem down into smaller sub-problems is called modular problem decomposition.',
      'Sorting algorithms arrange data elements in a meaningful order, such as alphabetical or ascending numerical order.',
      'Search algorithms locate specific pieces of target information quickly within large collections of data.',
      'Algorithm efficiency measures how execution time and computer memory usage scale as the input size grows.',
      'Always consider edge cases, such as handling empty inputs, negative numbers, or unexpected user keystrokes.',
      'Dry running your code on paper by tracing variable values step-by-step helps catch logical bugs early.',
      'Refactoring is the practice of restructuring existing code to make it cleaner and more efficient without changing its behavior.',
      'Patience and methodical thinking are far more valuable than rushing to write hasty, error-prone code.'
    ]
  },
  {
    id: 'topic-dev-tools',
    title: 'Essential Developer Tools: 10 Tools Every Coder Must Know',
    category: 'Developer Tools',
    description: 'Master the everyday software workbench used by professional computer programmers.',
    points: [
      'A Code Editor (such as Visual Studio Code) provides syntax highlighting, auto-completion, and file management.',
      'The Command Line Terminal allows developers to control their operating system quickly using text commands.',
      'Git is an industry-standard version control system that records every change made to your project codebase.',
      'GitHub is a cloud platform that hosts Git repositories, enabling collaboration, backups, and portfolio sharing.',
      'Package managers (like npm or pip) allow developers to easily install and update open-source code libraries.',
      'Linters automatically scan your source code to detect formatting errors, syntax typos, and bad coding habits.',
      'Debuggers allow you to pause program execution at breakpoints to inspect live variable values and memory states.',
      'Browser Developer Tools let developers test CSS styles, monitor network API requests, and inspect console logs.',
      'Documentation sites (like MDN Web Docs) provide official reference manuals and code examples for programming languages.',
      'Cloud storage and automated backups guarantee that your valuable project code is never lost to hardware damage.'
    ]
  }
];

// In-memory daily cache: { [dateKey: string]: topicObject }
const memoryTopicCache = new Map();

/**
 * Deterministic hash from date string (YYYY-MM-DD)
 */
function getDateHash(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Synthesize a fresh 10-point topic for the day using Google Gemini AI
 */
async function generateDailyTopicWithGemini(dateKey) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    return null;
  }

  const prompt = `You are a computer science and English educator creating a 10-point handwritten study assignment for an absolute BEGINNER student.
Current Date: ${dateKey}.

Generate ONE daily educational topic tailored for a beginner learning computers and programming.
Topic domains to choose from:
- Computer Basics & Hardware
- Foundational Programming Principles
- How the Internet and Web Work
- Essential Developer Habits & Disciplines
- Data, Databases, and Storage
- Algorithms, Logic & Problem Solving
- Essential Developer Tools (Code Editors, Git, Terminal)

Requirements:
1. "title": A clear, engaging topic title stating 10 points (e.g. "How Operating Systems Work: 10 Fundamental Points").
2. "category": A concise category label (e.g. "Operating Systems", "Programming Basics", "Computer Hardware").
3. "description": 1-2 friendly sentences explaining what the candidate will learn.
4. "points": An array of EXACTLY 10 numbered points.
   - Each point must be written in plain, simple, easy-to-read English (no obscure or difficult vocabulary).
   - Each point must be 1 to 2 clear sentences.
   - Formatted so a beginner can comfortably write all 10 points on a physical notebook sheet with a pen.

Return ONLY valid JSON matching this schema:
{
  "title": "Topic Title Here: 10 Key Concepts",
  "category": "Category Here",
  "description": "Short explanation of the topic.",
  "points": [
    "Point 1 text...",
    "Point 2 text...",
    "Point 3 text...",
    "Point 4 text...",
    "Point 5 text...",
    "Point 6 text...",
    "Point 7 text...",
    "Point 8 text...",
    "Point 9 text...",
    "Point 10 text..."
  ]
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          responseMimeType: 'application/json',
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      console.warn(`[Daily Topic Gemini API] Returned status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (parsed && parsed.title && Array.isArray(parsed.points) && parsed.points.length >= 10) {
      return {
        id: `ai-gemini-topic-${dateKey}`,
        dateKey,
        title: parsed.title,
        category: parsed.category || 'Computer Basics',
        description: parsed.description || 'Educational handwritten study topic.',
        points: parsed.points.slice(0, 10),
        source: 'gemini-ai',
        isDailyFixed: true
      };
    }
    return null;
  } catch (err) {
    console.warn(`[Daily Topic Gemini Notice] ${err.message}`);
    return null;
  }
}

/**
 * Get or create the single 10-point topic for a specific calendar day
 * @param {string} dateKey - 'YYYY-MM-DD'
 */
export async function getDailyTopicForDate(dateKey) {
  const normalizedDateKey = dateKey || new Date().toISOString().split('T')[0];

  // 1. Check in-memory cache for today's topic
  if (memoryTopicCache.has(normalizedDateKey)) {
    return memoryTopicCache.get(normalizedDateKey);
  }

  // 2. Check MongoDB if connected
  if (getIsConnected()) {
    try {
      const existingDoc = await DailyTopicModel.findOne({ dateKey: normalizedDateKey }).lean();
      if (existingDoc) {
        const topic = {
          id: `topic-${existingDoc.dateKey}`,
          dateKey: existingDoc.dateKey,
          title: existingDoc.title,
          category: existingDoc.category,
          description: existingDoc.description,
          points: existingDoc.points,
          source: existingDoc.source || 'database',
          isDailyFixed: true
        };
        memoryTopicCache.set(normalizedDateKey, topic);
        return topic;
      }
    } catch (e) {
      console.warn('[Daily Topic DB check]:', e.message);
    }
  }

  // 3. Try generating fresh daily topic with Gemini AI
  const aiTopic = await generateDailyTopicWithGemini(normalizedDateKey);
  if (aiTopic) {
    memoryTopicCache.set(normalizedDateKey, aiTopic);
    if (getIsConnected()) {
      try {
        await DailyTopicModel.create(aiTopic);
      } catch (e) {}
    }
    return aiTopic;
  }

  // 4. Deterministic fallback from curated beginner topics
  const hash = getDateHash(normalizedDateKey);
  const topicIdx = hash % CURATED_WRITING_TOPICS.length;
  const baseCurated = CURATED_WRITING_TOPICS[topicIdx];

  const fallbackTopic = {
    ...baseCurated,
    id: `curated-${normalizedDateKey}`,
    dateKey: normalizedDateKey,
    source: 'curated-daily',
    isDailyFixed: true
  };

  memoryTopicCache.set(normalizedDateKey, fallbackTopic);

  if (getIsConnected()) {
    try {
      await DailyTopicModel.create(fallbackTopic);
    } catch (e) {}
  }

  return fallbackTopic;
}
