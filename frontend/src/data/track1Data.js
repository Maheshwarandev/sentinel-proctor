/**
 * @typedef {Object} Shortcut
 * @property {number} id - Unique identifier for the shortcut.
 * @property {string} title - Title of the shortcut.
 * @property {string} scenario - Scenario description.
 * @property {string} targetKey - The key to be pressed (matches standard JS KeyboardEvent.key).
 * @property {boolean} [ctrlKey] - Whether Ctrl is required.
 * @property {boolean} [shiftKey] - Whether Shift is required.
 * @property {boolean} [altKey] - Whether Alt is required.
 * @property {boolean} [metaKey] - Whether Meta/Cmd is required.
 * @property {string} hint - Hint for the candidate.
 * @property {string} explanation - Explanation of the shortcut.
 */

/**
 * @typedef {Object} Track1Day
 * @property {number} day - The day number.
 * @property {string} title - The title of the day.
 * @property {Shortcut[]} shortcuts - List of shortcuts for the day.
 */

/**
 * Track 1: Keyboard Ninja
 * @type {Track1Day[]}
 */
export const track1_days = [
  {
    day: 1,
    title: 'Basics',
    shortcuts: [
      { id: 1, title: 'Copy', scenario: 'You need to duplicate this text snippet somewhere else.', targetKey: 'c', ctrlKey: true, hint: 'Ctrl + C', explanation: 'Copies selected text to clipboard' },
      { id: 2, title: 'Paste', scenario: 'You have a text snippet in your clipboard that you want to insert here.', targetKey: 'v', ctrlKey: true, hint: 'Ctrl + V', explanation: 'Pastes clipboard contents' },
      { id: 3, title: 'Undo', scenario: 'Oops, you made a mistake! Let\'s go back one step.', targetKey: 'z', ctrlKey: true, hint: 'Ctrl + Z', explanation: 'Reverses last action' },
      { id: 4, title: 'Find', scenario: 'This document is huge. You need to locate a specific word.', targetKey: 'f', ctrlKey: true, hint: 'Ctrl + F', explanation: 'Opens search bar' },
      { id: 5, title: 'Save', scenario: 'Don\'t lose your progress, commit it to disk!', targetKey: 's', ctrlKey: true, hint: 'Ctrl + S', explanation: 'Saves current file' }
    ]
  },
  {
    day: 2,
    title: 'Text Power',
    shortcuts: [
      { id: 1, title: 'Cut', scenario: 'Move this text instead of just copying it.', targetKey: 'x', ctrlKey: true, hint: 'Ctrl + X', explanation: 'Cuts selected text' },
      { id: 2, title: 'Select All', scenario: 'You need to highlight the entire document for a mass edit.', targetKey: 'a', ctrlKey: true, hint: 'Ctrl + A', explanation: 'Selects entire document' },
      { id: 3, title: 'Redo', scenario: 'You undid too much, bring that change back!', targetKey: 'y', ctrlKey: true, hint: 'Ctrl + Y', explanation: 'Redoes undone action' },
      { id: 4, title: 'Find & Replace', scenario: 'A variable name changed, update all instances quickly.', targetKey: 'h', ctrlKey: true, hint: 'Ctrl + H', explanation: 'Opens find and replace' },
      { id: 5, title: 'Bold', scenario: 'Make this important text stand out in a rich text editor.', targetKey: 'b', ctrlKey: true, hint: 'Ctrl + B', explanation: 'Bolds selected text' }
    ]
  },
  {
    day: 3,
    title: 'Navigation',
    shortcuts: [
      { id: 1, title: 'Go to Start of Line', scenario: 'Quickly jump to the beginning of the current line.', targetKey: 'Home', hint: 'Home key', explanation: 'Moves cursor to start of line' },
      { id: 2, title: 'Go to End of Line', scenario: 'Quickly jump to the end of the current line.', targetKey: 'End', hint: 'End key', explanation: 'Moves cursor to end of line' },
      { id: 3, title: 'Jump Word Left', scenario: 'Move back exactly one word without using the mouse.', targetKey: 'ArrowLeft', ctrlKey: true, hint: 'Ctrl + Left Arrow', explanation: 'Jumps word to the left' },
      { id: 4, title: 'Jump Word Right', scenario: 'Move forward exactly one word without using the mouse.', targetKey: 'ArrowRight', ctrlKey: true, hint: 'Ctrl + Right Arrow', explanation: 'Jumps word to the right' },
      { id: 5, title: 'Go to Top of Document', scenario: 'Jump straight to the top of a massive log file.', targetKey: 'Home', ctrlKey: true, hint: 'Ctrl + Home', explanation: 'Moves cursor to start of document' }
    ]
  },
  {
    day: 4,
    title: 'Editor Pro',
    shortcuts: [
      { id: 1, title: 'Italic', scenario: 'Apply emphasis to this selected text.', targetKey: 'i', ctrlKey: true, hint: 'Ctrl + I', explanation: 'Italicizes text' },
      { id: 2, title: 'Underline', scenario: 'Underline this specific phrase.', targetKey: 'u', ctrlKey: true, hint: 'Ctrl + U', explanation: 'Underlines text' },
      { id: 3, title: 'Print / Preview', scenario: 'Generate a hard copy or preview of this layout.', targetKey: 'p', ctrlKey: true, hint: 'Ctrl + P', explanation: 'Opens print dialog' },
      { id: 4, title: 'Zoom In', scenario: 'The text is too small, make everything bigger.', targetKey: '=', ctrlKey: true, hint: 'Ctrl + =', explanation: 'Zooms in' },
      { id: 5, title: 'Zoom Out', scenario: 'The text is huge, shrink the view down.', targetKey: '-', ctrlKey: true, hint: 'Ctrl + -', explanation: 'Zooms out' }
    ]
  },
  {
    day: 5,
    title: 'Developer',
    shortcuts: [
      { id: 1, title: 'Toggle Comment', scenario: 'Quickly disable this block of code.', targetKey: '/', ctrlKey: true, hint: 'Ctrl + /', explanation: 'Comments/uncomments code' },
      { id: 2, title: 'Duplicate Selection', scenario: 'You need an exact copy of this line right below it.', targetKey: 'd', ctrlKey: true, hint: 'Ctrl + D', explanation: 'Duplicates current selection' },
      { id: 3, title: 'Go to Line', scenario: 'The error trace says line 402. Get there instantly.', targetKey: 'g', ctrlKey: true, hint: 'Ctrl + G', explanation: 'Opens go-to-line dialog' },
      { id: 4, title: 'Open Command Palette', scenario: 'You need to run an IDE command quickly.', targetKey: 'P', ctrlKey: true, shiftKey: true, hint: 'Ctrl + Shift + P', explanation: 'Opens VS Code command palette' },
      { id: 5, title: 'Quick Open File', scenario: 'Jump to a different file in the project by name.', targetKey: 'e', ctrlKey: true, hint: 'Ctrl + E', explanation: 'Opens quick file switcher' }
    ]
  },
  {
    day: 6,
    title: 'Master',
    shortcuts: [
      { id: 1, title: 'Delete Word Before', scenario: 'Erase the previous word without spamming backspace.', targetKey: 'Backspace', ctrlKey: true, hint: 'Ctrl + Backspace', explanation: 'Deletes entire word behind cursor' },
      { id: 2, title: 'Delete Word After', scenario: 'Erase the next word quickly.', targetKey: 'Delete', ctrlKey: true, hint: 'Ctrl + Delete', explanation: 'Deletes entire word ahead' },
      { id: 3, title: 'Move Line Up', scenario: 'Shift this line of code up one row.', targetKey: 'ArrowUp', altKey: true, hint: 'Alt + Up Arrow', explanation: 'Moves current line up' },
      { id: 4, title: 'Move Line Down', scenario: 'Shift this line of code down one row.', targetKey: 'ArrowDown', altKey: true, hint: 'Alt + Down Arrow', explanation: 'Moves current line down' },
      { id: 5, title: 'Format Document', scenario: 'Clean up the messy indentation in this file.', targetKey: 'F', ctrlKey: true, shiftKey: true, hint: 'Ctrl + Shift + F', explanation: 'Auto-formats code' }
    ]
  }
];
