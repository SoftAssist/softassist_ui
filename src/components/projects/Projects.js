import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Button } from '../ui/button.jsx';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Project Alpha',
      description: 'AI-powered code assistant integration',
      status: 'active',
      lastUpdated: '2024-03-20',
    },
    // You can start with more projects if needed
  ]);

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: projectName,
      description: projectDescription,
      status: 'active',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setProjects([...projects, newProject]);
    setOpen(false);
    setProjectName('');
    setProjectDescription('');
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="new-project-btn">
              <span>+</span> New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <Textarea
                placeholder="Project Description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
