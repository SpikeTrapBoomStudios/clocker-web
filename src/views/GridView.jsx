import { useState, useRef, useMemo } from 'react';
import accountCircleIcon from '../assets/account_circle.svg';

import ProjectTile from '../components/ProjectTile';
import NewProjectDialog from '../components/NewProjectDialog';
import SettingsDialog from '../components/SettingsDialog';
import PhraseConfirmDialog from '../components/PhraseConfirmDialog';
import { LocalStorage } from '../utils/LocalStorage.js';
import { getDurationSeconds, isActive } from '../utils/timeUtils';
import './GridView.css';

const SORT_OPTIONS = [
  { value: 'most-time',    label: 'Most time' },
  { value: 'least-time',   label: 'Least time' },
  { value: 'most-recent',  label: 'Most recent' },
  { value: 'least-recent', label: 'Least recent' },
  { value: 'name-asc',     label: 'Name A–Z' },
  { value: 'name-desc',    label: 'Name Z–A' },
];

function GridView({ projects, onProjectSelect, onAddProject, onDeleteProject, onDeleteProjects, user, onSignIn, onSignOut }) {
  const [showDialog, setShowDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showPhraseConfirm, setShowPhraseConfirm] = useState(false);
  const [mousePos, setMousePos] = useState(null);
  const [sortMethod, setSortMethod] = useState(() => LocalStorage.getSortMethod());
  const hasHover = useRef(window.matchMedia('(hover: hover)').matches);

  const projectStats = useMemo(() => {
    return projects.map(project => {
      const logs = LocalStorage.loadLogs(project.id);
      const totalSeconds = logs.reduce((sum, log) => {
        if (isActive(log)) return sum + Math.floor((new Date() - log.startTime) / 1000);
        return sum + getDurationSeconds(log.startTime, log.endTime);
      }, 0);
      const mostRecentDate = logs.reduce((max, log) => {
        const t = log.startTime ? log.startTime.getTime() : 0;
        return t > max ? t : max;
      }, 0);
      return { id: project.id, totalSeconds, mostRecentDate };
    });
  }, [projects]);

  const sortedProjects = useMemo(() => {
    const statsMap = new Map(projectStats.map(s => [s.id, s]));
    return [...projects].sort((a, b) => {
      const sa = statsMap.get(a.id);
      const sb = statsMap.get(b.id);
      switch (sortMethod) {
        case 'most-time':    return sb.totalSeconds - sa.totalSeconds;
        case 'least-time':   return sa.totalSeconds - sb.totalSeconds;
        case 'most-recent':  return sb.mostRecentDate - sa.mostRecentDate;
        case 'least-recent': return sa.mostRecentDate - sb.mostRecentDate;
        case 'name-asc':     return a.name.localeCompare(b.name);
        case 'name-desc':    return b.name.localeCompare(a.name);
        default:             return 0;
      }
    });
  }, [projects, projectStats, sortMethod]);

  const handleSortChange = (e) => {
    const method = e.target.value;
    setSortMethod(method);
    LocalStorage.setSortMethod(method);
  };

  const toggleSelectMode = () => {
    setSelectMode(isSelectMode => !isSelectMode);
    setSelectedIds(new Set());
  };

  const toggleTileSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = () => setShowPhraseConfirm(true);

  const handlePhraseConfirm = () => {
    onDeleteProjects([...selectedIds]);
    setSelectedIds(new Set());
    setSelectMode(false);
    setShowPhraseConfirm(false);
  };

  const handleTileClick = (project) => {
    if (selectMode) {
      toggleTileSelect(project.id);
      return;
    }
    onProjectSelect(project);
  };

  const handleAddClick = () => setShowDialog(true);
  const handleDialogClose = () => setShowDialog(false);
  const handleDialogSubmit = (project) => { onAddProject(project); setShowDialog(false); };

  return (
    <div
      className="grid-view"
      onMouseMove={(e) => { if (hasHover.current) setMousePos({ x: e.clientX, y: e.clientY }); }}
      onMouseLeave={() => setMousePos(null)}
    >
      <header className="grid-header">
        <h1>Clocker</h1>
        <div className="header-controls">
          <button className="btn-secondary btn-settings" onClick={() => setShowSettings(true)} title="Settings">⚙</button>
          {user === undefined ? null : user
            ? <>
                <button className="btn-secondary btn-auth" onClick={onSignOut}>Sign out</button>
                <button className="btn-secondary btn-account" onClick={() => setShowAccount(true)}>
                  <img src={accountCircleIcon} alt="Account" />
                </button>
              </>
            : <button className="btn-secondary btn-auth" onClick={onSignIn}>Sign in with Google</button>
          }
        </div>
      </header>

      <div className="main-content">
        <div className="projects-section">
          <div className="projects-container">
            <div className="projects-header">
              <div className="projects-header-left">
                <h2 className="projects-title">My Projects</h2>
                <div className="sort-control">
                  <label className="sort-label" htmlFor="sort-select">Sort:</label>
                  <select
                    id="sort-select"
                    className="sort-select"
                    value={sortMethod}
                    onChange={handleSortChange}
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="projects-header-actions">
                {selectMode && selectedIds.size > 0 && (
                  <button className="btn-danger btn-delete-selected" onClick={handleDeleteSelected}>
                    Delete {selectedIds.size} selected
                  </button>
                )}
                <button className={`btn-select ${selectMode ? 'active' : ''}`} onClick={toggleSelectMode}>Select</button>
                <button className="btn-primary" onClick={handleAddClick}>+ New Project</button>
              </div>
            </div>
            <div className="projects-grid">
              {sortedProjects.length === 0 ? (
                <div className="empty-state">
                  <p>No projects yet. Create one to get started!</p>
                </div>
              ) : (
                sortedProjects.map(project => (
                  <ProjectTile
                    key={project.id}
                    project={project}
                    onClick={() => handleTileClick(project)}
                    selectMode={selectMode}
                    selected={selectedIds.has(project.id)}
                    mousePos={mousePos}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showDialog && (
        <NewProjectDialog projects={projects} onClose={handleDialogClose} onSubmit={handleDialogSubmit} />
      )}

      {showSettings && (
        <SettingsDialog onClose={() => setShowSettings(false)} />
      )}

      {showAccount && (
        <div className="dialog-overlay" onClick={() => setShowAccount(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Account</h2>
              <button className="btn-close" onClick={() => setShowAccount(false)}>✕</button>
            </div>
            <div className="setting">
              <p><strong>Account Name:</strong> {user.displayName}</p>
            </div>
          </div>
        </div>
      )}

      {showPhraseConfirm && (
        <PhraseConfirmDialog
          count={selectedIds.size}
          onConfirm={handlePhraseConfirm}
          onCancel={() => setShowPhraseConfirm(false)}
        />
      )}
    </div>
  );
}

export default GridView;
