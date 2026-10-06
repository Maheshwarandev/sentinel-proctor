export const track2_days = [
  {
    day: 1,
    title: 'File System Basics',
    challenges: [
      { id: 1, prompt: 'C:\\Users\\Candidate>', task: 'Print the current working directory path.', expectedCommand: 'pwd', validRegex: /^(pwd|cd)$/i, hint: 'pwd or cd', outputSuccess: 'C:\\Users\\Candidate\n' },
      { id: 2, prompt: 'C:\\Users\\Candidate>', task: 'List all files and folders in the current directory.', expectedCommand: 'ls', validRegex: /^(dir|ls)$/i, hint: 'ls or dir', outputSuccess: '\n Directory of C:\\Users\\Candidate\n\n09/01/2026  10:00 AM    <DIR>          .\n09/01/2026  10:00 AM    <DIR>          ..\n               0 File(s)              0 bytes\n' },
      { id: 3, prompt: 'C:\\Users\\Candidate>', task: 'Move into the "projects" folder.', expectedCommand: 'cd projects', validRegex: /^cd\s+projects$/i, hint: 'cd <folder>', outputSuccess: 'Changed directory to C:\\Users\\Candidate\\projects' },
      { id: 4, prompt: 'C:\\Users\\Candidate\\projects>', task: 'Go back up one directory level.', expectedCommand: 'cd ..', validRegex: /^cd\s+\.\.$/i, hint: 'cd ..', outputSuccess: 'Changed directory to C:\\Users\\Candidate' }
    ]
  },
  {
    day: 2,
    title: 'File Operations',
    challenges: [
      { id: 1, prompt: 'C:\\Users\\Candidate>', task: 'Create a new folder named "portfolio".', expectedCommand: 'mkdir portfolio', validRegex: /^mkdir\s+portfolio$/i, hint: 'mkdir <name>', outputSuccess: 'Directory portfolio created.' },
      { id: 2, prompt: 'C:\\Users\\Candidate>', task: 'Create a new empty file named "index.html".', expectedCommand: 'touch index.html', validRegex: /^(touch|echo\.?\s*>)\s*index\.html$/i, hint: 'touch <file> or echo. > <file>', outputSuccess: 'File index.html created.' },
      { id: 3, prompt: 'C:\\Users\\Candidate>', task: 'Copy "source.js" to a new file called "dest.js".', expectedCommand: 'cp source.js dest.js', validRegex: /^(cp|copy)\s+source\.js\s+dest\.js$/i, hint: 'cp <src> <dest>', outputSuccess: '1 file(s) copied.' },
      { id: 4, prompt: 'C:\\Users\\Candidate>', task: 'Move "dest.js" into the "portfolio" folder.', expectedCommand: 'mv dest.js portfolio/', validRegex: /^(mv|move)\s+dest\.js\s+portfolio\/?$/i, hint: 'mv <file> <folder>', outputSuccess: '1 file(s) moved.' },
      { id: 5, prompt: 'C:\\Users\\Candidate>', task: 'Delete the file named "old.txt".', expectedCommand: 'rm old.txt', validRegex: /^(rm|del)\s+old\.txt$/i, hint: 'rm <file> or del <file>', outputSuccess: 'File old.txt deleted.' }
    ]
  },
  {
    day: 3,
    title: 'Network & System',
    challenges: [
      { id: 1, prompt: 'C:\\Users\\Candidate>', task: 'Check connectivity to google.com.', expectedCommand: 'ping google.com', validRegex: /^ping\s+google\.com$/i, hint: 'ping <domain>', outputSuccess: '\nPinging google.com with 32 bytes of data:\nReply from 142.250.190.46: bytes=32 time=12ms TTL=115\n' },
      { id: 2, prompt: 'C:\\Users\\Candidate>', task: 'Check your IP configuration.', expectedCommand: 'ipconfig', validRegex: /^(ipconfig|ifconfig)$/i, hint: 'ipconfig or ifconfig', outputSuccess: '\nWindows IP Configuration\n\nEthernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.10\n' },
      { id: 3, prompt: 'C:\\Users\\Candidate>', task: 'Check disk usage.', expectedCommand: 'df -h', validRegex: /^(df(\s+-h)?|wmic\s+diskdrive)/i, hint: 'df -h or wmic diskdrive', outputSuccess: 'Filesystem      Size  Used Avail Use% Mounted on\nC:              500G  200G  300G  40% /' },
      { id: 4, prompt: 'C:\\Users\\Candidate>', task: 'Display system information.', expectedCommand: 'uname -a', validRegex: /^(systeminfo|uname(\s+-a)?)$/i, hint: 'uname -a or systeminfo', outputSuccess: 'Host Name: WORKSTATION\nOS Name: Windows 11 Pro / Linux Kernel 5.15\n' },
      { id: 5, prompt: 'C:\\Users\\Candidate>', task: 'Clear the terminal screen.', expectedCommand: 'clear', validRegex: /^(cls|clear)$/i, hint: 'clear or cls', outputSuccess: '' }
    ]
  },
  {
    day: 4,
    title: 'Process Management',
    challenges: [
      { id: 1, prompt: 'C:\\Users\\Candidate>', task: 'List all currently running processes.', expectedCommand: 'ps aux', validRegex: /^(tasklist|ps(\s+aux)?)$/i, hint: 'ps aux or tasklist', outputSuccess: 'PID   USER     TIME  COMMAND\n1     root      0:01 /sbin/init\n4     System    0:00 Services\n' },
      { id: 2, prompt: 'C:\\Users\\Candidate>', task: 'Find a process running on port 8080.', expectedCommand: 'netstat -ano | grep 8080', validRegex: /^netstat\s+-ano\s+\|\s+(findstr|grep)\s+8080$/i, hint: 'netstat -ano | grep 8080', outputSuccess: '  TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       1204\n' },
      { id: 3, prompt: 'C:\\Users\\Candidate>', task: 'Force kill process with PID 1204.', expectedCommand: 'kill -9 1204', validRegex: /^(taskkill\s+\/F\s+\/PID\s+1204|kill\s+-9\s+1204)$/i, hint: 'kill -9 <id> or taskkill /F /PID <id>', outputSuccess: 'SUCCESS: The process with PID 1204 has been terminated.\n' },
      { id: 4, prompt: 'C:\\Users\\Candidate>', task: 'View real-time system performance (top/taskmgr).', expectedCommand: 'top', validRegex: /^(top|taskmgr)$/i, hint: 'top or taskmgr', outputSuccess: 'top - 12:45:32 up  4:20,  1 user,  load average: 0.14, 0.12, 0.09\nTasks: 120 total,   1 running, 119 sleeping' }
    ]
  },
  {
    day: 5,
    title: 'Search & Grep',
    challenges: [
      { id: 1, prompt: 'C:\\Users\\Candidate>', task: 'View the contents of server.log.', expectedCommand: 'cat server.log', validRegex: /^(type|cat)\s+server\.log$/i, hint: 'cat <file> or type <file>', outputSuccess: '[INFO] Server started on port 3000\n[ERROR] Database connection failed\n' },
      { id: 2, prompt: 'C:\\Users\\Candidate>', task: 'Find the string "password" inside config.txt.', expectedCommand: 'grep password config.txt', validRegex: /^(findstr|grep)\s+password\s+config\.txt$/i, hint: 'grep <text> <file> or findstr <text> <file>', outputSuccess: 'db_password=super_secret_123\n' },
      { id: 3, prompt: 'C:\\Users\\Candidate>', task: 'Search for all python files in the current folder.', expectedCommand: 'ls *.py', validRegex: /^(dir|ls)\s+\*\.py$/i, hint: 'ls *.py or dir *.py', outputSuccess: '10/06/2026  12:00 PM                45 script.py\n' },
      { id: 4, prompt: 'C:\\Users\\Candidate>', task: 'Echo "Hello World" into the terminal.', expectedCommand: 'echo "Hello World"', validRegex: /^echo\s+["']?Hello\s+World["']?$/i, hint: 'echo "Hello World"', outputSuccess: 'Hello World\n' },
      { id: 5, prompt: 'C:\\Users\\Candidate>', task: 'Redirect "Hello World" to a file named hello.txt.', expectedCommand: 'echo "Hello World" > hello.txt', validRegex: /^echo\s+["']?Hello\s+World["']?\s*>\s*hello\.txt$/i, hint: 'echo "Hello World" > hello.txt', outputSuccess: '' }
    ]
  },
  {
    day: 6,
    title: 'Advanced Operations',
    challenges: [
      { id: 1, prompt: 'C:\\Users\\Candidate>', task: 'Output the current logged in user.', expectedCommand: 'whoami', validRegex: /^whoami$/i, hint: 'whoami', outputSuccess: 'workstation\\candidate\n' },
      { id: 2, prompt: 'C:\\Users\\Candidate>', task: 'Display all environment variables.', expectedCommand: 'env', validRegex: /^(env|set)$/i, hint: 'env or set', outputSuccess: 'PATH=C:\\Windows\\System32;C:\\Program Files\\Git\\bin\nUSER=candidate\n' },
      { id: 3, prompt: 'C:\\Users\\Candidate>', task: 'Download a file using curl (https://example.com/data.json).', expectedCommand: 'curl -O https://example.com/data.json', validRegex: /^curl\s+-O\s+https:\/\/example\.com\/data\.json$/i, hint: 'curl -O <url>', outputSuccess: '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n                                 Dload  Upload   Total   Spent    Left  Speed\n100   128  100   128    0     0   1280      0 --:--:-- --:--:-- --:--:--  1280\n' },
      { id: 4, prompt: 'C:\\Users\\Candidate>', task: 'Show the manual/help page for the curl command.', expectedCommand: 'curl --help', validRegex: /^(man\s+curl|curl\s+--help)$/i, hint: 'man curl or curl --help', outputSuccess: 'Usage: curl [options...] <url>\nOptions: (H) means HTTP/HTTPS only, (F) means FTP only\n     --anyauth       Pick any authentication method\n -a, --append        Append to target file when uploading\n' }
    ]
  }
];
