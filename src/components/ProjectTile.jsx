import { useState, useEffect, useRef } from 'react';
import { Storage } from '../utils/Storage';
import { formatDuration, getDurationSeconds, isActive } from '../utils/timeUtils';
import ProjectIcon from './ProjectIcon';
import './ProjectTile.css';

function ProjectTile({ project, onClick, mousePos, selectMode, selected }) {
  const [totalTime, setTotalTime] = useState(0);
  const [isClocked, setIsClocked] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const tileRef = useRef(null);

  useEffect(() => {
    const logs = Storage.loadLogs(project.id);
    const total = logs.reduce((sum, log) => sum + getDurationSeconds(log.startTime, log.endTime), 0);
    const active = logs.some(log => isActive(log));
    setTotalTime(total);
    setIsClocked(active);
  }, [project.id]);

  useEffect(() => {
    if (!tileRef.current || !mousePos) return;

    const strength = Storage.getEffectStrength();
    const inverted = Storage.getInvertEffect();
    const rect = tileRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = (mousePos.x - centerX) / (rect.width / 2);
    const distY = (mousePos.y - centerY) / (rect.height / 2);

    let rotX = distY * strength;
    let rotY = distX * -strength;

    if (inverted) {
      rotX = -rotX;
      rotY = -rotY;
    }

    setRotation({
      x: Math.max(-strength, Math.min(strength, rotX)),
      y: Math.max(-strength, Math.min(strength, rotY)),
    });
  }, [mousePos]);

  return (
    <div
      ref={tileRef}
      className={`project-tile${selected ? ' selected' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${hovered ? 1.07 : 1}) translateZ(0)`,
        transition: 'transform 0.1s ease',
      }}
    >
      {selectMode && (
        <div className={`tile-checkbox${selected ? ' checked' : ''}`}>
          {selected && <span>✓</span>}
        </div>
      )}
      <div className="tile-icon">
        <ProjectIcon iconId={project.icon} className="icon-img" />
      </div>
      <div className="tile-content">
        <h3>{project.name}</h3>
        {project.description
          ? <p>{project.description}</p>
          : <p className="no-description">No Description</p>
        }
        <div className="tile-footer">
          <span className="tile-time">{formatDuration(totalTime)}</span>
          {isClocked && <span className="tile-badge">Active</span>}
        </div>
      </div>
    </div>
  );
}

export default ProjectTile;
