import { useState } from 'react';
import { LocalStorage } from '../utils/LocalStorage';
import './ConfirmDialog.css';
import './PhraseConfirmDialog.css';

interface Props {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function PhraseConfirmDialog({ count, onConfirm, onCancel }: Props) {
  const [input, setInput] = useState('');
  const phrase = LocalStorage.getDeletePhrase();
  const matches = input === phrase;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Delete {count} project{count !== 1 ? 's' : ''}?</h2>
        <p className="phrase-confirm-warning">This cannot be undone. Type the phrase below to confirm:</p>
        <p className="phrase-confirm-phrase">{phrase}</p>
        <input
          type="text"
          className="phrase-confirm-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type phrase here..."
          autoFocus
        />
        <div className="dialog-buttons">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={!matches}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default PhraseConfirmDialog;
