import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/UserContext.js';
import { softAssistAPI } from '../../api/softAssistAPI.js';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog.jsx';
import { Input } from '../ui/input.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Button } from '../ui/button.jsx';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      const response = await softAssistAPI.projects.getAll();
      console.log('Raw API Response:', response);
      
      // Parse the responseData if it's a string
      let projectsData;
      try {
        projectsData = typeof response.responseData === 'string' 
          ? JSON.parse(response) 
          : response;
      } catch (parseError) {
        console.error('Error parsing projects data:', parseError);
        projectsData = [];
      }
      
      console.log('Parsed projects data:', projectsData);
      
      if (Array.isArray(projectsData)) {
        setAllProjects(projectsData);
        setProjects(projectsData);
      } else {
        console.error('Projects data is not an array:', projectsData);
        setAllProjects([]);
        setProjects([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    if (currentUser?._id) {
      console.log('Initial project fetch');
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch projects when join dialog opens
  useEffect(() => {
    if (showJoinDialog) {
      console.log('Join dialog opened, fetching projects');
      fetchProjects();
    }
  }, [showJoinDialog]);

  const handleJoinDialogOpen = () => {
    console.log('Opening join dialog');
    setShowJoinDialog(true);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = async () => {
    try {
      await softAssistAPI.projects.create({
        name: projectName,
        description: projectDescription,
      });

      // After successful creation, fetch the updated project list
      const response = await softAssistAPI.projects.getAll();
      const projectsData = typeof response.responseData === 'string' 
        ? JSON.parse(response.responseData) 
        : response.responseData;
      
      setAllProjects(projectsData);
      setProjects(projectsData);

      // Close the dialog and reset form
      setOpen(false);
      setProjectName('');
      setProjectDescription('');
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project');
    }
  };

  const handleJoinProject = async (projectId) => {
    try {
      await softAssistAPI.projects.update(projectId, {
        users: [currentUser._id]
      });

      // Refresh projects list
      const response = await softAssistAPI.projects.getAll();
      const projectsData = typeof response.responseData === 'string' 
        ? JSON.parse(response.responseData) 
        : response.responseData;
      setProjects(projectsData);
      setShowJoinDialog(false);
    } catch (err) {
      setError('Failed to join project');
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="new-project-btn">
                <span>+</span> New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Create a new project by entering a name and description.
                </DialogDescription>
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

          <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleJoinDialogOpen}>
                Join Existing Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Project</DialogTitle>
                <DialogDescription>
                  Select a project from the list below to join.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {loading ? (
                  <div>Loading projects...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : allProjects.length === 0 ? (
                  <div>No projects available to join</div>
                ) : (
                  allProjects.map(project => (
                    <div key={project._id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <h3 className="font-medium">{project.projectName}</h3>
                        <p className="text-sm text-gray-500">Created: {new Date(project.createdDate).toLocaleDateString()}</p>
                      </div>
                      <Button
                        onClick={() => handleJoinProject(project._id)}
                        size="sm"
                      >
                        Join
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project._id}
            className="project-card"
            onClick={() => handleProjectClick(project._id)}
          >
            <div className="project-card-header">
              <h3>{project.projectName}</h3>
            </div>
            <div className="project-footer">
              <span>Created: {new Date(project.createdDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
