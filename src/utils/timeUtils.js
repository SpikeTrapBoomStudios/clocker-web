export const formatDuration = (seconds) => {
  if (!seconds) return '0s';
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const rounded = Math.round(seconds / 60) * 60;
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
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
  if (!startTime || !endTime) return 0;
  let diff = (endTime - startTime) / 1000;
  if (diff < 0) diff += 86400; // crosses midnight
  return Math.floor(diff);
};

export const isActive = (log) => {
  return log.startTime && !log.endTime;
};
