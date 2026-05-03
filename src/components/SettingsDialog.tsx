import { useState } from 'react';
import { DEFAULT_DELETE_PHRASE, DEFAULT_INVERT_ORBIT, DEFAULT_ORBIT_STRENGTH } from '../utils/SettingsDefaults';
import { LocalStorage } from '../utils/LocalStorage';
import './SettingsDialog.css';

const hasHover = window.matchMedia('(hover: hover)').matches;

interface Props {
  onClose: () => void;
}

function SettingsDialog({ onClose }: Props) {
  const [deletePhrase, setDeletePhrase] = useState(LocalStorage.getDeletePhrase());
  const [orbitStrength, setOrbitStrength] = useState(LocalStorage.getOrbitStrength());
  const [invertOrbit, setInvertOrbit] = useState(LocalStorage.getInvertOrbit());

  const resetOrbitStrength = () => {
    setOrbitStrength(DEFAULT_ORBIT_STRENGTH);
    LocalStorage.setOrbitStrength(DEFAULT_ORBIT_STRENGTH);
  };

  const resetInvertOrbit = () => {
    setInvertOrbit(DEFAULT_INVERT_ORBIT);
    LocalStorage.setInvertOrbit(DEFAULT_INVERT_ORBIT);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Settings</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className={`setting setting-slider${!hasHover ? ' setting-disabled' : ''}`}>
          <div className="setting-title-row">
            <h3>Tile Orbit Strength</h3>
            <button className="btn-reset" onClick={resetOrbitStrength} title="Reset to default">↻</button>
          </div>
          <div className="setting-controls">
            <input
              type="range"
              className="strength-slider"
              min="0"
              max="10"
              step="0.5"
              value={orbitStrength}
              onChange={(e) => {
                const newStrength = parseFloat(e.target.value);
                setOrbitStrength(newStrength);
                LocalStorage.setOrbitStrength(newStrength);
              }}
            />
            <span className="strength-value">{orbitStrength.toFixed(1)}</span>
          </div>
        </div>

        <div className={`setting setting-checkbox${!hasHover ? ' setting-disabled' : ''}`}>
          <div className="setting-content">
            <h3>Invert Orbit Direction</h3>
          </div>
          <div className="setting-widget">
            <button className="btn-reset" onClick={resetInvertOrbit} title="Reset to default">↻</button>
            <input
              type="checkbox"
              className="checkbox-input"
              checked={invertOrbit}
              onChange={(e) => {
                setInvertOrbit(e.target.checked);
                LocalStorage.setInvertOrbit(e.target.checked);
              }}
            />
          </div>
        </div>

        <div className="setting setting-slider setting-text-entry">
          <div className="setting-title-row">
            <h3>Bulk Delete Confirmation Phrase</h3>
            <button
              className="btn-reset"
              onClick={() => {
                setDeletePhrase(DEFAULT_DELETE_PHRASE);
                LocalStorage.setDeletePhrase(DEFAULT_DELETE_PHRASE);
              }}
              title="Reset to default"
            >↻</button>
          </div>
          <input
            type="text"
            value={deletePhrase}
            onChange={(e) => {
              setDeletePhrase(e.target.value);
              LocalStorage.setDeletePhrase(e.target.value);
            }}
            style={{ width: '100%', marginTop: '8px', fontSize: '1.0em' }}
          />
        </div>
      </div>
    </div>
  );
}

export default SettingsDialog;
