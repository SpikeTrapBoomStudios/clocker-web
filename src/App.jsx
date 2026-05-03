import { useState, useEffect } from 'react';
import './App.css';
import GridView from './views/GridView';
import DetailView from './views/DetailView';
import { LocalStorage } from './utils/LocalStorage.js';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [projects, setProjects] = useState(() => LocalStorage.loadProjects());
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentView, setCurrentView] = useState('grid');

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setCurrentView('detail');
  };

  const handleBack = () => {
    setCurrentView('grid');
    setSelectedProject(null);
  };

  const handleAddProject = (newProject) => {
    let project = { ...newProject, id: newProject.id || generateId() };

    let baseId = project.id;
    let suffix = 1;
    while (projects.some(existingProject => existingProject.id === project.id)) {
      project.id = baseId + '_' + (++suffix);
    }

    const updated = [...projects, project];
    setProjects(updated);
    LocalStorage.saveProjects(updated);
  };

  const handleEditProject = (updated) => {
    const index = projects.findIndex(existingProject => existingProject.id === updated.id);
    if (index >= 0) {
      const newProjects = [...projects];
      newProjects[index] = updated;
      setProjects(newProjects);
      setSelectedProject(updated);
      LocalStorage.saveProjects(newProjects);
    }
  };

  const handleDeleteProject = (projectId) => {
    const newProjects = projects.filter(project => project.id !== projectId);
    setProjects(newProjects);
    LocalStorage.saveProjects(newProjects);
    setSelectedProject(null);
    setCurrentView('grid');
  };

  const handleDeleteProjects = (projectIds) => {
    const idSet = new Set(projectIds);
    const newProjects = projects.filter(project => !idSet.has(project.id));
    setProjects(newProjects);
    LocalStorage.saveProjects(newProjects);
  };

  const generateId = () => 'proj_' + Date.now();

  const handleGoogleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
  };

  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        console.log(firebaseUser.displayName.split(' ')[0]);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="app">
      {currentView === 'grid' ? (
        <GridView
          projects={projects}
          onProjectSelect={handleProjectSelect}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onDeleteProjects={handleDeleteProjects}
          user={user}
          onSignIn={handleGoogleSignIn}
          onSignOut={() => signOut(auth)}
        />
      ) : (
        <DetailView
          project={selectedProject}
          projects={projects}
          onBack={handleBack}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}
    </div>
  );
}

export default App;
