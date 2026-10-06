import React from 'react';
import { 
  CheckCircle2, 
  Terminal, 
  Activity, 
  Folder, 
  GitBranch, 
  Check, 
  XCircle, 
  RotateCcw 
} from 'lucide-react';
import { useForensics } from '../context/ForensicContext';
import { PageHeader, StatCard, Card, CardHeader, CardBody, Badge, Button } from './ui';
import { CyberNotificationPopup } from './CyberNotificationPopup';

export const AdminModule4Page = () => {
  const { 
    tasks, 
    approveTask, 
    rejectTask, 
    clearTask 
  } = useForensics();

  const techTask = tasks?.find(t => t.id === 'mod-4-techhardware') || {
    id: 'mod-4-techhardware',
    title: 'Module 4: Developer & OS Survival',
    status: 'PENDING',
    tracksCleared: 0
  };

  const tracksCleared = techTask.tracksCleared || 0;
  const isSubmitted = techTask.status === 'SUBMITTED' || techTask.status === 'VERIFIED';
  
  const handleApprove = () => {
    if (approveTask) {
      approveTask('mod-4-techhardware', 'Supervisor verified candidate developer OS skills.');
    }
  };

  const handleReject = () => {
    if (rejectTask) {
      rejectTask('mod-4-techhardware', 'Candidate needs to repeat Developer OS Survival tracks.');
    }
  };

  const handleResetForCandidate = () => {
    if (clearTask) {
      clearTask('mod-4-techhardware');
    }
    const keysToReset = [
      'mod4_t1Day', 'mod4_t2Day', 'mod4_t3Day', 'mod4_t4Day', 'mod4_t5Day',
      'mod4_t1Index', 'mod4_t2Index', 'mod4_t3Solved', 'mod4_t4Killed', 'mod4_t5Step',
      'mod4_t1Date', 'mod4_t2Date', 'mod4_t3Date', 'mod4_t4Date', 'mod4_t5Date',
      'mod4_activeTab'
    ];
    keysToReset.forEach(key => localStorage.removeItem(key));
    alert('Candidate progress reset successfully!');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <CyberNotificationPopup />

      {/* HEADER SECTION */}
      <PageHeader
        title="Module 4: Developer & OS Survival"
        subtitle="Verify candidate's practical operational skills across Terminal CLI, File Architecture, Task Management, and Git Operations."
        actions={
          <Button variant="secondary" icon={<RotateCcw className="w-4 h-4" />} onClick={handleResetForCandidate}>
            Force Reset Track
          </Button>
        }
      />

      {/* KPI OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Track Completion"
          value={`${tracksCleared} / 5`}
          subtext="Developer disciplines mastered"
          icon={<Terminal className="w-5 h-5" />}
          progress={tracksCleared * 20}
        />
        <StatCard
          label="Submission Status"
          value={techTask.status === 'VERIFIED' ? 'Verified' : isSubmitted ? 'Pending Review' : 'Incomplete'}
          subtext={isSubmitted ? 'Awaiting final approval' : 'Candidate is still working'}
          icon={<Activity className="w-5 h-5" />}
          variant={techTask.status === 'VERIFIED' ? 'success' : isSubmitted ? 'warning' : 'default'}
        />
        <Card className="flex flex-col justify-center items-center p-6 bg-surface-raised">
          <div className="flex gap-3">
            <Button variant="danger" disabled={!isSubmitted} onClick={handleReject} icon={<XCircle />}>Reject</Button>
            <Button variant="success" disabled={!isSubmitted || techTask.status === 'VERIFIED'} onClick={handleApprove} icon={<CheckCircle2 />}>Approve</Button>
          </div>
        </Card>
      </div>

      {/* TRACKS BREAKDOWN */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-content-secondary uppercase tracking-widest">OS Disciples Verified</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className={`transition-all ${tracksCleared >= 1 ? 'border-status-success/30' : ''}`}>
            <CardBody className="flex flex-col items-center justify-center text-center p-6 gap-3">
              <Terminal className={`w-8 h-8 ${tracksCleared >= 1 ? 'text-status-success' : 'text-content-muted'}`} />
              <span className="font-semibold text-content-primary">Terminal Rookie</span>
              <Badge variant={tracksCleared >= 1 ? 'success' : 'neutral'}>{tracksCleared >= 1 ? 'Passed' : 'Pending'}</Badge>
            </CardBody>
          </Card>
          <Card className={`transition-all ${tracksCleared >= 2 ? 'border-status-success/30' : ''}`}>
            <CardBody className="flex flex-col items-center justify-center text-center p-6 gap-3">
              <Folder className={`w-8 h-8 ${tracksCleared >= 2 ? 'text-status-success' : 'text-content-muted'}`} />
              <span className="font-semibold text-content-primary">File Architect</span>
              <Badge variant={tracksCleared >= 2 ? 'success' : 'neutral'}>{tracksCleared >= 2 ? 'Passed' : 'Pending'}</Badge>
            </CardBody>
          </Card>
          <Card className={`transition-all ${tracksCleared >= 3 ? 'border-status-success/30' : ''}`}>
            <CardBody className="flex flex-col items-center justify-center text-center p-6 gap-3">
              <Activity className={`w-8 h-8 ${tracksCleared >= 3 ? 'text-status-success' : 'text-content-muted'}`} />
              <span className="font-semibold text-content-primary">Crash Doctor</span>
              <Badge variant={tracksCleared >= 3 ? 'success' : 'neutral'}>{tracksCleared >= 3 ? 'Passed' : 'Pending'}</Badge>
            </CardBody>
          </Card>
          <Card className={`transition-all ${tracksCleared >= 4 ? 'border-status-success/30' : ''}`}>
            <CardBody className="flex flex-col items-center justify-center text-center p-6 gap-3">
              <CheckCircle2 className={`w-8 h-8 ${tracksCleared >= 4 ? 'text-status-success' : 'text-content-muted'}`} />
              <span className="font-semibold text-content-primary">Keyboard Ninja</span>
              <Badge variant={tracksCleared >= 4 ? 'success' : 'neutral'}>{tracksCleared >= 4 ? 'Passed' : 'Pending'}</Badge>
            </CardBody>
          </Card>
          <Card className={`transition-all ${tracksCleared >= 5 ? 'border-status-success/30' : ''}`}>
            <CardBody className="flex flex-col items-center justify-center text-center p-6 gap-3">
              <GitBranch className={`w-8 h-8 ${tracksCleared >= 5 ? 'text-status-success' : 'text-content-muted'}`} />
              <span className="font-semibold text-content-primary">Git Conveyor</span>
              <Badge variant={tracksCleared >= 5 ? 'success' : 'neutral'}>{tracksCleared >= 5 ? 'Passed' : 'Pending'}</Badge>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminModule4Page;
