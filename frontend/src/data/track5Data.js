export const track5_days = [
  {
    day: 1,
    title: 'Basic Push',
    description: 'Initialize, stage, commit, and push your work to the main branch.',
    steps: [
      { step: 1, action: 'git init', role: 'Initialize repository' },
      { step: 2, action: 'git add .', role: 'Stage all files' },
      { step: 3, action: 'git commit -m "initial commit"', role: 'Commit changes' },
      { step: 4, action: 'git push -u origin main', role: 'Push to remote' }
    ]
  },
  {
    day: 2,
    title: 'Branch Workflow',
    description: 'Create a feature branch, commit changes, and push it.',
    steps: [
      { step: 1, action: 'git checkout -b feature', role: 'Create feature branch' },
      { step: 2, action: 'git add src/', role: 'Stage source files' },
      { step: 3, action: 'git commit -m "add feature"', role: 'Commit on branch' },
      { step: 4, action: 'git push origin feature', role: 'Push branch to remote' }
    ]
  },
  {
    day: 3,
    title: 'Merge Flow',
    description: 'Sync with main, merge your feature branch, and deploy.',
    steps: [
      { step: 1, action: 'git checkout main', role: 'Switch to main branch' },
      { step: 2, action: 'git pull origin main', role: 'Sync latest changes' },
      { step: 3, action: 'git merge feature', role: 'Merge feature into main' },
      { step: 4, action: 'git push origin main', role: 'Deploy merged code' }
    ]
  },
  {
    day: 4,
    title: 'Stash & Switch',
    description: 'You have unfinished work but need to fix an urgent bug on main.',
    steps: [
      { step: 1, action: 'git stash', role: 'Save unfinished work safely' },
      { step: 2, action: 'git checkout main', role: 'Switch to main branch' },
      { step: 3, action: 'git pull origin main', role: 'Get latest bugfix code' },
      { step: 4, action: 'git checkout feature', role: 'Return to feature branch' },
      { step: 5, action: 'git stash pop', role: 'Restore unfinished work' }
    ]
  },
  {
    day: 5,
    title: 'Rebase Reality',
    description: 'Keep your feature branch history clean by rebasing it onto main.',
    steps: [
      { step: 1, action: 'git checkout main', role: 'Switch to main' },
      { step: 2, action: 'git pull origin main', role: 'Fetch latest updates' },
      { step: 3, action: 'git checkout feature', role: 'Return to feature' },
      { step: 4, action: 'git rebase main', role: 'Replay commits on top' }
    ]
  },
  {
    day: 6,
    title: 'Undo Mistakes',
    description: 'You committed a secret API key. Time to rewrite history safely.',
    steps: [
      { step: 1, action: 'git log --oneline', role: 'Find the bad commit' },
      { step: 2, action: 'git reset --soft HEAD~1', role: 'Undo the last commit' },
      { step: 3, action: 'git rm --cached .env', role: 'Unstage the secret file' },
      { step: 4, action: 'git commit -m "fix without secret"', role: 'Make clean commit' },
      { step: 5, action: 'git push origin main -f', role: 'Force push to remote' }
    ]
  }
];
