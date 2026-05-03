import { useState, useEffect } from 'react';
import { Storage } from '../utils/Storage';
import { formatDuration, formatTime, formatDate, getDurationSeconds, isActive } from '../utils/TimeUtils';
import TimeLogTable from '../components/TimeLogTable';
import EditLogDialog from '../components/EditLogDialog';
import NewProjectDialog from '../components/NewProjectDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import ProjectIcon from '../components/ProjectIcon';
import arrowBackIcon from '../assets/arrow_back.svg';
import { Project, ProjectFormData, TimeLog } from '../types';
import './DetailView.css';

interface Props {
  project: Project;
  projects?: Project[];
  onBack: () => void;
  onEdit: (data: ProjectFormData) => void;
  onDelete: (projectId: string) => void;
  onActiveChange: (active: boolean) => void;
}

function DetailView({ project, projects = [], onBack, onEdit, onDelete, onActiveChange }: Props) {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingLog, setEditingLog] = useState<TimeLog | null>(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortColumn, setSortColumn] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    Storage.loadLogs(project.id).then(loadedLogs => {
      setLogs(loadedLogs);
      syncClockState(loadedLogs);
    });
  }, [project.id]);

  useEffect(() => {
    if (!clockedIn || !clockInTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((new Date().getTime() - clockInTime.getTime()) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [clockedIn, clockInTime]);

  const syncClockState = (logList: TimeLog[]) => {
    const activeLog = logList.find(log => isActive(log));
    if (activeLog) {
      setClockedIn(true);
      setClockInTime(activeLog.startTime);
    } else {
      setClockedIn(false);
      setElapsedSeconds(0);
    }
  };

  const handleClockToggle = () => {
    const now = new Date();
    const updatedLogs = [...logs];

    if (clockedIn) {
      const activeIndex = updatedLogs.findIndex(log => isActive(log));
      if (activeIndex >= 0) updatedLogs[activeIndex] = { ...updatedLogs[activeIndex], endTime: now };
      setClockedIn(false);
      setElapsedSeconds(0);
    } else {
      updatedLogs.push({ date: now, startTime: now, endTime: null });
      setClockedIn(true);
      setClockInTime(now);
    }

    setLogs(updatedLogs);
    Storage.saveLogs(project.id, updatedLogs);
    onActiveChange(!clockedIn);
  };

  const handleDeleteRow = (index: number) => {
    const updatedLogs = logs.filter((_, i) => i !== index);
    setLogs(updatedLogs);
    Storage.saveLogs(project.id, updatedLogs);
  };

  const handleEditDialogClose = () => {
    setShowEditDialog(false);
    setEditingLog(null);
  };

  const handleEditDialogSubmit = (log: TimeLog) => {
    let updatedLogs: TimeLog[];
    if (editingLog) {
      const index = logs.indexOf(editingLog);
      updatedLogs = [...logs];
      updatedLogs[index] = log;
    } else {
      updatedLogs = [...logs, log];
    }
    setLogs(updatedLogs);
    Storage.saveLogs(project.id, updatedLogs);
    handleEditDialogClose();
  };

  const handleExportCsv = () => {
    const headers = ['Date', 'Start Time', 'End Time', 'Duration'];
    const rows = logs.map(log => [
      formatDate(log.date),
      formatTime(log.startTime),
      log.endTime ? formatTime(log.endTime) : '(Active)',
      formatDuration(getDurationSeconds(log.startTime, log.endTime)),
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${project.name}-timelogs.csv`;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (column: number) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('desc');
    }
  };

  const getTotalSeconds = () =>
    logs.reduce((sum, log) => sum + getDurationSeconds(log.startTime, log.endTime), 0);

  const getSortedLogs = (): TimeLog[] => {
    return [...logs].sort((firstLog, secondLog) => {
      if (sortColumn === 0) {
        const diff = firstLog.date.getTime() - secondLog.date.getTime();
        return sortOrder === 'asc' ? diff : -diff;
      } else {
        const diff = getDurationSeconds(firstLog.startTime, firstLog.endTime) - getDurationSeconds(secondLog.startTime, secondLog.endTime);
        return sortOrder === 'asc' ? diff : -diff;
      }
    });
  };

  return (
    <div className="detail-view">
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>
          <img src={arrowBackIcon} alt="Back" className="btn-back-icon" />
          Back
        </button>
        <div className="project-info">
          <div className="project-title-row">
            {project.icon && <ProjectIcon iconId={project.icon} className="project-icon-img" />}
            <h1>{project.name}</h1>
          </div>
          {project.description && <p>{project.description}</p>}
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowProjectDialog(true)}>Edit</button>
          <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>Delete</button>
        </div>
      </div>

      <div className="clock-section">
        <button className={`btn-clock ${clockedIn ? 'active' : ''}`} onClick={handleClockToggle}>
          {clockedIn ? 'Clock Out' : 'Clock In'}
        </button>
        <div className="elapsed">
          <span className="elapsed-label">Elapsed</span>
          <span className="elapsed-time">{formatDuration(elapsedSeconds)}</span>
        </div>
      </div>

      <div className="logs-section">
        <div className="logs-header">
          <h2>Time Logs</h2>
          <div className="logs-actions">
            <button className="btn-secondary" onClick={() => { setEditingLog(null); setShowEditDialog(true); }}>+ Add Entry</button>
            <button className="btn-secondary" onClick={handleExportCsv}>Export CSV</button>
          </div>
        </div>
        <TimeLogTable
          logs={getSortedLogs()}
          onEdit={(log) => { setEditingLog(log); setShowEditDialog(true); }}
          onDelete={handleDeleteRow}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
        />
        <div className="total-section">
          <strong>Total: {formatDuration(getTotalSeconds())}</strong>
        </div>
      </div>

      {showEditDialog && (
        <EditLogDialog log={editingLog} onClose={handleEditDialogClose} onSubmit={handleEditDialogSubmit} />
      )}

      {showProjectDialog && (
        <NewProjectDialog
          project={project}
          projects={projects}
          onClose={() => setShowProjectDialog(false)}
          onSubmit={(data) => { onEdit(data); setShowProjectDialog(false); }}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          message={`Delete "${project.name}"?`}
          onConfirm={() => { onDelete(project.id); setShowDeleteConfirm(false); }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default DetailView;
