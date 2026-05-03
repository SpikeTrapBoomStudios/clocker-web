import { useState, useEffect } from 'react';
import { LocalStorage } from '../utils/LocalStorage.js';
import { formatDuration, formatTime, formatDate, getDurationSeconds, isActive } from '../utils/timeUtils';
import TimeLogTable from '../components/TimeLogTable';
import EditLogDialog from '../components/EditLogDialog';
import NewProjectDialog from '../components/NewProjectDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import ProjectIcon from '../components/ProjectIcon';
import arrowBackIcon from '../assets/arrow_back.svg';
import './DetailView.css';

function DetailView({ project, projects = [], onBack, onEdit, onDelete }) {
  const [logs, setLogs] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortColumn, setSortColumn] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const loaded = LocalStorage.loadLogs(project.id);
    setLogs(loaded);
    syncClockState(loaded);
  }, [project.id]);

  useEffect(() => {
    if (!clockedIn) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - clockInTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [clockedIn, clockInTime]);

  const syncClockState = (logList) => {
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
    const newLogs = [...logs];

    if (clockedIn) {
      const activeIndex = newLogs.findIndex(log => isActive(log));
      if (activeIndex >= 0) {
        newLogs[activeIndex].endTime = now;
      }
      setClockedIn(false);
      setElapsedSeconds(0);
    } else {
      newLogs.push({
        date: now,
        startTime: now,
        endTime: null,
      });
      setClockedIn(true);
      setClockInTime(now);
    }

    setLogs(newLogs);
    LocalStorage.saveLogs(project.id, newLogs);
  };

  const handleAddEntry = () => {
    setEditingLog(null);
    setShowEditDialog(true);
  };

  const handleEditRow = (log) => {
    setEditingLog(log);
    setShowEditDialog(true);
  };

  const handleDeleteRow = (index) => {
    const newLogs = logs.filter((_, i) => i !== index);
    setLogs(newLogs);
    LocalStorage.saveLogs(project.id, newLogs);
  };

  const handleEditDialogClose = () => {
    setShowEditDialog(false);
    setEditingLog(null);
  };

  const handleEditDialogSubmit = (log) => {
    if (editingLog) {
      const index = logs.indexOf(editingLog);
      const newLogs = [...logs];
      newLogs[index] = log;
      setLogs(newLogs);
    } else {
      setLogs([...logs, log]);
    }
    LocalStorage.saveLogs(project.id, logs);
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

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${project.name}-timelogs.csv`;
    downloadLink.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('desc');
    }
  };

  const getTotalSeconds = () => {
    return logs.reduce((sum, log) => sum + getDurationSeconds(log.startTime, log.endTime), 0);
  };

  const getSortedLogs = () => {
    const sorted = [...logs];
    sorted.sort((firstLog, secondLog) => {
      let firstValue, secondValue;
      if (sortColumn === 0) { // Date
        firstValue = firstLog.date;
        secondValue = secondLog.date;
      } else if (sortColumn === 1) { // Duration
        firstValue = getDurationSeconds(firstLog.startTime, firstLog.endTime);
        secondValue = getDurationSeconds(secondLog.startTime, secondLog.endTime);
      }

      if (sortOrder === 'asc') {
        return firstValue > secondValue ? 1 : -1;
      } else {
        return firstValue < secondValue ? 1 : -1;
      }
    });
    return sorted;
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
        <button
          className={`btn-clock ${clockedIn ? 'active' : ''}`}
          onClick={handleClockToggle}
        >
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
            <button className="btn-secondary" onClick={handleAddEntry}>+ Add Entry</button>
            <button className="btn-secondary" onClick={handleExportCsv}>Export CSV</button>
          </div>
        </div>

        <TimeLogTable
          logs={getSortedLogs()}
          onEdit={handleEditRow}
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
        <EditLogDialog
          log={editingLog}
          onClose={handleEditDialogClose}
          onSubmit={handleEditDialogSubmit}
        />
      )}

      {showProjectDialog && (
        <NewProjectDialog
          project={project}
          projects={projects}
          onClose={() => setShowProjectDialog(false)}
          onSubmit={(updated) => {
            onEdit(updated);
            setShowProjectDialog(false);
          }}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          message={`Delete "${project.name}"?`}
          onConfirm={() => {
            onDelete(project.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default DetailView;
