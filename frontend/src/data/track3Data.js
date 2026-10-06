/**
 * @file track3Data.js
 * @description Track 3 File Architect 6-day curriculum.
 */

export const track3_days = [
  {
    day: 1,
    title: 'Extension Disguises',
    files: [
      { id: 1, fileName: 'notes.pdf.exe', fileType: 'Executable', isMalicious: true, actionNeeded: 'flag as malware', explanation: 'Double extension trick. The real extension is .exe, indicating an executable that could be malicious.' },
      { id: 2, fileName: 'report.docx', fileType: 'Word Document', isMalicious: false, actionNeeded: 'open normally', explanation: 'Standard Word document without suspicious characteristics.' },
      { id: 3, fileName: 'setup_crack.zip.scr', fileType: 'Screen saver', isMalicious: true, actionNeeded: 'delete immediately', explanation: '.scr files are executables often used to distribute malware under the guise of an archive.' },
      { id: 4, fileName: 'holiday_pics.jpg.vbs', fileType: 'VBScript', isMalicious: true, actionNeeded: 'flag as malware', explanation: 'VBScript files disguised as images can execute malicious code upon opening.' },
      { id: 5, fileName: 'meeting_minutes.txt', fileType: 'Text File', isMalicious: false, actionNeeded: 'open normally', explanation: 'A standard text file that does not pose a threat.' }
    ]
  },
  {
    day: 2,
    title: 'Archive Inspection',
    files: [
      { id: 1, fileName: 'project-v2.zip', fileType: 'Archive', isMalicious: false, actionNeeded: 'extract before running', explanation: 'Standard zip file, safe to inspect its contents.' },
      { id: 2, fileName: 'invoice_final.pdf.bat', fileType: 'Batch file', isMalicious: true, actionNeeded: 'flag as malware', explanation: 'Batch scripts disguised as PDFs are extremely dangerous.' },
      { id: 3, fileName: 'family_photo.jpg', fileType: 'Image', isMalicious: false, actionNeeded: 'view normally', explanation: 'Standard image file.' },
      { id: 4, fileName: 'system_update.msi', fileType: 'Installer', isMalicious: false, actionNeeded: 'verify publisher first', explanation: 'Windows installer. Could be legitimate but always verify the signature.' },
      { id: 5, fileName: 'freemovies.rar.exe', fileType: 'Executable', isMalicious: true, actionNeeded: 'delete immediately', explanation: 'Self-extracting archives can hide malware and should be treated with high suspicion.' }
    ]
  },
  {
    day: 3,
    title: 'Advanced Threats',
    files: [
      { id: 1, fileName: 'resume_john.docm', fileType: 'Macro-enabled Word', isMalicious: false, actionNeeded: 'disable macros before opening', explanation: '.docm means it contains macros which could execute malicious VBA code.' },
      { id: 2, fileName: 'free_wifi_tool.exe', fileType: 'Executable', isMalicious: true, actionNeeded: 'delete and scan system', explanation: 'Highly suspicious executable from untrusted origins.' },
      { id: 3, fileName: 'database_backup.sql', fileType: 'SQL file', isMalicious: false, actionNeeded: 'open in editor', explanation: 'Plain text SQL backup file.' },
      { id: 4, fileName: 'annual_report.pdf', fileType: 'PDF Document', isMalicious: false, actionNeeded: 'view normally', explanation: 'Normal PDF document without embedded scripts.' },
      { id: 5, fileName: 'sys_driver_patch.sys', fileType: 'System File', isMalicious: true, actionNeeded: 'quarantine', explanation: 'Unexpected system files downloaded from the web often contain rootkits.' }
    ]
  },
  {
    day: 4,
    title: 'Hidden Payloads',
    files: [
      { id: 1, fileName: 'financial_q3.xlsx.vbs', fileType: 'VBScript', isMalicious: true, actionNeeded: 'delete immediately', explanation: 'A dangerous VBScript file masquerading as an Excel spreadsheet.' },
      { id: 2, fileName: 'meeting_notes.txt', fileType: 'Text File', isMalicious: false, actionNeeded: 'open normally', explanation: 'Standard text files cannot execute code.' },
      { id: 3, fileName: 'patch_1.0.4.zip', fileType: 'Archive', isMalicious: false, actionNeeded: 'extract before running', explanation: 'Always extract zip files fully before executing contents to avoid temp directory issues.' },
      { id: 4, fileName: 'video_player_codec.exe', fileType: 'Executable', isMalicious: true, actionNeeded: 'flag as malware', explanation: 'Codecs bundled as executables from untrusted sites frequently contain malware.' }
    ]
  },
  {
    day: 5,
    title: 'Deceptive Scripts',
    files: [
      { id: 1, fileName: 'clean_system.bat', fileType: 'Batch Script', isMalicious: true, actionNeeded: 'flag as malware', explanation: 'Unsolicited batch files claiming to clean your system often delete important files.' },
      { id: 2, fileName: 'server_config.yaml', fileType: 'Configuration', isMalicious: false, actionNeeded: 'open in editor', explanation: 'Standard YAML configuration file.' },
      { id: 3, fileName: 'game_installer.iso', fileType: 'Disk Image', isMalicious: false, actionNeeded: 'verify publisher first', explanation: 'ISO files can contain malware; always verify the digital signature of the publisher.' },
      { id: 4, fileName: 'budget_draft.pdf', fileType: 'PDF Document', isMalicious: false, actionNeeded: 'view normally', explanation: 'Standard PDF document.' },
      { id: 5, fileName: 'network_reset.ps1', fileType: 'PowerShell Script', isMalicious: true, actionNeeded: 'delete immediately', explanation: 'Unverified PowerShell scripts can silently modify system network configurations.' }
    ]
  },
  {
    day: 6,
    title: 'Zero-Day Simulation',
    files: [
      { id: 1, fileName: 'urgent_invoice.html', fileType: 'HTML Document', isMalicious: true, actionNeeded: 'delete immediately', explanation: 'HTML attachments in unsolicited emails are often phishing attempts or contain drive-by downloads.' },
      { id: 2, fileName: 'update_service.dll', fileType: 'Dynamic Link Library', isMalicious: true, actionNeeded: 'delete and scan system', explanation: 'Random DLL files can be used for DLL hijacking. Very dangerous to keep around.' },
      { id: 3, fileName: 'marketing_assets.rar', fileType: 'Archive', isMalicious: false, actionNeeded: 'extract before running', explanation: 'RAR files should be extracted and scanned before interacting with contents.' },
      { id: 4, fileName: 'source_code.tar.gz', fileType: 'Archive', isMalicious: false, actionNeeded: 'extract safely', explanation: 'Standard source code archive.' },
      { id: 5, fileName: 'unknown_blob.bin', fileType: 'Binary File', isMalicious: true, actionNeeded: 'flag as malware', explanation: 'A completely unknown and untrusted binary blob.' }
    ]
  }
];
