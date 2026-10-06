export const track4_days = [
  {
    day: 1,
    title: 'Memory Leak',
    scenario: 'One process is eating 92% of your RAM, causing the system to stutter.',
    processes: [
      { name: 'chrome_helper.exe', pid: 1402, cpuPercent: 2, ramMB: 4200, isHung: false, recommendation: 'Kill process due to excessive memory leak.' },
      { name: 'explorer.exe', pid: 401, cpuPercent: 1, ramMB: 120, isHung: false, recommendation: 'Leave alone.' },
      { name: 'svchost.exe', pid: 820, cpuPercent: 0, ramMB: 45, isHung: false, recommendation: 'Leave alone.' },
      { name: 'spotify.exe', pid: 991, cpuPercent: 0, ramMB: 180, isHung: false, recommendation: 'Leave alone.' },
      { name: 'discord.exe', pid: 1104, cpuPercent: 1, ramMB: 350, isHung: false, recommendation: 'Leave alone.' },
      { name: 'system', pid: 4, cpuPercent: 2, ramMB: 2, isHung: false, recommendation: 'Leave alone.' }
    ]
  },
  {
    day: 2,
    title: 'CPU Spike',
    scenario: 'The fan is spinning loudly. A process is maxing out the CPU.',
    processes: [
      { name: 'virus_scanner.exe', pid: 9022, cpuPercent: 98, ramMB: 300, isHung: true, recommendation: 'Kill process as it is hung and hogging CPU.' },
      { name: 'code.exe', pid: 5040, cpuPercent: 1, ramMB: 850, isHung: false, recommendation: 'Leave alone.' },
      { name: 'slack.exe', pid: 3341, cpuPercent: 2, ramMB: 450, isHung: false, recommendation: 'Leave alone.' },
      { name: 'svchost.exe', pid: 821, cpuPercent: 0, ramMB: 50, isHung: false, recommendation: 'Leave alone.' },
      { name: 'msmpeng.exe', pid: 1543, cpuPercent: 1, ramMB: 200, isHung: false, recommendation: 'Leave alone.' },
      { name: 'chrome.exe', pid: 2110, cpuPercent: 0, ramMB: 150, isHung: false, recommendation: 'Leave alone.' }
    ]
  },
  {
    day: 3,
    title: 'Zombie Cascade',
    scenario: 'Multiple services have locked up. You need to terminate the rogue processes.',
    processes: [
      { name: 'node.exe', pid: 8812, cpuPercent: 85, ramMB: 120, isHung: true, recommendation: 'Kill process.' },
      { name: 'leaked_app.exe', pid: 901, cpuPercent: 2, ramMB: 3800, isHung: true, recommendation: 'Kill process.' },
      { name: 'system', pid: 4, cpuPercent: 5, ramMB: 2, isHung: false, recommendation: 'Leave alone.' },
      { name: 'dwm.exe', pid: 884, cpuPercent: 2, ramMB: 90, isHung: false, recommendation: 'Leave alone.' },
      { name: 'postgres.exe', pid: 5432, cpuPercent: 1, ramMB: 200, isHung: false, recommendation: 'Leave alone.' },
      { name: 'explorer.exe', pid: 405, cpuPercent: 1, ramMB: 110, isHung: false, recommendation: 'Leave alone.' }
    ]
  },
  {
    day: 4,
    title: 'Background Miner',
    scenario: 'Your system is unusually sluggish, and a hidden background task is maxing out resources.',
    processes: [
      { name: 'svchost.exe', pid: 1024, cpuPercent: 1, ramMB: 40, isHung: false, recommendation: 'Leave alone (Critical System Process).' },
      { name: 'winlogon.exe', pid: 742, cpuPercent: 0, ramMB: 20, isHung: false, recommendation: 'Leave alone.' },
      { name: 'updater_service.exe', pid: 9941, cpuPercent: 99, ramMB: 1024, isHung: true, recommendation: 'Kill process (Likely cryptominer disguised as updater).' },
      { name: 'taskmgr.exe', pid: 5410, cpuPercent: 3, ramMB: 110, isHung: false, recommendation: 'Leave alone.' },
      { name: 'services.exe', pid: 812, cpuPercent: 0, ramMB: 30, isHung: false, recommendation: 'Leave alone.' },
      { name: 'lsass.exe', pid: 504, cpuPercent: 1, ramMB: 25, isHung: false, recommendation: 'Leave alone.' },
      { name: 'code.exe', pid: 5041, cpuPercent: 1, ramMB: 800, isHung: false, recommendation: 'Leave alone.' }
    ]
  },
  {
    day: 5,
    title: 'Infinite Loop',
    scenario: 'A developer script got stuck in a `while(true)` loop without yielding.',
    processes: [
      { name: 'python.exe', pid: 3010, cpuPercent: 100, ramMB: 15, isHung: true, recommendation: 'Kill process (Stuck in infinite loop).' },
      { name: 'postgres.exe', pid: 4402, cpuPercent: 2, ramMB: 450, isHung: false, recommendation: 'Leave alone (Database running normally).' },
      { name: 'docker-desktop.exe', pid: 8192, cpuPercent: 4, ramMB: 1200, isHung: false, recommendation: 'Leave alone.' },
      { name: 'wsl.exe', pid: 4321, cpuPercent: 1, ramMB: 300, isHung: false, recommendation: 'Leave alone.' },
      { name: 'explorer.exe', pid: 402, cpuPercent: 1, ramMB: 115, isHung: false, recommendation: 'Leave alone.' },
      { name: 'chrome.exe', pid: 2111, cpuPercent: 0, ramMB: 210, isHung: false, recommendation: 'Leave alone.' }
    ]
  },
  {
    day: 6,
    title: 'System Meltdown',
    scenario: 'Multiple mission-critical failures are occurring simultaneously. Identify the hung anomalies without killing Windows.',
    processes: [
      { name: 'lsass.exe', pid: 504, cpuPercent: 1, ramMB: 30, isHung: false, recommendation: 'Leave alone (Critical Security Authority).' },
      { name: 'crashing_game.exe', pid: 14002, cpuPercent: 0, ramMB: 12000, isHung: true, recommendation: 'Kill process (Memory leak and unresponsive).' },
      { name: 'malware_payload.exe', pid: 7331, cpuPercent: 88, ramMB: 200, isHung: true, recommendation: 'Kill process (High CPU and unresponsive).' },
      { name: 'csrss.exe', pid: 420, cpuPercent: 0, ramMB: 15, isHung: false, recommendation: 'Leave alone (Critical Client Server Runtime).' },
      { name: 'discord.exe', pid: 9021, cpuPercent: 2, ramMB: 350, isHung: false, recommendation: 'Leave alone.' },
      { name: 'smss.exe', pid: 324, cpuPercent: 0, ramMB: 10, isHung: false, recommendation: 'Leave alone (Session Manager Subsystem).' },
      { name: 'wininit.exe', pid: 410, cpuPercent: 0, ramMB: 12, isHung: false, recommendation: 'Leave alone (Windows Start-Up Application).' }
    ]
  }
];
