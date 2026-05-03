import { useState, useEffect, useRef } from 'react';
import { LocalStorage } from '../utils/LocalStorage';
import { formatDuration, getDurationSeconds, isActive } from '../utils/TimeUtils';
import { Project } from '../types';
import ProjectIcon from './ProjectIcon';
import starUnfilledSvg from '../assets/star_unfilled.svg';
import starFilledSvg from '../assets/star_filled.svg';
import './ProjectTile.css';

interface Props {
  project: Project;
  onClick: () => void;
  selectMode: boolean;
  selected: boolean;
  mousePos: { x: number; y: number } | null;
  onStarToggle: () => void;
}

function ProjectTile({ project, onClick, selectMode, selected, mousePos, onStarToggle }: Props) {
  const [baseTotalSeconds, setBaseTotalSeconds] = useState(0);
  const [activeStartTime, setActiveStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logs = LocalStorage.loadLogs(project.id);
    const activeLog = logs.find(log => isActive(log));
    const base = logs.reduce((sum, log) => isActive(log) ? sum : sum + getDurationSeconds(log.startTime, log.endTime), 0);
    setBaseTotalSeconds(base);
    setActiveStartTime(activeLog ? activeLog.startTime : null);
    setElapsedSeconds(activeLog ? Math.floor((new Date().getTime() - activeLog.startTime.getTime()) / 1000) : 0);
  }, [project.id]);

  useEffect(() => {
    if (!activeStartTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((new Date().getTime() - activeStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeStartTime]);

  useEffect(() => {
    if (!tileRef.current || !mousePos) {
      setRotation({ x: 0, y: 0 });
      return;
    }
    const strength = LocalStorage.getOrbitStrength();
    const inverted = LocalStorage.getInvertOrbit();
    const rect = tileRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (mousePos.x - centerX) / (rect.width / 2);
    const distY = (mousePos.y - centerY) / (rect.height / 2);
    let rotX = distY * strength;
    let rotY = distX * -strength;
    if (inverted) { rotX = -rotX; rotY = -rotY; }
    setRotation({
      x: Math.max(-strength, Math.min(strength, rotX)),
      y: Math.max(-strength, Math.min(strength, rotY)),
    });
  }, [mousePos]);

  const totalTime = baseTotalSeconds + elapsedSeconds;
  const isClocked = !!activeStartTime;

  const classes = ['project-tile', selected ? 'selected' : ''].filter(Boolean).join(' ');
  const transform = `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${hovered ? 1.07 : 1}) translateZ(0)`;

  return (
    <div
      ref={tileRef}
      className={classes}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transform }}
    >
      {selectMode ? (
        <div className={`tile-checkbox${selected ? ' checked' : ''}`}>
          {selected && <span>✓</span>}
        </div>
      ) : (
        <button
          className={`tile-star${project.starred ? ' starred' : ''}`}
          onClick={(e) => { e.stopPropagation(); onStarToggle(); }}
        >
          <img src={project.starred ? starFilledSvg : starUnfilledSvg} alt="Star" />
        </button>
      )}
      <div className="tile-icon">
        <ProjectIcon iconId={project.icon} className="icon-img" />
      </div>
      <div className="tile-content">
        <h3>{project.name}</h3>
        {project.description
          ? <p>{project.description}</p>
          : <p className="no-description">No description</p>
        }
      </div>
      <div className="tile-footer">
        <span className="tile-time">{formatDuration(totalTime)}</span>
        {isClocked && <span className="tile-badge">Active</span>}
      </div>
    </div>
  );
}

export default ProjectTile;
