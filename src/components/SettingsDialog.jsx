import { useState } from 'react';
import { Storage } from '../utils/Storage';
import './SettingsDialog.css';

function SettingsDialog({ onClose }) {
  const [effectStrength, setEffectStrength] = useState(Storage.getEffectStrength());
  const [invertEffect, setInvertEffect] = useState(Storage.getInvertEffect());
  const [deletePhrase, setDeletePhrase] = useState(Storage.getDeletePhrase());

  const DEFAULT_STRENGTH = 4.0;
  const DEFAULT_INVERT = true;

  const handleStrengthChange = (value) => {
    const numValue = parseFloat(value);
    setEffectStrength(numValue);
    Storage.setEffectStrength(numValue);
  };

  const handleInvertChange = (e) => {
    const inverted = e.target.checked;
    setInvertEffect(inverted);
    Storage.setInvertEffect(inverted);
  };

  const resetStrength = () => {
    setEffectStrength(DEFAULT_STRENGTH);
    Storage.setEffectStrength(DEFAULT_STRENGTH);
  };

  const resetInvert = () => {
    setInvertEffect(DEFAULT_INVERT);
    Storage.setInvertEffect(DEFAULT_INVERT);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <div className="setting setting-slider">
          <h3>Tile Hover Effect Strength</h3>
          <div className="setting-widget">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={effectStrength}
              onChange={(e) => handleStrengthChange(e.target.value)}
              className="strength-slider"
            />
            <span className="strength-value">{effectStrength.toFixed(1)}°</span>
            <button className="btn-reset" onClick={resetStrength} title="Reset to default">↻</button>
          </div>
        </div>

        <div className="setting setting-checkbox">
          <h3>Invert Tile Hover Effect</h3>
          <div className="setting-controls">
            <input
              type="checkbox"
              checked={invertEffect}
              onChange={handleInvertChange}
              className="checkbox-input"
            />
            <button className="btn-reset" onClick={resetInvert} title="Reset to default">↻</button>
          </div>
        </div>

        <div className="setting setting-slider">
          <div className="setting-title-row">
            <h3>Bulk Delete Confirmation Phrase</h3>
            <button className="btn-reset" onClick={() => { setDeletePhrase(Storage.getDefaultDeletePhrase()); Storage.setDeletePhrase(Storage.getDefaultDeletePhrase()); }} title="Reset to default">↻</button>
          </div>
          <input
            type="text"
            value={deletePhrase}
            onChange={(e) => { setDeletePhrase(e.target.value); Storage.setDeletePhrase(e.target.value); }}
            style={{ width: '100%', marginTop: '8px' }}
          />
        </div>

      </div>
    </div>
  );
}

export default SettingsDialog;
