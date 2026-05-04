import { Project } from '../types';
import { LocalStorage } from './LocalStorage';
import { getDurationSeconds, isActive } from './TimeUtils';

export interface DailyActivity {
  date: string;    // 'YYYY-MM-DD'
  label: string;   // e.g. 'May 4'
  seconds: number;
  hours: number;
}

function toDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyActivity(projects: Project[], days = 84): DailyActivity[] {
  const totals = new Map<string, number>();

  for (const project of projects) {
    const logs = LocalStorage.loadLogs(project.id);
    for (const log of logs) {
      const key = toDateKey(log.startTime);
      const secs = isActive(log)
        ? getDurationSeconds(log.startTime, new Date())
        : getDurationSeconds(log.startTime, log.endTime);
      totals.set(key, (totals.get(key) ?? 0) + secs);
    }
  }

  const result: DailyActivity[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = toDateKey(d);
    const seconds = totals.get(key) ?? 0;
    result.push({
      date: key,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      seconds,
      hours: Math.round((seconds / 3600) * 100) / 100,
    });
  }

  return result;
}
