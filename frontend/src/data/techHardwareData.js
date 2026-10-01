// ============================================================================
// MODULE 4: TECHNOLOGY & HARDWARE (SIMPLIFIED FOR FRESHMEN)
// Simple, friendly analogies. No confusing jargon or long paragraphs.
// ============================================================================

// ----------------------------------------------------------------------------
// 1. THE RESTAURANT KITCHEN (SIMPLE & CLEAR)
// ----------------------------------------------------------------------------
export const KITCHEN_ANALOGY_COMPONENTS = [
  {
    id: "chef-cpu",
    roleName: "The Chef",
    techName: "CPU (Processor)",
    shortName: "CPU",
    emoji: "👨‍🍳",
    badge: "The Brain",
    simpleRole: "The master cook who does all the thinking.",
    whatItDoes: "Every time you click, type, or open an app, the Chef cooks the meal. A faster Chef means everything opens and runs quicker.",
    collegeTip: "When your laptop gets warm or fans spin, the Chef is cooking heavy orders.",
    image: "/hardware/cpu.jpg"
  },
  {
    id: "countertop-ram",
    roleName: "The Countertop",
    techName: "RAM (Memory)",
    shortName: "RAM",
    emoji: "🪵",
    badge: "Active Workspace (Temporary)",
    simpleRole: "The kitchen table holding your open apps.",
    whatItDoes: "Holds apps currently open on your screen (Chrome tabs, Spotify, Word). Bigger countertop = you can open 20 tabs without freezing.",
    collegeTip: "⚠️ Turning off the laptop wipes the countertop clean! Always save your work.",
    image: "/hardware/ram.jpg"
  },
  {
    id: "pantry-ssd",
    roleName: "The Pantry",
    techName: "SSD / Hard Drive (Storage)",
    shortName: "SSD / Storage",
    emoji: "🥫",
    badge: "Permanent Storage (Safe)",
    simpleRole: "The cupboards that keep files safe forever.",
    whatItDoes: "Where your files, photos, games, and Windows stay permanently safe, even when the computer is turned off.",
    collegeTip: "Pressing 'Ctrl + S' moves your paper from the countertop into the safe pantry.",
    image: "/hardware/ssd.jpg"
  },
  {
    id: "waiter-motherboard",
    roleName: "The Waiter",
    techName: "Motherboard",
    shortName: "Motherboard",
    emoji: "🧑‍🍳",
    badge: "The Messenger",
    simpleRole: "Connects all parts and delivers data.",
    whatItDoes: "The big circuit board connecting everything. Carries files from the pantry to the countertop and feeds instructions to the Chef.",
    collegeTip: "Plugging in your USB charger or headphones connects you directly to the Waiter.",
    image: "/hardware/motherboard.jpg"
  },
  {
    id: "sous-chef-gpu",
    roleName: "The Sous-Chef",
    techName: "GPU (Graphics Card)",
    shortName: "GPU",
    emoji: "🎨",
    badge: "Screen & Games",
    simpleRole: "The helper who draws pictures on your screen.",
    whatItDoes: "Handles all visuals, video playback, 3D games, and animations so the main Chef doesn't get overwhelmed.",
    collegeTip: "Smooth 3D games and crisp 4K videos happen because the Sous-Chef does the painting.",
    image: "/hardware/gpu.jpg"
  },
  {
    id: "power-psu",
    roleName: "The Power Mains",
    techName: "Battery & Charger",
    shortName: "Power Supply",
    emoji: "⚡",
    badge: "Electricity",
    simpleRole: "Feeds clean electricity to the kitchen.",
    whatItDoes: "Gives steady electric power to every part of the computer so nothing crashes.",
    collegeTip: "A low battery cuts all power to the kitchen. Always keep your charger nearby!",
    image: "/hardware/motherboard.jpg"
  }
];

// ----------------------------------------------------------------------------
// 2. COLLEGE TROUBLESHOOTING (SHORT, FUN & RELATABLE)
// ----------------------------------------------------------------------------
export const COLLEGE_TROUBLESHOOTING_CASES = [
  {
    id: "case-essay-panic",
    title: 'The 2:00 AM "Dead Battery" Dilemma',
    badge: "RAM vs Storage",
    emoji: "😱",
    scenario: "You wrote an essay in Word for 2 hours. Suddenly your battery dies! You plug it in and turn it on, but the document is empty. Where did it go?",
    diagnosticQuestion: "Why did your unsaved essay vanish?",
    options: [
      "It was in RAM (Countertop). RAM wipes clean when power cuts off!",
      "The CPU Chef got angry and deleted it.",
      "The Wi-Fi disconnected and erased the file.",
      "The laptop screen forgot the words."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "Unsaved work stays on the Countertop (RAM). When power cuts, the countertop is wiped clean. Saving moves it to the safe Pantry (SSD).",
    explanation: "Unsaved work stays on the Countertop (RAM). When power cuts, the countertop is wiped clean. Saving moves it to the safe Pantry (SSD).",
    collegeGoldenRule: "Quick Rule: Press Ctrl + S often! The countertop is temporary; the pantry is forever.",
    collegeLifeRule: "Quick Rule: Press Ctrl + S often! The countertop is temporary; the pantry is forever."
  },
  {
    id: "case-zoom-freeze",
    title: 'The "35 Chrome Tabs" Freeze',
    badge: "Countertop Full",
    emoji: "🐌",
    scenario: "You are on a Zoom class with 35 Chrome tabs open. Zoom starts lagging and your mouse freezes, but CPU is only at 15%. What is happening?",
    diagnosticQuestion: "Why is the laptop so slow if the CPU is barely working?",
    options: [
      "Your RAM Countertop is 100% full from all the tabs.",
      "The professor's camera is too loud.",
      "The laptop mouse battery is tired.",
      "The keyboard keys are stuck."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "35 open tabs take up your entire Countertop (RAM). With no prep room left, your computer slows down to a crawl.",
    explanation: "35 open tabs take up your entire Countertop (RAM). With no prep room left, your computer slows down to a crawl.",
    collegeGoldenRule: "Quick Rule: Close browser tabs you are not using to free up your countertop!",
    collegeLifeRule: "Quick Rule: Close browser tabs you are not using to free up your countertop!"
  },
  {
    id: "case-game-loading",
    title: 'The "5-Minute Game Load" Dilemma',
    badge: "Old Drive vs Fast SSD",
    emoji: "🎮",
    scenario: "Your roommate loads into the game in 10 seconds. Your computer takes 4 minutes and makes quiet clicking noises inside. Why?",
    diagnosticQuestion: "What is causing your game to load so slowly?",
    options: [
      "The game is on an old spinning Hard Drive, not a fast SSD.",
      "The CPU Chef does not like video games.",
      "Your laptop has too many stickers on the cover.",
      "Your screen brightness is set too high."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "An old mechanical Hard Drive has slow spinning metal disks. An SSD is a modern flash drive that loads files 20x faster.",
    explanation: "An old mechanical Hard Drive has slow spinning metal disks. An SSD is a modern flash drive that loads files 20x faster.",
    collegeGoldenRule: "Quick Rule: An SSD is the biggest speed upgrade you can give any laptop.",
    collegeLifeRule: "Quick Rule: An SSD is the biggest speed upgrade you can give any laptop."
  },
  {
    id: "case-hot-lap",
    title: 'The "Bed Blanket" Overheating Dilemma',
    badge: "Cooling & Air Vents",
    emoji: "🔥",
    scenario: "You are watching video lectures with your laptop resting directly on a fluffy bed blanket. The fan starts screaming and videos start stuttering. Why?",
    diagnosticQuestion: "Why is the laptop slowing down?",
    options: [
      "The blanket blocked the air vents, so the CPU slows down to protect itself from heat.",
      "The blanket is soaking up the internet signal.",
      "The screen is tired from showing too many colors.",
      "The battery is leaking electricity into the blanket."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "The Chef (CPU) gets hot when working. The blanket blocked the vents, so the CPU had to slow down to prevent burning itself.",
    explanation: "The Chef (CPU) gets hot when working. The blanket blocked the vents, so the CPU had to slow down to prevent burning itself.",
    collegeGoldenRule: "Quick Rule: Always keep laptop air vents clear. Use a flat desk or a hard book.",
    collegeLifeRule: "Quick Rule: Always keep laptop air vents clear. Use a flat desk or a hard book."
  }
];

// ----------------------------------------------------------------------------
// 3. KNOW YOUR OWN RIG (SIMPLE 3 STEPS)
// ----------------------------------------------------------------------------
export const KNOW_YOUR_OWN_RIG_TASKS = [
  {
    id: "audit-cpu",
    stepNumber: 1,
    title: "Check Your Chef (CPU)",
    targetComponent: "CPU",
    analogyRef: "Find out what brain your computer has",
    easyInstructionsWindows: "Press Ctrl + Shift + Esc to open Task Manager. Click 'Performance' -> Click 'CPU'.",
    easyInstructionsMac: "Press Cmd + Space, type 'Activity Monitor', and press Enter. Click 'CPU'.",
    verificationPrompt: "What CPU does it show? (e.g. Intel Core i5, AMD Ryzen, Apple M1, etc.)",
    placeholder: "e.g. Intel Core i5 or AMD Ryzen 5"
  },
  {
    id: "audit-ram",
    stepNumber: 2,
    title: "Check Your Countertop (RAM)",
    targetComponent: "RAM",
    analogyRef: "Find out how much workspace you have",
    easyInstructionsWindows: "In Task Manager -> Click 'Performance' -> Click 'Memory'. Look at the top right.",
    easyInstructionsMac: "Click the  Apple logo top-left -> 'About This Mac'. Look at 'Memory'.",
    verificationPrompt: "How much RAM do you have? (e.g. 8 GB, 16 GB, 32 GB)",
    placeholder: "e.g. 8 GB or 16 GB"
  },
  {
    id: "audit-network",
    stepNumber: 3,
    title: "Check Your Connection (Wi-Fi or Wire)",
    targetComponent: "Network",
    analogyRef: "See how the Waiter brings your internet",
    easyInstructionsWindows: "Look at your taskbar icon. Are you on wireless Wi-Fi or a plugged-in cable?",
    easyInstructionsMac: "Look at the Wi-Fi icon at the top right of your screen.",
    verificationPrompt: "Are you using wireless Wi-Fi or a wired cable (Ethernet)?",
    placeholder: "e.g. Wi-Fi"
  }
];
