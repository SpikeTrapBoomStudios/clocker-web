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

const ICON_MAP = {
  clock: clockSvg,
  code: codeSvg,
  wrench: wrenchSvg,
  folder: folderSvg,
  chart: chartSvg,
  game: gameSvg,
  bookmark: bookmarkSvg,
  terminal: terminalSvg,
  graduation: graduationCapSvg,
  pencil: pencilSvg,
};

function ProjectIcon({ iconId, className = '' }) {
  const svg = ICON_MAP[iconId] || ICON_MAP.clock;
  return <img src={svg} alt="icon" className={className} />;
}

export default ProjectIcon;
