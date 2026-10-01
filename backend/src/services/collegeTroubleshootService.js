/**
 * College Troubleshoot Case Generator - Module 4 Service
 * Simple, friendly, relatable college troubleshooting cases using
 * the "Restaurant Kitchen" mental model (Chef=CPU, Countertop=RAM, Pantry=SSD/HDD, Waiter=Motherboard).
 * Short scenarios, zero intimidating jargon.
 */

import { getEffectiveGeminiKey } from './dailyWritingTopicService.js';

export const FOUNDATIONAL_COLLEGE_CASES = [
  {
    id: 'case-essay-panic',
    title: 'The 2:00 AM "Dead Battery" Dilemma',
    badge: 'RAM vs Storage',
    emoji: '😱',
    scenario: 'You wrote an essay in Word for 2 hours. Suddenly your battery dies! You plug it in and turn it on, but the document is empty. Where did it go?',
    diagnosticQuestion: 'Why did your unsaved essay vanish?',
    options: [
      'It was in RAM (Countertop). RAM wipes clean when power cuts off!',
      'The CPU Chef got angry and deleted it.',
      'The Wi-Fi disconnected and erased the file.',
      'The laptop screen forgot the words.'
    ],
    correctIndex: 0,
    correctAnswerIndex: 0,
    explanation: 'Unsaved work stays on the Countertop (RAM). When power cuts, the countertop is wiped clean. Saving moves it to the safe Pantry (SSD).',
    kitchenDiagnosis: 'Unsaved work stays on the Countertop (RAM). When power cuts, the countertop is wiped clean. Saving moves it to the safe Pantry (SSD).',
    collegeLifeRule: 'Quick Rule: Press Ctrl + S often! The countertop is temporary; the pantry is forever.',
    collegeGoldenRule: 'Quick Rule: Press Ctrl + S often! The countertop is temporary; the pantry is forever.'
  },
  {
    id: 'case-zoom-freeze',
    title: 'The "35 Chrome Tabs" Freeze',
    badge: 'Countertop Full',
    emoji: '🐌',
    scenario: 'You are on a Zoom class with 35 Chrome tabs open. Zoom starts lagging and your mouse freezes, but CPU is only at 15%. What is happening?',
    diagnosticQuestion: 'Why is the laptop so slow if the CPU is barely working?',
    options: [
      'Your RAM Countertop is 100% full from all the tabs.',
      'The professor\'s camera is too loud.',
      'The laptop mouse battery is tired.',
      'The keyboard keys are stuck.'
    ],
    correctIndex: 0,
    correctAnswerIndex: 0,
    explanation: '35 open tabs take up your entire Countertop (RAM). With no prep room left, your computer slows down to a crawl.',
    kitchenDiagnosis: '35 open tabs take up your entire Countertop (RAM). With no prep room left, your computer slows down to a crawl.',
    collegeLifeRule: 'Quick Rule: Close browser tabs you are not using to free up your countertop!',
    collegeGoldenRule: 'Quick Rule: Close browser tabs you are not using to free up your countertop!'
  },
  {
    id: 'case-game-loading',
    title: 'The "5-Minute Game Load" Dilemma',
    badge: 'Old Drive vs Fast SSD',
    emoji: '🎮',
    scenario: 'Your roommate loads into the game in 10 seconds. Your computer takes 4 minutes and makes quiet clicking noises inside. Why?',
    diagnosticQuestion: 'What is causing your game to load so slowly?',
    options: [
      'The game is on an old spinning Hard Drive, not a fast SSD.',
      'The CPU Chef does not like video games.',
      'Your laptop has too many stickers on the cover.',
      'Your screen brightness is set too high.'
    ],
    correctIndex: 0,
    correctAnswerIndex: 0,
    explanation: 'An old mechanical Hard Drive has slow spinning metal disks. An SSD is a modern flash drive that loads files 20x faster.',
    kitchenDiagnosis: 'An old mechanical Hard Drive has slow spinning metal disks. An SSD is a modern flash drive that loads files 20x faster.',
    collegeLifeRule: 'Quick Rule: An SSD is the biggest speed upgrade you can give any laptop.',
    collegeGoldenRule: 'Quick Rule: An SSD is the biggest speed upgrade you can give any laptop.'
  },
  {
    id: 'case-hot-lap',
    title: 'The "Bed Blanket" Overheating Dilemma',
    badge: 'Cooling & Air Vents',
    emoji: '🔥',
    scenario: 'You are watching video lectures with your laptop resting directly on a fluffy bed blanket. The fan starts screaming and videos start stuttering. Why?',
    diagnosticQuestion: 'Why is the laptop slowing down?',
    options: [
      'The blanket blocked the air vents, so the CPU slows down to protect itself from heat.',
      'The blanket is soaking up the internet signal.',
      'The screen is tired from showing too many colors.',
      'The battery is leaking electricity into the blanket.'
    ],
    correctIndex: 0,
    correctAnswerIndex: 0,
    explanation: 'The Chef (CPU) gets hot when working. The blanket blocked the vents, so the CPU had to slow down to prevent burning itself.',
    kitchenDiagnosis: 'The Chef (CPU) gets hot when working. The blanket blocked the vents, so the CPU had to slow down to prevent burning itself.',
    collegeLifeRule: 'Quick Rule: Always keep laptop air vents clear. Use a flat desk or a hard book.',
    collegeGoldenRule: 'Quick Rule: Always keep laptop air vents clear. Use a flat desk or a hard book.'
  }
];

let casePointer = 0;

/**
 * Generate or retrieve next college troubleshooting case (Gemini AI or simplified procedural bank)
 */
export async function getNextCollegeTroubleshootCase() {
  const apiKey = getEffectiveGeminiKey();
  
  if (apiKey && apiKey.trim().length > 10 && !apiKey.includes('YOUR_GEMINI_API_KEY')) {
    const models = [
      'gemini-2.5-flash',
      'gemini-flash-lite-latest',
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];
    const prompt = `You are a helpful college computer mentor teaching a freshman with NO tech background.
Generate 1 simple, funny, relatable college computer troubleshooting problem using the "Restaurant Kitchen" mental model:
- Chef = CPU (thinking)
- Countertop = RAM (temporary workspace, wipes clean when powered off)
- Pantry = SSD / Hard Drive (permanent safe storage)
- Waiter = Motherboard (connects everything)

IMPORTANT GUIDELINES:
- Keep the scenario very short (2-3 sentences max).
- Keep options short (under 12 words each).
- NO technical jargon (NO gigahertz, NO DDR5, NO IOPS).
- Keep the language super simple and friendly.

Return ONLY valid JSON matching this schema:
{
  "title": "Short catchy title (e.g. The 1% Battery Sprint)",
  "badge": "Short badge (e.g. Countertop Full)",
  "emoji": "1 emoji",
  "scenario": "2 short sentences describing a simple college problem.",
  "diagnosticQuestion": "Simple 1-sentence question (e.g. Why did the laptop freeze?)",
  "options": [
    "Correct simple answer matching the kitchen model",
    "Funny incorrect answer",
    "Another simple wrong answer",
    "Third simple wrong answer"
  ],
  "correctIndex": 0,
  "explanation": "1-2 simple sentences explaining the fix in plain English.",
  "collegeLifeRule": "1 short friendly rule (e.g. Quick Rule: Always hit Ctrl + S!)."
}`;

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              responseMimeType: 'application/json',
              maxOutputTokens: 800
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed && parsed.title && parsed.scenario && Array.isArray(parsed.options) && parsed.options.length === 4) {
              return {
                id: `ai-case-${Date.now()}`,
                title: parsed.title,
                badge: parsed.badge || 'AI Scenario',
                emoji: parsed.emoji || '💡',
                scenario: parsed.scenario,
                diagnosticQuestion: parsed.diagnosticQuestion,
                options: parsed.options,
                correctIndex: parsed.correctIndex ?? 0,
                correctAnswerIndex: parsed.correctIndex ?? 0,
                explanation: parsed.explanation,
                kitchenDiagnosis: parsed.explanation,
                collegeLifeRule: parsed.collegeLifeRule || 'Quick Rule: Keep it simple and save your work!',
                collegeGoldenRule: parsed.collegeLifeRule || 'Quick Rule: Keep it simple and save your work!',
                source: 'gemini-ai'
              };
            }
          }
        }
      } catch (e) {
        // Fallback to procedural
      }
    }
  }

  // Fallback to simplified procedural bank
  const selected = FOUNDATIONAL_COLLEGE_CASES[casePointer % FOUNDATIONAL_COLLEGE_CASES.length];
  casePointer++;
  return {
    ...selected,
    id: `${selected.id}-${Date.now()}`,
    source: 'procedural-bank'
  };
}
