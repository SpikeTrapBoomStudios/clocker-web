import clockSvg from '../assets/clock.svg';
import codeSvg from '../assets/code.svg';
import wrenchSvg from '../assets/wrench.svg';
import folderSvg from '../assets/folder.svg';
import chartSvg from '../assets/chart.svg';
import gameSvg from '../assets/game.svg';
import bookmarkSvg from '../assets/bookmark.svg';
import terminalSvg from '../assets/terminal.svg';
import graduationCapSvg from '../assets/graduation_cap.svg';
import pencilSvg from '../assets/pencil.svg';
import backpackSvg from '../assets/backpack.svg';
import bookSvg from '../assets/book.svg';
import exerciseSvg from '../assets/exercise.svg';
import moneySvg from '../assets/money.svg';
import swimmingSvg from '../assets/swimming.svg';
import { IconId } from '../types';
import './IconSelector.css';

const ICONS: { id: IconId; label: string; svg: string }[] = [
  { id: 'clock',      label: 'Clock',     svg: clockSvg },
  { id: 'code',       label: 'Code',      svg: codeSvg },
  { id: 'wrench',     label: 'Wrench',    svg: wrenchSvg },
  { id: 'folder',     label: 'Folder',    svg: folderSvg },
  { id: 'chart',      label: 'Chart',     svg: chartSvg },
  { id: 'game',       label: 'Game',      svg: gameSvg },
  { id: 'bookmark',   label: 'Bookmark',  svg: bookmarkSvg },
  { id: 'terminal',   label: 'Terminal',  svg: terminalSvg },
  { id: 'graduation', label: 'Learning',  svg: graduationCapSvg },
  { id: 'pencil',     label: 'Pencil',    svg: pencilSvg },
  { id: 'swimming',   label: 'Swimming',  svg: swimmingSvg },
  { id: 'backpack',   label: 'Backpack',  svg: backpackSvg },
  { id: 'book',       label: 'Book',      svg: bookSvg },
  { id: 'exercise',   label: 'Exercise',  svg: exerciseSvg },
  { id: 'money',      label: 'Money',     svg: moneySvg },
];

interface Props {
  selectedIcon: IconId;
  onSelect: (icon: IconId) => void;
}

function IconSelector({ selectedIcon, onSelect }: Props) {
  return (
    <div className="icon-selector">
      {ICONS.map(icon => (
        <button
          key={icon.id}
          type="button"
          className={`icon-option ${selectedIcon === icon.id ? 'active' : ''}`}
          onClick={() => onSelect(icon.id)}
          title={icon.label}
        >
          <img src={icon.svg} alt={icon.label} />
        </button>
      ))}
    </div>
  );
}

export default IconSelector;
