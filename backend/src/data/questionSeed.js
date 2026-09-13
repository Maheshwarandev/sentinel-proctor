/**
 * Beginner English & Computer/Programming Question Bank
 * Specially designed for beginners learning English alongside computers and coding.
 * 
 * Staged Progression:
 * - Questions 1–35: Easy Beginner English & Daily Computer Basics (Keyboard, Mouse, Screen, Files, Internet)
 * - Questions 36–70: Beginner Programming & Coding Concepts (Bug, Variable, Loop, Function, HTML, CSS, JS)
 * - Questions 71–100: Tech Vocabulary & Developer Workflow (Git, API, Terminal, Clean Code, Shortcuts)
 */

export const SEED_QUESTIONS = [
  // =========================================================================
  // STAGE 1: EASY BEGINNER ENGLISH & COMPUTER BASICS (Questions 1 - 35)
  // =========================================================================
  {
    id: 'eng-01',
    text: 'I _____ typing on my computer right now.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'The pronoun "I" always pairs with the present continuous verb "am" ("I am typing").'
  },
  {
    id: 'eng-02',
    text: 'Which computer device do you use to type letters and numbers?',
    options: ['Keyboard', 'Speaker', 'Printer', 'Power cable'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'A keyboard is the primary input device used to type text, numbers, and symbols.'
  },
  {
    id: 'eng-03',
    text: 'You use a mouse to _____ on buttons on your screen.',
    options: ['click', 'eat', 'sleep', 'drive'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Pressing a mouse button to select something on the screen is called "clicking".'
  },
  {
    id: 'eng-04',
    text: 'She _____ to learn computer programming every day.',
    options: ['wants', 'want', 'wanting', 'is want'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'With third-person singular subjects ("She", "He", "It"), we add "s" to the verb: "She wants".'
  },
  {
    id: 'eng-05',
    text: 'Before you turn off your computer, make sure you _____ your file.',
    options: ['save', 'delete', 'break', 'forget'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Saving your file preserves your written work to the computer storage so it is not lost.'
  },
  {
    id: 'eng-06',
    text: 'A _____ is a portable personal computer you can carry in your bag.',
    options: ['laptop', 'refrigerator', 'microwave', 'desktop tower'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'A laptop is a compact, battery-powered computer designed for portability.'
  },
  {
    id: 'eng-07',
    text: 'Google Chrome and Microsoft Edge are examples of a web _____.',
    options: ['browser', 'camera', 'microphone', 'printer'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'A web browser is a software application used to access and view websites on the internet.'
  },
  {
    id: 'eng-08',
    text: 'They _____ learning how to write computer code together.',
    options: ['are', 'is', 'was', 'am'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'Plural subjects ("They", "We", "You") take "are" in the present tense.'
  },
  {
    id: 'eng-09',
    text: 'To protect your online accounts from hackers, choose a strong _____.',
    options: ['password', 'wallpaper', 'song', 'game'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'A strong secret password keeps your accounts, data, and computers secure.'
  },
  {
    id: 'eng-10',
    text: 'If your computer freezes or stops working, you can try to _____ it.',
    options: ['restart', 'throw', 'paint', 'break'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Restarting turns the computer off and on again, which often resolves software glitches.'
  },
  {
    id: 'eng-11',
    text: 'He _____ his typing practice on the computer yesterday.',
    options: ['finished', 'finish', 'finishing', 'will finish'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'The word "yesterday" indicates simple past tense, so we use "finished".'
  },
  {
    id: 'eng-12',
    text: 'The display screen that shows visual output from a computer is called a _____.',
    options: ['monitor', 'keyboard', 'mouse', 'microphone'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'The screen or display unit connected to a computer is called a monitor.'
  },
  {
    id: 'eng-13',
    text: 'Please plug the USB cable _____ the computer port.',
    options: ['into', 'under', 'onto', 'off'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'When connecting a cable into a socket, we use the preposition "into".'
  },
  {
    id: 'eng-14',
    text: 'We use a search engine like Google to _____ for answers online.',
    options: ['search', 'sleep', 'cook', 'wash'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'To look for information or resources on the internet is called "searching".'
  },
  {
    id: 'eng-15',
    text: 'Can you please help _____ with this computer exercise?',
    options: ['me', 'my', 'mine', 'I'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: '"Me" is the correct object pronoun following the verb "help".'
  },
  {
    id: 'eng-16',
    text: 'A _____ on your computer is used to organize and store multiple files together.',
    options: ['folder', 'cable', 'speaker', 'charger'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Folders (or directories) allow you to organize and group files cleanly.'
  },
  {
    id: 'eng-17',
    text: 'Our internet connection is very _____; web pages open in under 1 second.',
    options: ['fast', 'slow', 'heavy', 'dark'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: '"Fast" describes high-speed data transmission and quick page loading.'
  },
  {
    id: 'eng-18',
    text: 'Never share your private passwords _____ strangers.',
    options: ['with', 'from', 'at', 'into'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'The verb "share" takes the preposition "with" ("share with someone").'
  },
  {
    id: 'eng-19',
    text: 'He likes to _____ English and coding every single morning.',
    options: ['practice', 'practices', 'practicing', 'practiced'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'After "likes to", we use the base form of the verb ("practice").'
  },
  {
    id: 'eng-20',
    text: 'When a new message arrives on your computer, the speakers play an audio _____.',
    options: ['chime', 'picture', 'file', 'cable'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'A chime or notification tone plays through the speakers when alerts arrive.'
  },
  {
    id: 'eng-21',
    text: 'You click the _____ button at the top right of a window to close an app.',
    options: ['X', 'Play', 'Volume', 'Space'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'In Windows, clicking the "X" button closes the active application window.'
  },
  {
    id: 'eng-22',
    text: 'We _____ our computer files backed up on Google Drive.',
    options: ['have', 'has', 'having', 'is have'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'The pronoun "We" pairs with the plural verb "have".'
  },
  {
    id: 'eng-23',
    text: 'A web page address like "www.google.com" is called a _____.',
    options: ['URL', 'RAM', 'CPU', 'USB'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'A URL (Uniform Resource Locator) is the unique web address of a page on the internet.'
  },
  {
    id: 'eng-24',
    text: 'When you copy text from the internet, you can _____ it into Notepad.',
    options: ['paste', 'delete', 'shut down', 'paint'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'The shortcut Ctrl+V is used to paste copied text into an editor.'
  },
  {
    id: 'eng-25',
    text: 'Learning English will _____ you read programming documentation easily.',
    options: ['help', 'helps', 'helping', 'helped'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'Modal verbs like "will" are always followed by the base form of the verb ("help").'
  },
  {
    id: 'eng-26',
    text: 'To select multiple items on a computer screen, you can click and _____ the mouse.',
    options: ['drag', 'eat', 'jump', 'throw'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: '"Click and drag" is holding down the mouse button while moving the cursor across the screen.'
  },
  {
    id: 'eng-27',
    text: 'A camera built into your laptop for video calls is called a _____.',
    options: ['webcam', 'scanner', 'printer', 'mousepad'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'A webcam is a digital video camera connected to a computer for streaming video calls.'
  },
  {
    id: 'eng-28',
    text: 'The battery in his laptop is low, so he needs to connect the _____.',
    options: ['charger', 'speaker', 'webcam', 'mousepad'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Connecting a charger supplies electrical power to recharge the laptop battery.'
  },
  {
    id: 'eng-29',
    text: 'This software is free and open _____ everyone to download.',
    options: ['for', 'with', 'from', 'at'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'The adjective phrase is "open for everyone".'
  },
  {
    id: 'eng-30',
    text: 'A computer needs electrical _____ to operate and turn on.',
    options: ['power', 'water', 'oil', 'gas'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Computers require electrical power from a battery or wall outlet.'
  },
  {
    id: 'eng-31',
    text: 'He always _____ his work carefully before closing his laptop.',
    options: ['checks', 'check', 'checking', 'are checking'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'Third-person singular "He" takes "checks" in the simple present tense.'
  },
  {
    id: 'eng-32',
    text: 'When you take a photo with your phone and send it to your computer, you _____ it.',
    options: ['transfer', 'delete', 'erase', 'break'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Moving data from one device to another is called transferring files.'
  },
  {
    id: 'eng-33',
    text: 'Double-clicking an icon on your desktop will _____ the application.',
    options: ['open', 'erase', 'destroy', 'hide'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Double-clicking a desktop shortcut opens or launches the software.'
  },
  {
    id: 'eng-34',
    text: 'You should always be polite and respectful _____ sending emails.',
    options: ['when', 'why', 'where', 'which'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: '"When" indicates the time or occasion of performing an activity.'
  },
  {
    id: 'eng-35',
    text: 'The large button on the bottom of a keyboard that creates spaces is the _____.',
    options: ['Spacebar', 'Enter key', 'Shift key', 'Escape key'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'The Spacebar key inserts blank spaces between words when typing.'
  },

  // =========================================================================
  // STAGE 2: BEGINNER PROGRAMMING, CODING & WEB CONCEPTS (Questions 36 - 70)
  // =========================================================================
  {
    id: 'eng-36',
    text: 'In computer programming, an error or mistake in your code is called a _____.',
    options: ['bug', 'bird', 'fish', 'flower'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'A bug is an informal term for an error, flaw, or fault in a computer program.'
  },
  {
    id: 'eng-37',
    text: 'The process of finding and fixing mistakes in your code is called _____.',
    options: ['debugging', 'typing', 'browsing', 'restarting'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Debugging is the routine process of locating and removing bugs or errors from software code.'
  },
  {
    id: 'eng-38',
    text: 'In programming, a named container used to store data or values is a _____.',
    options: ['variable', 'cabinet', 'basket', 'closet'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'A variable holds values (like numbers or text) that can change as the program runs.'
  },
  {
    id: 'eng-39',
    text: 'When code repeats an action multiple times automatically, it uses a _____.',
    options: ['loop', 'line', 'stop', 'jump'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'A loop (like a "for" or "while" loop) repeats a set of instructions until a condition is met.'
  },
  {
    id: 'eng-40',
    text: 'HTML is a markup language used to build the structure of a _____.',
    options: ['website', 'printer', 'keyboard', 'cable'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'HTML (HyperText Markup Language) forms the foundational skeleton of web pages.'
  },
  {
    id: 'eng-41',
    text: 'To display text output on the screen, programmers often use the word _____.',
    options: ['print', 'hide', 'erase', 'close'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Commands like "print()" in Python or "console.log()" in JavaScript output text to the screen.'
  },
  {
    id: 'eng-42',
    text: 'A reusable block of code that performs a specific task when called is a _____.',
    options: ['function', 'wallpaper', 'mousepad', 'monitor'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'A function bundles code into a reusable block that can be run whenever needed.'
  },
  {
    id: 'eng-43',
    text: 'CSS is used by web developers to change colors, fonts, and page _____.',
    options: ['styling', 'weight', 'sound', 'smell'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'CSS (Cascading Style Sheets) controls visual appearance, layout, and colors on web pages.'
  },
  {
    id: 'eng-44',
    text: 'JavaScript is a programming language that makes websites interactive and _____.',
    options: ['dynamic', 'frozen', 'sleepy', 'silent'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'JavaScript allows web pages to respond dynamically to user clicks, typing, and animations.'
  },
  {
    id: 'eng-45',
    text: 'When you copy code or files from the internet onto your laptop, you _____ them.',
    options: ['download', 'upload', 'erase', 'destroy'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Downloading receives data from a remote server to your local machine.'
  },
  {
    id: 'eng-46',
    text: 'A software developer writes instructions for a computer in a programming _____.',
    options: ['language', 'song', 'country', 'animal'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Programming languages (like Python, JavaScript, and Java) let humans write instructions computers understand.'
  },
  {
    id: 'eng-47',
    text: 'In code, an "if-else" statement is used to make _____.',
    options: ['decisions', 'drawings', 'sounds', 'paintings'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Conditional statements ("if this is true, do that; else do something else") make logic decisions.'
  },
  {
    id: 'eng-48',
    text: 'In programming, values that can only be "true" or "false" are called _____.',
    options: ['Booleans', 'Numbers', 'Letters', 'Symbols'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'A Boolean data type has only two possible states: true or false.'
  },
  {
    id: 'eng-49',
    text: 'A software program used by developers to write and edit code is a code _____.',
    options: ['editor', 'camera', 'radio', 'scanner'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'A code editor (like VS Code) provides syntax highlighting, auto-complete, and writing features.'
  },
  {
    id: 'eng-50',
    text: 'A person who builds applications and websites by writing code is a software _____.',
    options: ['developer', 'driver', 'pilot', 'carpenter'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'A software developer (or programmer) creates software by authoring and testing code.'
  },
  {
    id: 'eng-51',
    text: 'In programming, an ordered list of items is called an _____.',
    options: ['array', 'envelope', 'closet', 'island'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'An array is a data structure containing a collection of elements identified by index numbers.'
  },
  {
    id: 'eng-52',
    text: 'A short note written inside code that the computer ignores is called a _____.',
    options: ['comment', 'password', 'mistake', 'virus'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Comments (like // in JS) help developers explain their code to themselves and teammates.'
  },
  {
    id: 'eng-53',
    text: 'Computers process information at the lowest hardware level using 0s and _____.',
    options: ['1s', '2s', '5s', '9s'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Binary code uses only two digits: 0 and 1, representing off and on electric states.'
  },
  {
    id: 'eng-54',
    text: 'The front-end of a web application is what the user _____ on their screen.',
    options: ['sees and clicks', 'eats', 'smells', 'burns'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'The front-end (UI) encompasses the visual elements, forms, and buttons that users interact with.'
  },
  {
    id: 'eng-55',
    text: 'The back-end of a web application connects to the server and the _____.',
    options: ['database', 'mousepad', 'monitor', 'keyboard cable'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'The back-end handles server logic, user authentication, and storing data in a database.'
  },
  {
    id: 'eng-56',
    text: 'A database is a specialized software system used to store and organize _____.',
    options: ['data', 'paint', 'furniture', 'paper'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'Databases (like MongoDB or MySQL) systematically store structured data for fast retrieval.'
  },
  {
    id: 'eng-57',
    text: 'When you click a button on a web page, the browser triggers an _____.',
    options: ['event', 'alarm', 'explosion', 'accident'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'User actions like clicks or keypresses generate "events" that JavaScript can listen to and handle.'
  },
  {
    id: 'eng-58',
    text: 'The shortcut Ctrl+C on Windows is used to _____ the selected text.',
    options: ['copy', 'delete', 'underline', 'print'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Ctrl+C copies highlighted text to the operating system clipboard.'
  },
  {
    id: 'eng-59',
    text: 'The shortcut Ctrl+V on Windows is used to _____ copied text into a document.',
    options: ['paste', 'erase', 'shut down', 'paint'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Ctrl+V pastes text from the clipboard into your active cursor location.'
  },
  {
    id: 'eng-60',
    text: 'The shortcut Ctrl+Z on Windows is used to _____ your last action or mistake.',
    options: ['undo', 'double', 'burn', 'paint'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Ctrl+Z reverses your most recent typing stroke or editing change.'
  },
  {
    id: 'eng-61',
    text: 'A clickable text link on a website that directs you to another page is a _____.',
    options: ['hyperlink', 'battery', 'scanner', 'printer'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'A hyperlink (or link) connects web documents together.'
  },
  {
    id: 'eng-62',
    text: 'A text string in programming is surrounded by quotation _____ (like "hello").',
    options: ['marks', 'dots', 'slashes', 'numbers'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Strings of text in code are enclosed in single (\') or double (") quotation marks.'
  },
  {
    id: 'eng-63',
    text: 'To test if two numbers are equal in JavaScript, programmers use _____ signs.',
    options: ['===', '+++', '***', '///'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'The strict equality operator === checks if both value and type match.'
  },
  {
    id: 'eng-64',
    text: 'When code runs without any errors, we say it executes _____.',
    options: ['successfully', 'sadly', 'angrily', 'lazily'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: '"Successfully" means the program finished its job with zero errors.'
  },
  {
    id: 'eng-65',
    text: 'A collection of instructions packaged into a single runnable computer program is _____.',
    options: ['software', 'hardware', 'plastic', 'copper'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Software consists of programs and data that run on physical computer hardware.'
  },
  {
    id: 'eng-66',
    text: 'The physical parts of a computer you can physically touch (keyboard, monitor) are _____.',
    options: ['hardware', 'software', 'cloud', 'internet'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Hardware refers to the tangible electronic and mechanical machinery.'
  },
  {
    id: 'eng-67',
    text: 'When you make a website look great on mobile phones, tablets, and laptops, it is _____.',
    options: ['responsive', 'frozen', 'heavy', 'silent'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'Responsive design automatically adapts layouts to different screen dimensions.'
  },
  {
    id: 'eng-68',
    text: 'In programming, incrementing a number means increasing its value by _____.',
    options: ['one', 'zero', 'ten', 'hundred'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Incrementing (often written as count++) adds 1 to the current numeric value.'
  },
  {
    id: 'eng-69',
    text: 'The central processor that executes computer instructions is the _____.',
    options: ['CPU', 'USB', 'LCD', 'HTML'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'The CPU (Central Processing Unit) acts as the primary computational engine of the computer.'
  },
  {
    id: 'eng-70',
    text: 'A software error message helps developers _____ what went wrong.',
    options: ['understand', 'ignore', 'hide', 'forget'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Reading the error message tells you which line failed and why.'
  },

  // =========================================================================
  // STAGE 3: TECH VOCABULARY & DEVELOPER WORKFLOW (Questions 71 - 100)
  // =========================================================================
  {
    id: 'eng-71',
    text: 'Git is an essential tool that developers use to track _____ in their code over time.',
    options: ['changes', 'pictures', 'games', 'videos'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Git is a version control system that logs historical revisions to source code files.'
  },
  {
    id: 'eng-72',
    text: 'A popular cloud platform where programmers save and share their Git projects is _____.',
    options: ['GitHub', 'Instagram', 'TikTok', 'Netflix'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'GitHub hosts Git repositories online, allowing collaboration and public portfolios.'
  },
  {
    id: 'eng-73',
    text: 'In web development, the file extension for JavaScript files is _____.',
    options: ['.js', '.mp3', '.jpg', '.pdf'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'JavaScript files use the ".js" extension (e.g., script.js).'
  },
  {
    id: 'eng-74',
    text: 'In web development, the file extension for CSS styling files is _____.',
    options: ['.css', '.png', '.txt', '.zip'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'Cascading Style Sheets use the ".css" extension (e.g., style.css).'
  },
  {
    id: 'eng-75',
    text: 'The default homepage file name for most websites is index._____.',
    options: ['html', 'mp4', 'exe', 'doc'],
    correctAnswerIndex: 0,
    category: 'Web Development',
    difficulty: 'beginner',
    explanation: 'Web servers automatically serve "index.html" as the entry point of a website.'
  },
  {
    id: 'eng-76',
    text: 'An API allows two different software programs to _____ data with each other.',
    options: ['exchange', 'fight', 'hide', 'erase'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'An API (Application Programming Interface) defines rules for services to communicate data.'
  },
  {
    id: 'eng-77',
    text: 'When your software code is ready for real users, you _____ it to a cloud server.',
    options: ['deploy', 'delete', 'lose', 'forget'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Deployment is releasing your working build to a hosting server on the internet.'
  },
  {
    id: 'eng-78',
    text: 'A text-based command line screen where you type developer commands is called a _____.',
    options: ['terminal', 'television', 'radio', 'camera'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'A terminal (or console) lets you run commands directly on the operating system.'
  },
  {
    id: 'eng-79',
    text: 'To stop an actively running command in the terminal, press the shortcut Ctrl + _____.',
    options: ['C', 'Z', 'A', 'P'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Ctrl+C sends a termination interrupt signal to stop the currently running process.'
  },
  {
    id: 'eng-80',
    text: 'A full-stack software engineer has the skills to work on both front-end and _____.',
    options: ['back-end', 'hardware repair', 'furniture', 'plumbing'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Full-stack developers handle both client-side UI and server-side logic/databases.'
  },
  {
    id: 'eng-81',
    text: 'The Enter key on a keyboard is used to start a _____ line of text.',
    options: ['new', 'broken', 'invisible', 'short'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Pressing Enter creates a carriage return to begin typing on the next line.'
  },
  {
    id: 'eng-82',
    text: 'The Backspace key on a keyboard is used to _____ the character before the cursor.',
    options: ['delete', 'duplicate', 'color', 'underline'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Backspace erases characters immediately to the left of your cursor.'
  },
  {
    id: 'eng-83',
    text: 'Good programmers write clean code that is easy for other people to _____.',
    options: ['read', 'break', 'lose', 'destroy'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Readable, well-commented code makes maintenance and teamwork straightforward.'
  },
  {
    id: 'eng-84',
    text: 'In JavaScript, the command console._____("Hello") prints text to the developer console.',
    options: ['log', 'cat', 'say', 'write'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'console.log() is the standard debugging function to inspect values in JavaScript.'
  },
  {
    id: 'eng-85',
    text: 'A step-by-step procedure of logical instructions to solve a problem is an _____.',
    options: ['algorithm', 'accident', 'alphabet', 'alarm'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'An algorithm is a structured sequence of defined steps to calculate or solve a task.'
  },
  {
    id: 'eng-86',
    text: 'To make sure your code does what it is supposed to do, you should _____ it thoroughly.',
    options: ['test', 'erase', 'hide', 'forget'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Testing software catches unexpected bugs before code reaches users.'
  },
  {
    id: 'eng-87',
    text: 'A secure website address starts with "https://" where the "s" stands for _____.',
    options: ['secure', 'simple', 'speed', 'software'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'HTTPS stands for HyperText Transfer Protocol Secure, meaning data is encrypted.'
  },
  {
    id: 'eng-88',
    text: 'Wi-Fi technology allows your computer to connect to the internet _____ physical cables.',
    options: ['without', 'inside', 'under', 'between'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Wi-Fi transmits internet data wirelessly using radio frequencies.'
  },
  {
    id: 'eng-89',
    text: 'Cloud computing means storing and managing data on internet servers instead of only local _____.',
    options: ['hard drives', 'monitors', 'mousepads', 'keyboards'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Cloud servers provide remote, redundant storage accessible anywhere.'
  },
  {
    id: 'eng-90',
    text: 'A mobile application installed on your phone is commonly called an _____.',
    options: ['app', 'engine', 'wire', 'anchor'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: '"App" is short for application software.'
  },
  {
    id: 'eng-91',
    text: 'When you work on a team, programmers use version control to _____ their code together.',
    options: ['merge', 'destroy', 'burn', 'lose'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Merging combines different branches of code created by multiple developers into one.'
  },
  {
    id: 'eng-92',
    text: 'Practicing touch typing every day will increase your words per _____ (WPM).',
    options: ['minute', 'second', 'hour', 'day'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'WPM stands for Words Per Minute, the standard measurement of typing speed.'
  },
  {
    id: 'eng-93',
    text: 'In code, equal sign (=) is used to _____ a value into a variable.',
    options: ['assign', 'delete', 'hide', 'erase'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Assignment (e.g. let score = 10) stores a value inside a designated variable.'
  },
  {
    id: 'eng-94',
    text: 'An internet browser keeps a list of websites you previously visited, called your _____.',
    options: ['history', 'printer', 'speaker', 'keyboard'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Browser history records URLs and timestamps of web pages you opened.'
  },
  {
    id: 'eng-95',
    text: 'When your code has a syntax error, the computer cannot _____ it.',
    options: ['run', 'see', 'draw', 'sleep'],
    correctAnswerIndex: 0,
    category: 'Coding Basics',
    difficulty: 'beginner',
    explanation: 'Syntax errors violate grammar rules of the language, preventing execution.'
  },
  {
    id: 'eng-96',
    text: 'A software engineer should never give up when solving a challenging _____.',
    options: ['problem', 'holiday', 'game', 'weekend'],
    correctAnswerIndex: 0,
    category: 'Tech Skills',
    difficulty: 'beginner',
    explanation: 'Problem-solving persistence is one of the most vital traits of a successful programmer.'
  },
  {
    id: 'eng-97',
    text: 'To refresh a web page in Chrome or Edge, you can press the function key _____.',
    options: ['F5', 'F1', 'Esc', 'Tab'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Pressing F5 (or Ctrl+R) reloads and refreshes the current web page.'
  },
  {
    id: 'eng-98',
    text: 'A clean desktop and organized folders make it easier to _____ your work files.',
    options: ['find', 'lose', 'break', 'burn'],
    correctAnswerIndex: 0,
    category: 'Computer Basics',
    difficulty: 'beginner',
    explanation: 'Organized folders allow fast retrieval of code files and assets.'
  },
  {
    id: 'eng-99',
    text: 'The best way to become good at programming is to write code _____ single day.',
    options: ['every', 'never', 'hardly', 'rarely'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'Consistent daily practice creates lasting mastery and muscle memory.'
  },
  {
    id: 'eng-100',
    text: 'Stay curious, keep learning, and your English and coding skills will _____!',
    options: ['grow', 'disappear', 'break', 'shrink'],
    correctAnswerIndex: 0,
    category: 'Beginner English',
    difficulty: 'beginner',
    explanation: 'Positive progress over time means skills grow and flourish.'
  }
];

export default SEED_QUESTIONS;
