export const formatDuration = (seconds) => {
  if (!seconds) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export const formatTime = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getDurationSeconds = (startTime, endTime) => {
  if (!startTime) return 0;
  const end = endTime || new Date();
  let diff = (end - startTime) / 1000;
  if (diff < 0) diff += 86400; // crosses midnight
  return Math.floor(diff);
};

export const isActive = (log) => {
  return log.startTime && !log.endTime;
};
