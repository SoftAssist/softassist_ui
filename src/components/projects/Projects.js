import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      name: 'Project Alpha',
      description: 'AI-powered code assistant integration',
      status: 'active',
      lastUpdated: '2024-03-20'
    },
    // Add more sample projects as needed
  ];

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button className="button new-project-btn" onClick={handleNewProject}>
          <span>+</span> New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="project-card"
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="project-card-header">
              <h3>{project.name}</h3>
              <span className={`status-badge ${project.status}`}>
                {project.status}
              </span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-footer">
              <span>Last updated: {project.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects; 