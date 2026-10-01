// ============================================================================
// MODULE 4: TECHNOLOGY & HARDWARE (FOR COLLEGE FRESHMEN)
// Simple, fun, visual kitchen analogies. No confusing jargon or wall-of-text.
// ============================================================================

// ----------------------------------------------------------------------------
// 1. THE RESTAURANT KITCHEN MODEL (6 CORE HARDWARE STATIONS)
// ----------------------------------------------------------------------------
export const KITCHEN_ANALOGY_COMPONENTS = [
  {
    id: "chef-cpu",
    roleName: "The Master Chef",
    techName: "CPU (Central Processing Unit)",
    shortName: "CPU",
    emoji: "👨‍🍳",
    badge: "The Brain",
    image: "/hardware/cpu.jpg",
    inOneSecond: "The Chef who executes every single recipe, click, and calculation in your computer.",
    kitchenRole: "The head chef doing all the active cooking, slicing, chopping, and recipe orders at lightning speed.",
    computerRole: "Executes calculations, runs your operating system, and tells every other piece of hardware what to do.",
    simpleRole: "The master cook who does all the thinking and computing.",
    whatItDoes: "Every time you click a button, open an app, or press a key, the Chef executes the recipe instructions. A faster Chef means everything opens and computes quicker.",
    appAction: "The Chef reads the app's recipe instructions line-by-line and calculates every operation immediately.",
    powerLossAction: "The Chef instantly stops mid-recipe. When electric power returns, the Chef reboots fresh from step 1.",
    freshmanRule: "When your laptop gets warm or fans spin loud, the Chef is cooking heavy orders! Give it a hard, flat surface to breathe.",
    collegeTip: "When your laptop gets warm or fans spin, the Chef is cooking heavy orders! Keep air vents clear.",
    specsGuide: "Good: Intel Core i5 / AMD Ryzen 5 / Apple M1 • Great: Core i7 / Ryzen 7 / Apple M2+"
  },
  {
    id: "countertop-ram",
    roleName: "The Prep Countertop",
    techName: "RAM (Random Access Memory)",
    shortName: "RAM",
    emoji: "🪵",
    badge: "Active Workspace (Temporary)",
    image: "/hardware/ram.jpg",
    inOneSecond: "The physical table holding everything you are actively working on right this second.",
    kitchenRole: "The big preparation counter where open ingredients, mixing bowls, and current cutting boards sit ready for the chef to grab instantly.",
    computerRole: "Holds your currently open apps, active browser tabs, Word doc, Zoom call, and game assets while running.",
    simpleRole: "The kitchen table holding your active apps and open tabs.",
    whatItDoes: "Gives the CPU instantaneous access to running applications. Bigger countertop = you can open 30 tabs, Spotify, and Word without your laptop freezing.",
    appAction: "The app files are brought out of the pantry (SSD) and laid out onto the countertop (RAM) so the Chef can touch them in nanoseconds.",
    powerLossAction: "⚠️ WIPED COMPLETELY CLEAN! Anything on the countertop that wasn't saved into the pantry disappears forever when power drops.",
    freshmanRule: "Press Ctrl + S often! The countertop is wiped blank whenever the laptop shuts off; only the Pantry (SSD) is permanent.",
    collegeTip: "Turning off the laptop wipes the countertop clean! Always save your work to the pantry.",
    specsGuide: "Minimum for College: 8 GB • Recommended Sweet Spot: 16 GB (handles 40 tabs + Zoom smoothly)"
  },
  {
    id: "pantry-ssd",
    roleName: "The Deep Pantry",
    techName: "SSD / Storage (Solid State Drive)",
    shortName: "SSD / Storage",
    emoji: "🥫",
    badge: "Permanent Storage (Safe)",
    image: "/hardware/ssd.jpg",
    inOneSecond: "The secure cupboards and shelves where your files stay safe forever, even when powered off.",
    kitchenRole: "The sealed cupboards and deep freezer where food recipes and jars stay preserved for weeks and months safely.",
    computerRole: "Where your Windows/macOS operating system, downloaded assignments, photos, games, and saved docs live permanently.",
    simpleRole: "The cupboards that keep your files safe forever.",
    whatItDoes: "Stores all permanent data. When you click 'Save', your work moves from the temporary countertop into the permanent pantry.",
    appAction: "When you launch an app, the pantry door opens and copies the app's files onto your RAM countertop for fast access.",
    powerLossAction: "100% SAFE & PRESERVED! Everything in the pantry remains perfectly intact without any electric power.",
    freshmanRule: "Always make sure your laptop has an SSD (Solid State Drive), NOT an old mechanical spinning Hard Drive (HDD). SSDs boot in 8 seconds!",
    collegeTip: "Pressing 'Ctrl + S' moves your paper from the countertop into the safe pantry.",
    specsGuide: "Ideal Size: 512 GB or 1 TB NVMe SSD (Avoid old mechanical spinning HDDs entirely)"
  },
  {
    id: "waiter-motherboard",
    roleName: "The Kitchen Floor & Waiters",
    techName: "Motherboard (Main Circuit Board)",
    shortName: "Motherboard",
    emoji: "🧑‍🍳",
    badge: "The Messenger & Nervous System",
    image: "/hardware/motherboard.jpg",
    inOneSecond: "The nervous system and express hallway connecting the chef, countertop, pantry, and screen.",
    kitchenRole: "The kitchen layout, conveyors, and waiters that carry dishes and ingredients between every station in real time.",
    computerRole: "The large circuit board that physically connects your CPU, RAM, SSD, Wi-Fi, battery, and ports together with high-speed data buses.",
    simpleRole: "Connects all parts together and delivers data between them.",
    whatItDoes: "Carries electric signals and gigabytes of data every second between the processor, memory, storage, and peripheral devices.",
    appAction: "Routes data buses between the storage drive, RAM, CPU, and screen with zero traffic jams.",
    powerLossAction: "Data transport pauses instantly until steady electricity is restored.",
    freshmanRule: "Every port on the outside of your laptop (USB-C, HDMI, headphone jack) is soldered directly onto the Motherboard!",
    collegeTip: "Plugging in your USB charger or headphones connects you directly to the Motherboard.",
    specsGuide: "Laptop motherboards are custom-engineered to fit your laptop chassis with built-in Wi-Fi 6 & USB-C"
  },
  {
    id: "sous-chef-gpu",
    roleName: "The Visual Plating Artist",
    techName: "GPU (Graphics Processing Unit)",
    shortName: "GPU",
    emoji: "🎨",
    badge: "Pixels, 3D & Screen Display",
    image: "/hardware/gpu.jpg",
    inOneSecond: "A dedicated artist whose only job is painting millions of pixels onto your screen every millisecond.",
    kitchenRole: "The culinary decorator whose sole specialty is plating beautiful, intricate food presentations at lightning speed.",
    computerRole: "Renders 3D game worlds, smooth 60fps/120fps video streams, animations, and external 4K monitors.",
    simpleRole: "The helper who draws all pictures, videos, and games on your screen.",
    whatItDoes: "Paints every single dot (pixel) on your display. Takes the visual load off the main CPU Chef so your computer stays fast.",
    appAction: "Receives visual coordinates from the app and renders 3D lighting, textures, and UI animations smoothly.",
    powerLossAction: "The screen instantly turns black. No pixels are rendered.",
    freshmanRule: "Integrated graphics (Intel Iris / Apple GPU) are great for college & Netflix. Dedicated GPUs (NVIDIA RTX / AMD Radeon) are for heavy gaming & 3D rendering.",
    collegeTip: "Smooth 3D games and crisp 4K videos happen because the Sous-Chef does the painting.",
    specsGuide: "Everyday college: Integrated GPU • Gaming / Video Editing / Engineering CAD: Dedicated NVIDIA RTX"
  },
  {
    id: "camera-webcam",
    roleName: "The Drive-Thru Eyes & Mic",
    techName: "Webcam & Peripherals (Sensors / Input)",
    shortName: "Webcam & Sensors",
    emoji: "📹",
    badge: "Proctor Eyes & Video Feed",
    image: "/hardware/webcam.jpg",
    inOneSecond: "The sensors, camera, and microphone that let the outside world interact with your computer.",
    kitchenRole: "The drive-thru window, order microphone, and security cameras keeping an eye on orders.",
    computerRole: "Captures your video feed for online exams and Zoom, hears your microphone, and registers clicks.",
    simpleRole: "The camera and microphone that let proctors and friends see and hear you.",
    whatItDoes: "Converts light and sound waves from your dorm room into digital video and audio packets for proctoring AI and video calls.",
    appAction: "Captures optical frames at 30 fps, encrypts them, and transmits them across the network to the exam proctor.",
    powerLossAction: "Sensor power cuts and the video stream terminates immediately.",
    freshmanRule: "For online proctored exams: Always test your webcam before start time, face a window or lamp (light in FRONT of you), and never block the lens!",
    collegeTip: "Position your webcam at eye level and close other video apps before launching an exam.",
    specsGuide: "Standard: 720p or 1080p HD Webcam with dual array microphones and privacy shutter"
  }
];

// ----------------------------------------------------------------------------
// 2. COLLEGE TROUBLESHOOTING (SHORT, PUNCHY & RELATABLE SCENARIOS)
// ----------------------------------------------------------------------------
export const COLLEGE_TROUBLESHOOTING_CASES = [
  {
    id: "case-essay-panic",
    title: 'The 2:00 AM "Dead Battery" Dilemma',
    badge: "Countertop vs Pantry",
    emoji: "😱",
    scenario: "You have been typing an essay in Word for 2 hours in your dorm. Suddenly, your laptop battery dies! You plug it in, boot it back up, but the document is completely blank. Where did your essay go?",
    diagnosticQuestion: "Why did your unsaved essay vanish?",
    options: [
      "It was in RAM (Countertop). RAM wipes clean when power cuts off!",
      "The CPU Chef got angry and deleted the paragraph.",
      "The Wi-Fi disconnected and erased the file.",
      "The laptop screen forgot the words."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "Unsaved work was resting only on your Countertop (RAM). When power cut off, the countertop was wiped completely clean! Saving moves it into the permanent Pantry (SSD).",
    explanation: "Unsaved work stays on the Countertop (RAM). When power cuts, the countertop is wiped clean. Saving moves it to the safe Pantry (SSD).",
    collegeGoldenRule: "🍳 College Golden Rule: Press Ctrl + S (or Cmd + S) every few paragraphs! The Countertop is temporary; the Pantry is forever.",
    collegeLifeRule: "🍳 College Golden Rule: Press Ctrl + S often! The countertop is temporary; the pantry is forever."
  },
  {
    id: "case-zoom-freeze",
    title: 'The "35 Chrome Tabs" Freeze',
    badge: "Countertop 100% Full",
    emoji: "🐌",
    scenario: "You are on a mandatory Zoom lecture with 35 Chrome tabs, Spotify, and 3 PDF textbooks open. Zoom starts stuttering and your mouse freezes, but your CPU usage is only at 14%. What is happening?",
    diagnosticQuestion: "Why is the laptop crawling if the CPU Chef is barely working?",
    options: [
      "Your RAM Countertop is 100% overflowing with open tabs, so there is zero room to breathe.",
      "The professor's webcam is too loud for the computer.",
      "The laptop trackpad battery is tired from clicking.",
      "The keyboard keys are stuck in sleep mode."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "35 open tabs and background apps crammed your entire Countertop (RAM). The Chef has zero open workspace left to chop new vegetables, so everything freezes!",
    explanation: "35 open tabs take up your entire Countertop (RAM). With no prep room left, your computer slows down to a crawl.",
    collegeGoldenRule: "🍳 College Golden Rule: Close browser tabs you don't need or install an extension like 'OneTab' to free up your countertop!",
    collegeLifeRule: "🍳 College Golden Rule: Close browser tabs you are not using to free up your countertop!"
  },
  {
    id: "case-game-loading",
    title: 'The "5-Minute Loading Screen" Dilemma',
    badge: "Slow HDD vs Fast SSD",
    emoji: "🎮",
    scenario: "Your roommate clicks 'Play' and loads into the match in 8 seconds. Your older computer takes over 4 minutes, making clicking, whirling noises from inside. Why is yours so slow?",
    diagnosticQuestion: "What hardware component is choking the loading time?",
    options: [
      "The game files are trapped on an old spinning mechanical Hard Drive, not a fast modern SSD.",
      "The CPU Chef does not like video games.",
      "Your laptop has too many stickers on the outer lid.",
      "Your screen brightness is set too high."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "An old mechanical Hard Drive has a physical needle that has to hunt across spinning metal platters. An SSD is a solid-state chip that retrieves files 20x faster with zero waiting!",
    explanation: "An old mechanical Hard Drive has slow spinning metal disks. An SSD is a modern flash drive that loads files 20x faster.",
    collegeGoldenRule: "🍳 College Golden Rule: An SSD is the #1 single upgrade that makes any computer feel brand new instantly.",
    collegeLifeRule: "🍳 College Golden Rule: An SSD is the biggest speed upgrade you can give any laptop."
  },
  {
    id: "case-hot-lap",
    title: 'The "Bed Blanket" Overheating Dilemma',
    badge: "Cooling & Air Vents",
    emoji: "🔥",
    scenario: "You are studying in bed with your laptop sitting directly on a fluffy comforter blanket. After 20 minutes, the fan screams like a jet engine and your video starts stuttering. Why?",
    diagnosticQuestion: "Why is the laptop suddenly lagging?",
    options: [
      "The blanket blocked the bottom air intake vents. The CPU throttled down its speed to avoid melting!",
      "The blanket is soaking up the Wi-Fi waves.",
      "The screen got tired from showing bright lecture slides.",
      "The battery leaked electrical heat into the mattress."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "The Chef (CPU) generates intense heat while working. The soft blanket suffocated the exhaust vents, forcing the Chef to thermal throttle (slow down by 70%) to save itself from melting!",
    explanation: "The Chef (CPU) gets hot when working. The blanket blocked the vents, so the CPU had to slow down to prevent burning itself.",
    collegeGoldenRule: "🍳 College Golden Rule: Never place laptops on blankets or pillows. Use a desk, laptop lap-tray, or hard textbook underneath!",
    collegeLifeRule: "🍳 College Golden Rule: Always keep laptop air vents clear. Use a flat desk or a hard book."
  },
  {
    id: "case-webcam-black",
    title: 'The "Black Screen on Exam Proctor" Dilemma',
    badge: "Webcam & Permissions",
    emoji: "📹",
    scenario: "You open your proctored exam on Sentinel Proctor, but the camera preview is just a black box with a red warning sign. Your friend called you on Discord 5 minutes ago and the camera worked then. What is the issue?",
    diagnosticQuestion: "Why is Sentinel Proctor unable to show your video feed?",
    options: [
      "Another app (like Discord or Zoom) still has the camera locked, or your browser blocked camera permission.",
      "The webcam ran out of digital ink.",
      "The CPU Chef forgot what your face looks like.",
      "The proctor exam requires you to buy a television."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "Only one chef at a time can look through the drive-thru window! Discord held an exclusive hardware lock on your camera sensor, or the browser blocked site camera access.",
    explanation: "Webcams can usually only be accessed by one application at a time. If Zoom or Discord is open in the background, other apps get a black feed.",
    collegeGoldenRule: "🍳 College Golden Rule: Fully close Discord/Zoom from your system tray before starting any proctored test, and check the browser lock icon 🔒.",
    collegeLifeRule: "🍳 College Golden Rule: Always quit other video apps before taking a proctored exam."
  },
  {
    id: "case-unplugged-lag",
    title: 'The "Unplugged Lag Spike" Dilemma',
    badge: "Power Supply & GPU",
    emoji: "⚡",
    scenario: "You unplug your gaming laptop charger to move to the couch. Instantly, your 3D design software or game drops from buttery smooth 60 FPS down to a choppy 18 FPS. Why?",
    diagnosticQuestion: "Why did graphics performance plummet the instant you unplugged?",
    options: [
      "The laptop switched to Battery Saver mode, putting the GPU and CPU into low-power throttle.",
      "The Wi-Fi refuses to send graphics without a wall plug.",
      "The laptop screen glass lost its magnetism.",
      "The battery is absorbing the pixels for fuel."
    ],
    correctAnswerIndex: 0,
    correctIndex: 0,
    kitchenDiagnosis: "The wall plug feeds high wattage electricity. On battery alone, the power mains throttle the Chef and Plating Artist (GPU) to half-speed to protect the battery from draining in 15 minutes!",
    explanation: "High-performance laptops automatically restrict GPU and CPU power draw when running on battery to conserve energy.",
    collegeGoldenRule: "🍳 College Golden Rule: Always plug in your power brick when running heavy graphics, gaming, rendering, or taking important exams!",
    collegeLifeRule: "🍳 College Golden Rule: Keep your charger plugged in during demanding tasks and tests."
  }
];

// ----------------------------------------------------------------------------
// 3. KNOW YOUR OWN RIG (FRIENDLY 3-STEP INSPECTOR)
// ----------------------------------------------------------------------------
export const KNOW_YOUR_OWN_RIG_TASKS = [
  {
    id: "audit-cpu",
    stepNumber: 1,
    title: "Check Your Chef (CPU)",
    targetComponent: "CPU",
    analogyRef: "Find out what brain powers your laptop",
    easyInstructionsWindows: "Press Ctrl + Shift + Esc to open Task Manager ➔ Click 'Performance' ➔ Click 'CPU'. Look at the top right!",
    easyInstructionsMac: "Click the  Apple icon at top-left ➔ 'About This Mac' ➔ Look at 'Processor' or 'Chip'.",
    verificationPrompt: "What CPU processor does your laptop have?",
    placeholder: "e.g. Intel Core i5-1135G7, AMD Ryzen 5, or Apple M2",
    autoDetectKey: "cpu",
    quickTip: "Shows your processor brand, generation, and number of cores."
  },
  {
    id: "audit-ram",
    stepNumber: 2,
    title: "Check Your Countertop (RAM)",
    targetComponent: "RAM",
    analogyRef: "Find out how much active workspace you have",
    easyInstructionsWindows: "In Task Manager ➔ Click 'Performance' ➔ Click 'Memory'. Look at the top right number.",
    easyInstructionsMac: "Click  Apple icon top-left ➔ 'About This Mac' ➔ Look at 'Memory' (e.g. 8 GB or 16 GB).",
    verificationPrompt: "How much RAM memory is installed?",
    placeholder: "e.g. 8 GB, 16 GB, or 32 GB",
    autoDetectKey: "ram",
    quickTip: "16 GB is ideal for college multitasking; 8 GB is sufficient for basic browsing and docs."
  },
  {
    id: "audit-network",
    stepNumber: 3,
    title: "Check Your Connection (Wi-Fi or Wire)",
    targetComponent: "Network",
    analogyRef: "See how your computer connects to the internet highway",
    easyInstructionsWindows: "Look at your bottom-right taskbar (or in Task Manager ➔ 'Wi-Fi' / 'Ethernet').",
    easyInstructionsMac: "Look at the Wi-Fi icon in the top right menu bar.",
    verificationPrompt: "Are you on wireless Wi-Fi or a plugged-in Ethernet cable?",
    placeholder: "e.g. Wi-Fi (5 GHz) or Wired Ethernet",
    autoDetectKey: "network",
    quickTip: "Wired Ethernet offers lowest latency for exams; 5 GHz Wi-Fi is great if close to router."
  }
];
