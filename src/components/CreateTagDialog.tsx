import { useState } from 'react';
import { TAG_COLORS, TagColorId, Tag } from '../types';
import './CreateTagDialog.css';

const TAG_NAME_MAX = 25;

interface Props {
  existingTag?: { name: string; color: TagColorId };
  onClose: () => void;
  onSubmit: (tag: Omit<Tag, 'id'>) => void;
}

function CreateTagDialog({ existingTag, onClose, onSubmit }: Props) {
  const isEditMode = existingTag !== undefined;
  const [name, setName] = useState(existingTag?.name ?? '');
  const [color, setColor] = useState<TagColorId>(existingTag?.color ?? 'blue');

  const charsOver = name.length - TAG_NAME_MAX;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || charsOver > 0) return;
    onSubmit({ name: name.trim(), color });
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? 'Edit Tag' : 'Create Tag'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="field-label-row">
              <label>Name</label>
              <span className={`char-counter ${charsOver > 0 ? 'over' : charsOver > -5 ? 'near' : ''}`}>
                {charsOver > 0 ? `-${charsOver}` : TAG_NAME_MAX - name.length}
              </span>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tag name"
              autoFocus
              className={charsOver > 0 ? 'input-over' : ''}
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-selector">
              {TAG_COLORS.map(tagColor => (
                <button
                  key={tagColor.id}
                  type="button"
                  className={`color-option ${color === tagColor.id ? 'active' : ''}`}
                  style={{ backgroundColor: tagColor.value }}
                  onClick={() => setColor(tagColor.id)}
                  title={tagColor.label}
                />
              ))}
            </div>
          </div>

          <div className="dialog-buttons">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!name.trim() || charsOver > 0}
            >
              {isEditMode ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTagDialog;
