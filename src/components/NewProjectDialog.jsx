import { useState, useRef } from 'react';
import IconSelector from './IconSelector';
import './NewProjectDialog.css';

const ICON_IDS = ['clock', 'code', 'wrench', 'folder', 'chart', 'game', 'bookmark', 'terminal', 'graduation', 'pencil'];

const NAME_FIRST = [
  'Client', 'Admin', 'Analytics', 'Internal', 'Core', 'Cloud',
  'Smart', 'Rapid', 'Open', 'Edge', 'Budget', 'Auth',
  'Data', 'Task', 'Report', 'User', 'Invoice', 'Legacy',
  'Dark', 'Pixel', 'Indie', 'Retro', 'Neon', 'Cyber',
  'Space', 'Tiny', 'Rogue', 'Cursed', 'Haunted', 'Epic',
];
const NAME_SECOND = [
  'Dashboard', 'Portal', 'Tracker', 'Manager', 'API',
  'Service', 'Tool', 'Monitor', 'Hub', 'Engine',
  'Scanner', 'Builder', 'Gateway', 'Platform', 'Bot',
  'Suite', 'CLI', 'App', 'System', 'Pipeline',
  'Game', 'Adventure', 'Horror', 'RPG', 'Platformer',
  'Dungeon', 'Simulator', 'Shooter', 'Puzzle', 'Quest',
];

const ML = {
  lang:     ['C#', 'Java', 'Python', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP', 'Ruby', 'Node.js', 'React', 'Vue', 'Unity', 'Unreal', 'Godot', 'OpenGL', 'WebGL'],
  type:     ['API', 'CLI', 'dashboard', 'microservice', 'library', 'plugin', 'web app', 'mobile app', 'bot', 'service', 'game', 'engine', 'mod', 'level editor'],
  task:     ['invoicing', 'scheduling', 'reporting', 'onboarding', 'authentication', 'deployment', 'monitoring', 'billing', 'inventory', 'payroll', 'compliance', 'data sync', 'file uploads', 'notifications', 'pathfinding', 'collision detection', 'procedural generation', 'save states', 'shader rendering', 'AI behaviour'],
  task2:    ['reporting', 'user management', 'access control', 'audit logging', 'rate limiting', 'caching', 'search', 'exports', 'leaderboards', 'physics simulation', 'animation blending', 'particle effects'],
  team:     ['the ops team', 'the sales team', 'the client', 'internal teams', 'enterprise customers', 'the dev team', 'stakeholders', 'end users', 'the finance team', 'a solo dev', 'a small indie team'],
  deadline: ['Q4', 'the next sprint', 'the audit', 'the launch', 'the migration', 'go-live', 'the demo', 'the game jam'],
  industry: ['healthcare', 'fintech', 'e-commerce', 'logistics', 'SaaS', 'retail', 'enterprise', 'indie gaming', 'mobile gaming'],
  legacy:   ['aging', 'spaghetti', 'unmaintained', 'brittle', 'legacy', 'monolithic', 'undocumented'],
  adj:      ['lightweight', 'scalable', 'internal', 'client-facing', 'automated', 'real-time', 'self-hosted', '2D', '3D', 'top-down', 'side-scrolling', 'isometric', 'multiplayer'],
};

const DESC_TEMPLATES = [
  () => `A ${pick(ML.lang)} ${pick(ML.type)} for managing ${pick(ML.task)} across ${pick(ML.team)}.`,
  () => `${pick(ML.adj)} ${pick(ML.type)} for ${pick(ML.team)} to handle ${pick(ML.task)} and ${pick(ML.task2)}.`,
  () => `Internal ${pick(ML.lang)}/${pick(ML.lang)} service for ${pick(ML.task)} and ${pick(ML.task2)}.`,
  () => `Refactoring the ${pick(ML.legacy)} ${pick(ML.type)} before ${pick(ML.deadline)}.`,
  () => `Client-facing ${pick(ML.lang)} ${pick(ML.type)} for ${pick(ML.industry)} ${pick(ML.task)}.`,
  () => `Migrating ${pick(ML.task)} from ${pick(ML.lang)} to ${pick(ML.lang)}.`,
  () => `${pick(ML.task)} automation for ${pick(ML.team)}.`,
  () => `${pick(ML.adj)} ${pick(ML.lang)} ${pick(ML.type)} for ${pick(ML.task)} tracking.`,
  () => `Rebuilding ${pick(ML.task)} before ${pick(ML.deadline)}. ${pick(ML.lang)} this time.`,
  () => `${pick(ML.lang)} ${pick(ML.type)} handling ${pick(ML.task)} and ${pick(ML.task2)} for ${pick(ML.industry)}.`,
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function luckyName() {
  return `${pick(NAME_FIRST)} ${pick(NAME_SECOND)}`;
}

function luckyDesc() {
  const result = pick(DESC_TEMPLATES)();
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const NAME_MAX = 67;
const DESC_MAX = 135;

function NewProjectDialog({ project, projects = [], onClose, onSubmit }) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [icon, setIcon] = useState(project?.icon || 'clock');
  const [nameError, setNameError] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [userTyped, setUserTyped] = useState(false);
  const spinRef = useRef(null);

  const isDuplicate = (val) =>
    projects.some(p => p.name.trim().toLowerCase() === val.trim().toLowerCase() && p.id !== project?.id);

  const handleNameChange = (val) => {
    setName(val);
    setUserTyped(true);
    setNameError(isDuplicate(val) ? 'A project with this name already exists.' : '');
  };

  const nameOver = name.length - NAME_MAX;
  const descOver = description.length - DESC_MAX;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isDuplicate(name)) { setNameError('A project with this name already exists.'); return; }
    if (nameOver > 0 || descOver > 0) return;
    onSubmit({ id: project?.id, name, description, icon });
  };

  const handleLucky = () => {
    if (spinning) return;

    let finalName = luckyName();
    let attempts = 0;
    while (isDuplicate(finalName) && attempts < 20) { finalName = luckyName(); attempts++; }
    const finalDesc = luckyDesc();
    const finalIcon = pick(ICON_IDS);

    const duration = 1000 + Math.random() * 1000;
    const extraCycles = 3 + Math.floor(Math.random() * 3); // 3–5 slow cycles at the end
    const start = performance.now();
    let slowCyclesLeft = extraCycles;
    setSpinning(true);
    setNameError('');

    const spin = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Interval slows from 60ms to 220ms as progress increases
      const interval = 60 + progress * 160;

      setName(luckyName());
      setDescription(luckyDesc());
      setIcon(pick(ICON_IDS));

      if (progress < 1) {
        spinRef.current = setTimeout(() => spin(performance.now()), interval);
      } else if (slowCyclesLeft > 0) {
        slowCyclesLeft--;
        spinRef.current = setTimeout(() => spin(performance.now()), 220);
      } else {
        setName(finalName);
        setDescription(finalDesc);
        setIcon(finalIcon);
        setSpinning(false);
      }
    };

    spinRef.current = setTimeout(() => spin(performance.now()), 60);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>{project ? 'Edit Project' : 'New Project'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="field-label-row">
              <label>Name</label>
              <span className={`char-counter ${nameOver > 0 ? 'over' : nameOver > -10 ? 'near' : ''}`}>
                {nameOver > 0 ? `-${nameOver}` : NAME_MAX - name.length}
              </span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Project name"
              autoFocus
              className={nameOver > 0 || nameError ? 'input-over' : ''}
            />
            {nameError && <p className="field-error">{nameError}</p>}
          </div>

          <div className="form-group">
            <div className="field-label-row">
              <label>Description</label>
              <span className={`char-counter ${descOver > 0 ? 'over' : descOver > -10 ? 'near' : ''}`}>
                {descOver > 0 ? `-${descOver}` : DESC_MAX - description.length}
              </span>
            </div>
            <input
              type="text"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setUserTyped(true); }}
              placeholder="Optional description"
              className={descOver > 0 ? 'input-over' : ''}
            />
          </div>

          <div className="form-group">
            <label>Icon</label>
            <IconSelector selectedIcon={icon} onSelect={setIcon} />
          </div>

          <div className="dialog-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!!nameError || !name.trim() || spinning || nameOver > 0 || descOver > 0}>{project ? 'Save' : 'Create'}</button>
          </div>

          {!project && !name && !description && (
            <div className="lucky-row">
              <div className="lucky-border-wrap">
                <button type="button" className="btn-lucky" onClick={handleLucky} disabled={spinning}>
                  {spinning ? 'Feeling lucky...' : "I'm Feeling Lucky!"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default NewProjectDialog;
