import { useState, useRef } from 'react';
import ProjectTile from '../components/ProjectTile';
import NewProjectDialog from '../components/NewProjectDialog';
import SettingsDialog from '../components/SettingsDialog';
import PhraseConfirmDialog from '../components/PhraseConfirmDialog';
import './GridView.css';

function GridView({ projects, onProjectSelect, onAddProject, onDeleteProject, onDeleteProjects }) {
  const [showDialog, setShowDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showPhraseConfirm, setShowPhraseConfirm] = useState(false);
  const gridRef = useRef(null);

  const toggleSelectMode = () => {
    setSelectMode(m => !m);
    setSelectedIds(new Set());
  };

  const toggleTileSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = () => {
    setShowPhraseConfirm(true);
  };

  const handlePhraseConfirm = () => {
    onDeleteProjects([...selectedIds]);
    setSelectedIds(new Set());
    setSelectMode(false);
    setShowPhraseConfirm(false);
  };

  const handleAddClick = () => setShowDialog(true);
  const handleDialogClose = () => setShowDialog(false);
  const handleDialogSubmit = (project) => { onAddProject(project); setShowDialog(false); };
  const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

  return (
    <div className="grid-view" ref={gridRef} onMouseMove={handleMouseMove}>
      <header className="grid-header">
        <h1>Clocker</h1>
        <div className="header-controls">
          <button className="btn-secondary btn-settings" onClick={() => setShowSettings(true)} title="Settings">⚙</button>
        </div>
      </header>

      <div className="projects-section">
        <div className="projects-container">
          <div className="projects-header">
            <h2 className="projects-title">My Projects</h2>
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
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. Create one to get started!</p>
              </div>
            ) : (
              projects.map(project => (
                <ProjectTile
                  key={project.id}
                  project={project}
                  onClick={() => selectMode ? toggleTileSelect(project.id) : onProjectSelect(project)}
                  mousePos={mousePos}
                  selectMode={selectMode}
                  selected={selectedIds.has(project.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showDialog && (
        <NewProjectDialog projects={projects} onClose={handleDialogClose} onSubmit={handleDialogSubmit} />
      )}

      {showSettings && (
        <SettingsDialog onClose={() => setShowSettings(false)} />
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
