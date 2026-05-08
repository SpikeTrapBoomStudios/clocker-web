import { useState, useRef, useEffect } from 'react';
import { Tag, TAG_COLORS, TagColorId } from '../types';
import ConfirmDialog from './ConfirmDialog';
import CreateTagDialog from './CreateTagDialog';
import './TagDropdown.css';

interface Props {
  tags: Tag[];
  currentTagId: string | undefined;
  onTagChange: (tagId: string | null) => void;
  onCreateNew: () => void;
  onDeleteTag: (tagId: string) => void;
  onEditTag: (tagId: string, tagData: Omit<Tag, 'id'>) => void;
}

function TagDropdown({ tags, currentTagId, onTagChange, onCreateNew, onDeleteTag, onEditTag }: Props) {
  const [open, setOpen] = useState(false);
  const [deleteConfirmTagId, setDeleteConfirmTagId] = useState<string | null>(null);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const currentTag = tags.find(tag => tag.id === currentTagId);
  const currentColor = currentTag ? TAG_COLORS.find(colorEntry => colorEntry.id === currentTag.color)?.value : undefined;

  const maxTagLength = tags.length > 0 ? Math.max(...tags.map(tag => tag.name.length)) : 0;
  const labelWidth = `${Math.max(maxTagLength, 3) + 3}ch`;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (tagId: string) => {
    onTagChange(tagId === currentTagId ? null : tagId);
    setOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    setOpen(false);
    setDeleteConfirmTagId(tagId);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmTagId) onDeleteTag(deleteConfirmTagId);
    setDeleteConfirmTagId(null);
  };

  const handleEditClick = (e: React.MouseEvent, tagId: string) => {
    e.stopPropagation();
    setOpen(false);
    setEditingTagId(tagId);
  };

  const handleEditSubmit = (tagData: { name: string; color: TagColorId }) => {
    if (editingTagId) onEditTag(editingTagId, tagData);
    setEditingTagId(null);
  };

  const handleCreateNew = () => {
    setOpen(false);
    onCreateNew();
  };

  const deleteConfirmTag = tags.find(tag => tag.id === deleteConfirmTagId);

  return (
    <div className="tag-dropdown" ref={ref}>
      <button
        type="button"
        className={`btn-tag ${currentTag ? 'has-tag' : ''}`}
        style={currentColor ? { borderColor: currentColor } : undefined}
        onClick={() => setOpen(prev => !prev)}
        title={currentTag ? currentTag.name : 'Assign tag'}
      >
        <span
          className="tag-dot"
          style={currentColor
            ? { backgroundColor: currentColor, borderColor: 'transparent' }
            : { backgroundColor: 'transparent', borderColor: 'currentColor' }
          }
        />
        <span className="tag-btn-label" style={{ width: labelWidth }}>{currentTag ? currentTag.name : 'Tag'}</span>
        <span className="tag-caret">▾</span>
      </button>

      {open && (
        <div className="tag-menu">
          <div className={`tag-menu-row${!currentTagId ? ' is-selected' : ''}`}>
            <button
              type="button"
              className="tag-menu-item"
              onClick={() => { onTagChange(null); setOpen(false); }}
            >
              <span className="tag-dot" style={{ backgroundColor: 'transparent', borderColor: 'var(--text-light)' }} />
              <span className="tag-empty-label">Empty</span>
            </button>
          </div>
          {tags.length === 0 && (
            <div className="tag-menu-empty">No tags yet</div>
          )}
          {tags.map(tag => {
            const tagColor = TAG_COLORS.find(colorEntry => colorEntry.id === tag.color)?.value;
            const isSelected = tag.id === currentTagId;
            return (
              <div key={tag.id} className={`tag-menu-row${isSelected ? ' is-selected' : ''}`}>
                <button
                  type="button"
                  className="tag-menu-item"
                  onClick={() => handleSelect(tag.id)}
                >
                  <span className="tag-dot" style={{ backgroundColor: tagColor, borderColor: 'transparent' }} />
                  <span>{tag.name}</span>
                </button>
                <button
                  type="button"
                  className="tag-edit-btn"
                  onClick={(e) => handleEditClick(e, tag.id)}
                  title="Edit tag"
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="tag-delete-btn"
                  onClick={(e) => handleDeleteClick(e, tag.id)}
                  title="Delete tag"
                >
                  ✕
                </button>
              </div>
            );
          })}
          <div className="tag-menu-divider" />
          <button type="button" className="tag-menu-item tag-create-new" onClick={handleCreateNew}>
            <span className="tag-plus">+</span>
            <span>Create New</span>
          </button>
        </div>
      )}

      {deleteConfirmTagId !== null && (
        <ConfirmDialog
          message={`Delete tag "${deleteConfirmTag?.name ?? ''}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmTagId(null)}
        />
      )}

      {editingTagId !== null && (() => {
        const tagBeingEdited = tags.find(tag => tag.id === editingTagId);
        return tagBeingEdited ? (
          <CreateTagDialog
            existingTag={{ name: tagBeingEdited.name, color: tagBeingEdited.color }}
            onClose={() => setEditingTagId(null)}
            onSubmit={handleEditSubmit}
          />
        ) : null;
      })()}
    </div>
  );
}

export default TagDropdown;
