import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ICON_IDS, IconId, Project, TimeLog } from '../types';

interface FirestoreProject {
  id: string;
  title: string;
  description: string;
  icon: number;
  active: boolean;
  starred: boolean;
}

interface FirestoreTimeLog {
  date: string;
  startTime: string;
  endTime: string | null;
}

function toFirestoreProject(localProject: Project): FirestoreProject {
  return {
    id: localProject.id,
    title: localProject.name,
    description: localProject.description,
    icon: Math.max(0, ICON_IDS.indexOf(localProject.icon as IconId)),
    active: localProject.active,
    starred: localProject.starred,
  };
}

function fromFirestoreProject(firestoreProject: FirestoreProject): Project {
  return {
    id: firestoreProject.id,
    name: firestoreProject.title,
    description: firestoreProject.description,
    icon: ICON_IDS[firestoreProject.icon] ?? 'clock',
    active: firestoreProject.active ?? false,
    starred: firestoreProject.starred ?? false,
  };
}

function toFirestoreLog(log: TimeLog): FirestoreTimeLog {
  return {
    date: log.date.toISOString(),
    startTime: log.startTime.toISOString(),
    endTime: log.endTime?.toISOString() ?? null,
  };
}

function fromFirestoreLog(firestoreLog: FirestoreTimeLog): TimeLog {
  return {
    date: new Date(firestoreLog.date),
    startTime: new Date(firestoreLog.startTime),
    endTime: firestoreLog.endTime ? new Date(firestoreLog.endTime) : null,
  };
}

export const CloudStorage = {
  async loadProjects(userId: string): Promise<Project[] | null> {
    const snapshot = await getDoc(doc(db, 'users', userId));
    const userData = snapshot.exists() ? snapshot.data() : null;
    if (!userData?.projects) return null;
    return (userData.projects as FirestoreProject[]).map(fromFirestoreProject);
  },

  async saveProjects(userId: string, projects: Project[]): Promise<void> {
    await setDoc(doc(db, 'users', userId), { projects: projects.map(toFirestoreProject) }, { merge: true });
  },

  async loadLogs(userId: string, projectId: string): Promise<TimeLog[] | null> {
    const snapshot = await getDoc(doc(db, 'users', userId, 'logs', projectId));
    if (!snapshot.exists()) return null;
    return (snapshot.data().entries as FirestoreTimeLog[]).map(fromFirestoreLog);
  },

  async saveLogs(userId: string, projectId: string, logs: TimeLog[]): Promise<void> {
    await setDoc(doc(db, 'users', userId, 'logs', projectId), { entries: logs.map(toFirestoreLog) });
  },
};
