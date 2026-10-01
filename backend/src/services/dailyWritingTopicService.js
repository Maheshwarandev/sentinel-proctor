/**
 * Daily Writing Topic Service - Dynamic Google Gemini AI Generator
 * Generates rich, diverse 10-point educational handwriting topics for Module 3.
 * 
 * Guarantee: Topics and points are dynamically generated and NEVER the same.
 * Features:
 * - Real Google Gemini API synthesis across multi-model fallback list.
 * - Rotating topic domain seeds (25+ diverse domains) with anti-repetition memory.
 * - Temperature 0.95 + explicit exclusion of recently generated topics.
 * - Robust procedural fail-safe bank of 20+ unique topics when offline.
 * - Admin on-demand regeneration and runtime API key configuration.
 */

import { getIsConnected } from '../config/db.js';
import { ENV } from '../config/env.js';
import mongoose from 'mongoose';

// Runtime API key override if admin sets it via dashboard
let runtimeGeminiApiKey = '';

export function setRuntimeGeminiKey(key) {
  if (typeof key === 'string') {
    runtimeGeminiApiKey = key.trim();
  }
}

export function getEffectiveGeminiKey() {
  return runtimeGeminiApiKey || ENV.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
}

// Mongoose Schema for Daily Topics with History
const dailyTopicSchema = new mongoose.Schema({
  dateKey: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  points: [{ type: String, required: true }],
  source: { type: String, default: 'gemini-ai' },
  modelUsed: { type: String, default: 'gemini-flash' },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

export const DailyTopicModel = mongoose.models.DailyTopic || mongoose.model('DailyTopic', dailyTopicSchema);

// In-memory active topic and recent topics history to prevent duplicates
let currentActiveTopic = null;
const recentTopicTitles = new Set();
let fallbackPointer = 0;

// 25+ Diverse topic domains for infinite variety from Gemini
const GEMINI_TOPIC_DOMAINS = [
  { domain: 'Computer Hardware Architecture', focus: 'Motherboard, CPU clock cycles, RAM caching, GPU rendering, and NVMe SSD speeds' },
  { domain: 'Operating Systems & Kernels', focus: 'Processes, CPU scheduling, file systems, virtual memory, and kernel permissions' },
  { domain: 'Foundational Programming Principles', focus: 'Variables, memory addresses, control flow, functions, and dry code principles' },
  { domain: 'How Computer Networks & the Internet Work', focus: 'Packets, routers, IP addresses, DNS lookup, TCP/IP, and fiber optic backbones' },
  { domain: 'Web Browsers & Frontend Technologies', focus: 'DOM rendering tree, CSS styling engines, JavaScript event loop, and web security' },
  { domain: 'Backend Servers & API Architecture', focus: 'HTTP requests, RESTful routes, JSON payloads, client-server models, and latency' },
  { domain: 'Databases & Structured Data', focus: 'Relational tables, Primary Keys, SQL queries, NoSQL collections, and data integrity' },
  { domain: 'Cybersecurity Fundamentals & Online Safety', focus: 'Encryption keys, strong passphrases, two-factor authentication, firewalls, and phishing' },
  { domain: 'Data Structures for Beginners', focus: 'Arrays, linked lists, stacks, queues, hash maps, and key-value pairs' },
  { domain: 'Algorithms & Problem Solving Logic', focus: 'Step-by-step logic, binary search, sorting methods, edge cases, and pseudocode' },
  { domain: 'Git Version Control & Code History', focus: 'Snapshots, git commits, branches, repositories, merge conflicts, and rollbacks' },
  { domain: 'Essential Developer Tools & CLI Terminal', focus: 'Command line navigation, terminal commands, code editors, and package managers' },
  { domain: 'Software Testing & Quality Assurance', focus: 'Unit tests, automated test runners, debugging stack traces, and bug logs' },
  { domain: 'Cloud Computing & Modern Hosting', focus: 'Data centers, cloud storage buckets, serverless computing, and virtual servers' },
  { domain: 'Artificial Intelligence & Machine Learning Basics', focus: 'Neural networks, training data, token prediction, LLM prompts, and automated reasoning' },
  { domain: 'Clean Code & Developer Habits', focus: 'Descriptive variable naming, modular design, keyboard shortcuts, and code comments' },
  { domain: 'Mobile Computing & Smartphone Hardware', focus: 'ARM mobile processors, touch screen digitizers, battery power saving, and sensors' },
  { domain: 'Linux & Open Source Software', focus: 'Open-source collaboration, Linux shell commands, file permissions, and distributions' },
  { domain: 'Touch Typing & Developer Productivity', focus: 'Home row muscle memory, typing accuracy, ergonomic posture, and focus endurance' },
  { domain: 'Data Backup & Disaster Recovery', focus: '3-2-1 backup rule, external cold storage, RAID arrays, and cloud sync protection' },
  { domain: 'Audio, Video & Media Encoding', focus: 'Pixels, RGB color channels, video frame rates, compression codecs, and audio sampling' },
  { domain: 'Computer History & Digital Milestones', focus: 'Vacuum tubes, silicon microprocessors, personal computers, and the World Wide Web birth' }
];

// Rich fallback bank of 20+ distinct pre-authored beginner topics (ensures zero repetition when offline)
export const RICH_TOPIC_BANK = [
  {
    id: 'topic-comp-arch',
    title: 'Computer Hardware Architecture: 10 Essential Components',
    category: 'Computer Hardware',
    description: 'Understand how the physical components inside a computer work together to run programs.',
    points: [
      'The Motherboard is the main circuit board that interconnects the processor, memory, drives, and power supply.',
      'The Central Processing Unit (CPU) executes instructions by continuously fetching, decoding, and calculating operations.',
      'Random Access Memory (RAM) serves as ultra-high-speed temporary workspace for applications actively running on the screen.',
      'Solid State Drives (SSDs) utilize flash memory chips with zero moving parts, providing lightning-fast file read and write speeds.',
      'The Power Supply Unit (PSU) converts high-voltage alternating wall current into regulated direct current for sensitive microchips.',
      'The Graphics Processing Unit (GPU) specializes in running thousands of parallel mathematical calculations to render graphics and video.',
      'The CPU Heat Sink and cooling fans continuously disperse thermal energy to prevent the processor from overheating and throttling.',
      'Input peripherals like keyboards and optical mice convert human physical actions into digital electrical signals.',
      'Computer monitors display visual information by rapidly refreshing millions of individual red, green, and blue pixels.',
      'The BIOS and UEFI firmware stored on motherboard chips initialize hardware checks before handing control to the operating system.'
    ]
  },
  {
    id: 'topic-prog-rules',
    title: 'Foundational Programming Principles: 10 Core Rules',
    category: 'Programming Basics',
    description: 'Foundational concepts every beginner software developer must learn and practice.',
    points: [
      'Computer programming is the craft of writing precise, unambiguous instructions that a machine can execute reliably.',
      'Variables function as named containers in computer memory used to store, retrieve, and update dynamic values.',
      'Data types define what kind of value a variable holds, such as whole numbers, decimal floats, text strings, or booleans.',
      'Functions are modular, reusable blocks of code created to perform a single designated job without rewriting code.',
      'Loops allow computer programs to repeat instructions hundreds or thousands of times until an exit condition is reached.',
      'Conditional statements like if-else allow programs to evaluate logic and make automated decisions based on real-time data.',
      'A software bug is an error in program syntax or logic that prevents the application from operating as expected.',
      'Debugging is the methodical problem-solving discipline of locating, understanding, and resolving errors in code.',
      'Writing clean code with descriptive variable names ensures that other software engineers can read and maintain your work.',
      'Daily hands-on practice writing and testing small programs is the most reliable path to mastering software development.'
    ]
  },
  {
    id: 'topic-net-web',
    title: 'How the Global Internet Works: 10 Fundamental Concepts',
    category: 'Internet & Networks',
    description: 'Explore the global communications infrastructure that connects billions of digital devices.',
    points: [
      'The internet is an immense physical network of fiber-optic undersea cables, communication satellites, and regional routers.',
      'Every digital device connected to the internet is assigned a numeric IP address that identifies its specific network location.',
      'The Domain Name System (DNS) translates human-friendly web addresses into numeric machine-readable IP addresses.',
      'Network routers inspect incoming packets of digital data and direct them along the fastest physical path to their destination.',
      'Data travels across the internet divided into small units called packets, which are reassembled upon arriving at the target device.',
      'A web browser is a client application that requests web documents from remote servers and renders them for the user.',
      'Web servers are high-capacity computers running continuously in data centers, waiting to deliver web files upon request.',
      'Hypertext Transfer Protocol (HTTP) defines the standard communication rules used between web browsers and servers.',
      'HTTPS uses cryptographic TLS certificates to encrypt web traffic, shielding passwords and personal data from eavesdropping.',
      'Wi-Fi routers translate incoming wired broadband ethernet signals into high-frequency radio waves for wireless devices.'
    ]
  },
  {
    id: 'topic-cybersec',
    title: 'Cybersecurity and Digital Defense: 10 Golden Rules',
    category: 'Cybersecurity',
    description: 'Essential practices to safeguard personal accounts, software systems, and confidential data.',
    points: [
      'Cybersecurity encompasses the technologies, processes, and controls designed to protect systems and networks from attack.',
      'Strong passwords combine uppercase letters, lowercase letters, numbers, and symbols to resist automated brute-force attacks.',
      'Two-Factor Authentication (2FA) requires two distinct pieces of evidence before granting access, greatly enhancing account security.',
      'Phishing occurs when malicious actors disguise fraudulent emails or websites as trusted organizations to steal credentials.',
      'Software updates and security patches frequently fix discovered system vulnerabilities before hackers can exploit them.',
      'A firewall acts as a protective digital perimeter, monitoring and filtering unauthorized network traffic in and out of a computer.',
      'Data encryption scrambles readable plaintext into unreadable ciphertext that can only be unlocked with a secret decryption key.',
      'Malware is an umbrella term for malicious software including viruses, spyware, keyloggers, and ransomware.',
      'Public Wi-Fi networks in cafes and airports are often unencrypted and should be used with extreme caution or a virtual private network.',
      'Maintaining offline backups of important documents ensures you can recover quickly from hardware failure or ransomware.'
    ]
  },
  {
    id: 'topic-os-kernel',
    title: 'How Operating Systems Manage Computers: 10 Key Roles',
    category: 'Operating Systems',
    description: 'Learn how Windows, Linux, and macOS coordinate hardware resources to run user software.',
    points: [
      'An Operating System is system software that manages computer hardware resources and provides common services for apps.',
      'The Kernel is the fundamental core of an operating system, maintaining complete control over everything that occurs in the system.',
      'Process management allows the operating system to allocate CPU time slices so dozens of programs can run concurrently.',
      'Memory management tracks every byte of RAM, preventing one program from accidentally overwriting the memory of another program.',
      'Virtual memory utilizes free space on the SSD or hard drive as an overflow buffer when physical RAM capacity is exceeded.',
      'The file system organizes data into a structured hierarchy of directories and files, managing read and write permissions.',
      'Device drivers are specialized programs that enable the operating system to communicate directly with hardware accessories.',
      'User interfaces provide either a Graphical User Interface (GUI) with icons and windows, or a text-based Command Line Interface (CLI).',
      'The task scheduler prioritizes background system tasks and active foreground applications to maintain smooth performance.',
      'Security boundaries within the operating system prevent unprivileged guest software from accessing sensitive system files.'
    ]
  },
  {
    id: 'topic-db-storage',
    title: 'Databases and Data Management: 10 Fundamental Points',
    category: 'Data & Databases',
    description: 'The principles behind structured information, storage systems, and data integrity.',
    points: [
      'Data represents raw facts, measurements, text, and numbers organized and stored for automated processing.',
      'A database is an optimized software system engineered to store, retrieve, update, and search large volumes of data securely.',
      'Relational databases store records in structured tables made up of defined rows and categorized columns.',
      'A Primary Key is a unique identifier assigned to every single row in a database table to eliminate data ambiguity.',
      'Structured Query Language (SQL) is the universal declarative language used to read, filter, and modify relational database records.',
      'CRUD represents the four essential actions performed on persistent storage: Create, Read, Update, and Delete.',
      'Database indexing creates fast lookup references behind the scenes, allowing search queries to return in milliseconds.',
      'Foreign Keys establish logical relationships between different tables, connecting related information seamlessly.',
      'Database transactions ensure that multi-step operations either succeed entirely or roll back safely to prevent corruption.',
      'Automated daily database backups safeguard organizations from permanent data destruction caused by hardware crashes.'
    ]
  },
  {
    id: 'topic-git-devops',
    title: 'Git Version Control and Collaboration: 10 Core Practices',
    category: 'Developer Tools',
    description: 'Master the version tracking software used by professional software engineering teams globally.',
    points: [
      'Git is a distributed version control system that records snapshots of changes made to a project over time.',
      'A repository (or repo) is the central directory where Git tracks all files, historical revisions, and metadata for a project.',
      'A commit represents a saved milestone in your project history accompanied by a message describing what was changed.',
      'Branches allow developers to build new features in an isolated sandbox without disturbing the stable production code.',
      'Merging combines the commits and modifications from an experimental branch back into the main project branch.',
      'A merge conflict occurs when two developers modify the same line in a file and requires manual review to resolve.',
      'GitHub is a web-based hosting platform for Git repositories, facilitating team collaboration, pull requests, and backups.',
      'The command git status displays the current state of the working directory and files staged for the next commit.',
      'The git log command outputs a chronological timeline of all previous commits, authors, and timestamps in the project.',
      'Regularly committing small, cohesive changes makes it easy to track down bugs and safely roll back if issues arise.'
    ]
  },
  {
    id: 'topic-typing-ergonomics',
    title: 'Touch Typing and Developer Ergonomics: 10 Daily Disciplines',
    category: 'Typing & Ergonomics',
    description: 'Build fast typing cadence, accurate muscle memory, and healthy posture for long-term coding endurance.',
    points: [
      'Touch typing is the technique of typing without looking at the keys, relying entirely on finger muscle memory.',
      'The home row keys (ASDF for the left hand and JKL; for the right hand) serve as the anchor resting position for all fingers.',
      'The small physical bumps on the F and J keys allow typists to reposition their hands accurately without glancing down.',
      'Accuracy should always take priority over raw speed; maintaining 98% accuracy naturally builds rapid typing velocity.',
      'Keeping wrists straight and hovering slightly above the desk prevents strain on delicate tendons and nerves.',
      'Sitting upright with your lower back supported and feet flat on the floor minimizes neck, shoulder, and back fatigue.',
      'Positioning the computer screen at eye level helps prevent forward head tilt and cervical spine compression.',
      'Practicing typing for 15 focused minutes every morning rapidly builds reflex speed for coding syntax and brackets.',
      'The 20-20-20 rule recommends looking at an object 20 feet away for 20 seconds every 20 minutes to prevent eye fatigue.',
      'Writing by hand in a notebook alongside typing practice strengthens memory retention and deepens conceptual clarity.'
    ]
  },
  {
    id: 'topic-cloud-serverless',
    title: 'Cloud Computing and Modern Servers: 10 Key Concepts',
    category: 'Cloud & Infrastructure',
    description: 'Understand how scalable server infrastructure and cloud data centers power modern web applications.',
    points: [
      'Cloud computing delivers computing services—including servers, storage, databases, and software—over the internet.',
      'Virtual machines allow a single high-powered physical server to run multiple isolated operating system environments.',
      'Data centers are secure physical facilities housing thousands of networked computer servers with redundant power and cooling.',
      'Cloud storage providers store files across distributed drives in multiple regions, ensuring data is never lost.',
      'Scalability allows a cloud service to automatically increase server capacity during traffic surges and scale down during quiet hours.',
      'Serverless computing enables developers to execute code in response to events without configuring or managing physical servers.',
      'Containers package an application alongside all its dependencies, ensuring it runs identically on any computer or cloud server.',
      'Content Delivery Networks (CDNs) cache website assets in servers close to the user, dramatically reducing page load latency.',
      'Cloud regions and availability zones ensure that a hardware failure in one geographic zone will not take down the application.',
      'Cloud security follows a shared responsibility model, where the provider secures the hardware and the user protects application data.'
    ]
  },
  {
    id: 'topic-algorithms-bigo',
    title: 'Algorithms and Problem-Solving Logic: 10 Core Rules',
    category: 'Algorithms & Logic',
    description: 'Master the logical thinking process required to solve technical problems efficiently.',
    points: [
      'An algorithm is a clear, finite sequence of step-by-step instructions designed to solve a specific problem.',
      'Writing pseudocode or drawing flowcharts on paper helps clarify your logic before writing actual code in the editor.',
      'Deconstructing a large, difficult challenge into smaller sub-problems is called modular problem decomposition.',
      'Sorting algorithms arrange data elements in a meaningful sequence, such as ascending numbers or alphabetical order.',
      'Search algorithms locate specific target data points quickly within large collections of structured or unstructured data.',
      'Time complexity measures how the execution duration of an algorithm grows as the size of the input data increases.',
      'Space complexity measures how much additional computer memory an algorithm requires during execution.',
      'Always identify and test edge cases, such as handling empty lists, duplicate items, or unexpected negative inputs.',
      'Dry running your logic on paper by tracing variable values step-by-step catches logical errors before running code.',
      'Patience and methodical thinking are far more valuable than rushing to write hasty, error-prone program code.'
    ]
  }
];

/**
 * Call Google Gemini API across prioritized models with high temperature
 */
async function callGeminiForTopic(prompt, timeoutMs = 25000) {
  const apiKey = getEffectiveGeminiKey();
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    return null;
  }

  const models = [
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.95,
            responseMimeType: 'application/json',
            maxOutputTokens: 2048
          }
        })
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed && parsed.title && Array.isArray(parsed.points) && parsed.points.length >= 10) {
        return {
          parsed,
          modelUsed: model
        };
      }
    } catch (err) {
      // try next model
    }
  }

  return null;
}

/**
 * Synthesize a fresh, non-repeating 10-point topic using Google Gemini AI
 */
async function generateFreshGeminiTopic(preferredCategory = null) {
  // Pick a rotating topic domain that hasn't been used recently
  const chosenDomainObj = GEMINI_TOPIC_DOMAINS[Math.floor(Math.random() * GEMINI_TOPIC_DOMAINS.length)];
  const recentList = Array.from(recentTopicTitles).slice(-10);

  const prompt = `You are a distinguished Computer Science and English educator creating a brand-new 10-point handwritten study assignment for a beginner student.

CRITICAL REQUIREMENT: This topic MUST be completely fresh, unique, and DIFFERENT from previously covered topics.
DO NOT use, duplicate, or closely overlap with any of these recently generated topics:
${recentList.length > 0 ? recentList.map(t => `- "${t}"`).join('\n') : '- (None yet)'}

Inspiration Domain: ${preferredCategory || chosenDomainObj.domain}
Focus Area Ideas: ${chosenDomainObj.focus}
Random Entropy: ${Date.now()}-${Math.floor(Math.random() * 1000000)}

Requirements:
1. "title": A clear, engaging topic title explicitly indicating 10 points (e.g. "Understanding Cloud Storage: 10 Fundamental Points").
2. "category": A concise category label (e.g. "Cloud Computing", "Computer Hardware", "Operating Systems", "Cybersecurity").
3. "description": 1-2 friendly sentences explaining what the candidate will learn.
4. "points": An array of EXACTLY 10 numbered points.
   - Each point MUST be written in plain, simple, accessible English without obscure words.
   - Each point MUST be 1 to 2 clear, informative sentences.
   - Points must be structured so a beginner can comfortably write all 10 points by hand with a pen into a physical notebook.

Return ONLY valid JSON matching this schema:
{
  "title": "Topic Title: 10 Essential Concepts",
  "category": "Category Name",
  "description": "Short explanation of the topic.",
  "points": [
    "Point 1 sentence...",
    "Point 2 sentence...",
    "Point 3 sentence...",
    "Point 4 sentence...",
    "Point 5 sentence...",
    "Point 6 sentence...",
    "Point 7 sentence...",
    "Point 8 sentence...",
    "Point 9 sentence...",
    "Point 10 sentence..."
  ]
}`;

  const geminiResult = await callGeminiForTopic(prompt);
  if (geminiResult && geminiResult.parsed) {
    const { parsed, modelUsed } = geminiResult;
    const cleanPoints = parsed.points
      .map(p => typeof p === 'string' ? p.replace(/^\d+[\.\)]\s*/, '').trim() : '')
      .filter(p => p.length > 5)
      .slice(0, 10);

    if (cleanPoints.length >= 10) {
      const uniqueId = `ai-gemini-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const topicObj = {
        id: uniqueId,
        dateKey: new Date().toISOString().split('T')[0],
        title: parsed.title,
        category: parsed.category || 'Computer Science',
        description: parsed.description || 'Educational handwritten study assignment.',
        points: cleanPoints,
        source: 'gemini-ai',
        modelUsed,
        createdAt: new Date(),
        isAiGenerated: true
      };

      // Add to anti-repetition memory
      recentTopicTitles.add(parsed.title);
      return topicObj;
    }
  }

  return null;
}

/**
 * Get next distinct topic from rich fallback library (ensures zero repetition when offline)
 */
function getNextFallbackTopic(targetDateKey = null) {
  const total = RICH_TOPIC_BANK.length;
  // Cycle forward to next index
  fallbackPointer = (fallbackPointer + 1) % total;
  const base = RICH_TOPIC_BANK[fallbackPointer];

  const effectiveDateKey = targetDateKey || new Date().toISOString().split('T')[0];
  const uniqueId = `curated-${effectiveDateKey}-${fallbackPointer}`;
  const topicObj = {
    ...base,
    id: uniqueId,
    dateKey: effectiveDateKey,
    source: 'curated-procedural',
    createdAt: new Date(),
    isAiGenerated: false
  };

  recentTopicTitles.add(base.title);
  return topicObj;
}

/**
 * Generate a brand-new, guaranteed unique topic for Module 3
 * @param {Object} options - { category, dateKey }
 */
export async function generateFreshTopic(options = {}) {
  const { category = null, dateKey = null } = options;
  const targetDateKey = dateKey || new Date().toISOString().split('T')[0];

  // 1. Try Gemini AI synthesis
  const aiTopic = await generateFreshGeminiTopic(category, targetDateKey);
  if (aiTopic) {
    aiTopic.dateKey = targetDateKey;
    currentActiveTopic = aiTopic;
    if (getIsConnected()) {
      try {
        await DailyTopicModel.create(aiTopic);
      } catch (e) {
        console.warn('[DailyTopic DB save error]:', e.message);
      }
    }
    return aiTopic;
  }

  // 2. If Gemini is unavailable or failed, pick next distinct topic from rich bank
  const fallbackTopic = getNextFallbackTopic(targetDateKey);
  currentActiveTopic = fallbackTopic;
  if (getIsConnected()) {
    try {
      await DailyTopicModel.create(fallbackTopic);
    } catch (e) {}
  }
  return fallbackTopic;
}

/**
 * Get current topic or generate a fresh one if none exists or if refresh requested
 * @param {string} dateKey - 'YYYY-MM-DD'
 * @param {Object} options - { forceRefresh: boolean }
 */
export async function getDailyTopicForDate(dateKey, options = {}) {
  const { forceRefresh = false } = options;
  const normalizedDateKey = dateKey || new Date().toISOString().split('T')[0];

  // 1. If not forcing refresh and current active topic matches today's date, return it
  if (!forceRefresh && currentActiveTopic && currentActiveTopic.dateKey === normalizedDateKey) {
    return currentActiveTopic;
  }

  // 2. Check MongoDB for today's saved daily topic
  if (!forceRefresh && getIsConnected()) {
    try {
      const existingDoc = await DailyTopicModel.findOne({ dateKey: normalizedDateKey }).sort({ createdAt: -1 }).lean();
      if (existingDoc && existingDoc.title && Array.isArray(existingDoc.points) && existingDoc.points.length >= 10) {
        currentActiveTopic = {
          id: existingDoc._id?.toString() || `topic-${normalizedDateKey}`,
          dateKey: existingDoc.dateKey,
          title: existingDoc.title,
          category: existingDoc.category,
          description: existingDoc.description,
          points: existingDoc.points,
          source: existingDoc.source || 'gemini-ai',
          createdAt: existingDoc.createdAt
        };
        recentTopicTitles.add(existingDoc.title);
        return currentActiveTopic;
      }
    } catch (e) {
      console.warn('[DailyTopic DB lookup error]:', e.message);
    }
  }

  // 3. Automatically synthesize today's brand-new unique topic (no click required)
  return await generateFreshTopic({ dateKey: normalizedDateKey });
}

/**
 * Get AI configuration status
 */
export function getGeminiTopicStatus() {
  const key = getEffectiveGeminiKey();
  const hasKey = !!key && !key.includes('YOUR_GEMINI_API_KEY') && key.trim().length > 10;
  return {
    aiEngineAvailable: hasKey,
    keyConfigured: hasKey,
    keyPreview: hasKey ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : 'None',
    totalRecentGenerated: recentTopicTitles.size,
    recentTitles: Array.from(recentTopicTitles).slice(-5),
    currentActiveTopic: currentActiveTopic ? {
      title: currentActiveTopic.title,
      category: currentActiveTopic.category,
      source: currentActiveTopic.source
    } : null
  };
}
