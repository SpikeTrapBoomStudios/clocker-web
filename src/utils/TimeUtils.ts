import { TimeLog } from '../types';

export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0s';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${remainingSeconds}s`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
};

export const formatTime = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getDurationSeconds = (startTime: Date | null, endTime: Date | null): number => {
  if (!startTime) return 0;
  const end = endTime ?? new Date();
  let diff = (end.getTime() - startTime.getTime()) / 1000;
  if (diff < 0) diff += 86400; // crosses midnight
  return Math.floor(diff);
};

export const isActive = (log: TimeLog): boolean => {
  return !!log.startTime && !log.endTime;
};
