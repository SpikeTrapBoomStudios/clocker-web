import { useState, useEffect } from 'react';
import './App.css';
import GridView from './views/GridView';
import DetailView from './views/DetailView';
import { Storage } from './utils/Storage';

function App() {
  const [currentView, setCurrentView] = useState('grid');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loaded = Storage.loadProjects();
    setProjects(loaded);
  }, []);

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

    // Ensure unique id
    let baseId = project.id;
    let suffix = 1;
    while (projects.some(p => p.id === project.id)) {
      project.id = baseId + '_' + (++suffix);
    }

    const updated = [...projects, project];
    setProjects(updated);
    Storage.saveProjects(updated);
  };

  const handleEditProject = (updated) => {
    const index = projects.findIndex(p => p.id === updated.id);
    if (index >= 0) {
      const newProjects = [...projects];
      newProjects[index] = updated;
      setProjects(newProjects);
      setSelectedProject(updated);
      Storage.saveProjects(newProjects);
    }
  };

  const handleDeleteProject = (projectId) => {
    const newProjects = projects.filter(p => p.id !== projectId);
    setProjects(newProjects);
    Storage.saveProjects(newProjects);
    setCurrentView('grid');
    setSelectedProject(null);
  };

  const handleDeleteProjects = (projectIds) => {
    const idSet = new Set(projectIds);
    const newProjects = projects.filter(p => !idSet.has(p.id));
    setProjects(newProjects);
    Storage.saveProjects(newProjects);
  };

  const generateId = () => {
    return 'proj_' + Date.now();
  };

  return (
    <div className="app">
      {currentView === 'grid' ? (
        <GridView
          projects={projects}
          onProjectSelect={handleProjectSelect}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onDeleteProjects={handleDeleteProjects}
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
