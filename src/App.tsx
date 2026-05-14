import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import './App.css';
import GridView from './views/GridView';
import DetailView from './views/DetailView';
import { LocalStorage } from './utils/LocalStorage';
import { Storage } from './utils/Storage';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from './firebase';
import { Project, ProjectFormData, Tag } from './types';

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>(() => LocalStorage.loadProjects());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'detail'>('grid');
  const [logSyncVersion, setLogSyncVersion] = useState(0);

  const generateId = (name: string): string => {
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `${sanitizedName}_${Date.now()}_${random}`;
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('grid');
    setSelectedProject(null);
  };

  const handleAddProject = (formData: ProjectFormData) => {
    let newProject: Project = {
      ...formData,
      id: formData.id ?? generateId(formData.name),
      active: false,
      starred: false,
      tags: [],
    };

    const baseId = newProject.id;
    let suffix = 1;
    while (projects.some(existing => existing.id === newProject.id)) {
      newProject = { ...newProject, id: `${baseId}_${++suffix}` };
    }

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    Storage.saveProjects(updatedProjects);
  };

  const handleEditProject = (formData: ProjectFormData) => {
    const index = projects.findIndex(project => project.id === formData.id);
    if (index >= 0) {
      const updatedProject: Project = { ...projects[index], ...formData, id: projects[index].id };
      const updatedProjects = [...projects];
      updatedProjects[index] = updatedProject;
      setProjects(updatedProjects);
      setSelectedProject(updatedProject);
      Storage.saveProjects(updatedProjects);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    Storage.saveProjects(updatedProjects);
    LocalStorage.deleteProjectBackups(projectId);
    setSelectedProject(null);
    setCurrentView('grid');
  };

  const handleActiveChange = (projectId: string, active: boolean) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, active } : project
    );
    setProjects(updatedProjects);
    if (selectedProject?.id === projectId) setSelectedProject(prev => prev ? { ...prev, active } : prev);
    Storage.saveProjects(updatedProjects);
  };

  const handleStarProject = (projectId: string) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, starred: !project.starred } : project
    );
    setProjects(updatedProjects);
    Storage.saveProjects(updatedProjects);
  };

  const handleDeleteProjects = (projectIds: string[]) => {
    const idSet = new Set(projectIds);
    const updatedProjects = projects.filter(project => !idSet.has(project.id));
    setProjects(updatedProjects);
    Storage.saveProjects(updatedProjects);
  };

  const handleTagsChange = (projectId: string, tags: Tag[]) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, tags } : project
    );
    setProjects(updatedProjects);
    if (selectedProject?.id === projectId) setSelectedProject(prev => prev ? { ...prev, tags } : prev);
    Storage.saveProjects(updatedProjects);
  };

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const loadedProjects = await Storage.loadProjects();
        setProjects(loadedProjects);
        LocalStorage.saveProjects(loadedProjects);
        await Storage.syncAllLogs(loadedProjects.map(project => project.id));
        setLogSyncVersion(v => v + 1);
      }
    });
  }, []);

  return (
    <div className="app">
      {currentView === 'grid' ? (
        <GridView
          projects={projects}
          onProjectSelect={handleProjectSelect}
          onAddProject={handleAddProject}
          onDeleteProjects={handleDeleteProjects}
          onStarProject={handleStarProject}
          user={user}
          onGoogleSignIn={() => signInWithPopup(auth, googleProvider)}
          onGithubSignIn={() => signInWithPopup(auth, githubProvider)}
          onSignOut={() => signOut(auth)}
          logSyncVersion={logSyncVersion}
        />
      ) : selectedProject && (
        <DetailView
          project={selectedProject}
          projects={projects}
          onBack={handleBack}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onActiveChange={(active) => handleActiveChange(selectedProject.id, active)}
          onTagsChange={handleTagsChange}
        />
      )}
    </div>
  );
}

export default App;
