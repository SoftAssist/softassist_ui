import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchProjects = useCallback(async () => {
    try {
      console.log('Fetching projects...');
      const response = await softAssistAPI.projects.getAll();
      
      let projectsData;
      try {
        projectsData = typeof response.responseData === 'string' 
          ? JSON.parse(response) 
          : response;
      } catch (parseError) {
        console.error('Error parsing projects data:', parseError);
        projectsData = [];
      }
      
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
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    if (currentUser?._id && loading) {
      fetchProjects();
    }
  }, [currentUser, loading, fetchProjects]); // Only run when currentUser changes or on initial load

  // Fetch projects when join dialog opens
  useEffect(() => {
    if (showJoinDialog && currentUser?._id) {
      fetchProjects();
    }
  }, [showJoinDialog, currentUser?._id, fetchProjects]); // Only run when dialog opens

  const handleJoinProject = async (projectId) => {
    try {
      if (!currentUser?._id) {
        throw new Error('User ID not available');
      }

      await softAssistAPI.user.associateWithProject(projectId, 
        currentUser._id.replace('user_', '')
      );

      await fetchProjects(); // Refresh the projects list
      setShowJoinDialog(false);
    } catch (err) {
      console.error('Join project error:', err);
      setError(err.message || 'Failed to join project');
    }
  };

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
      await fetchProjects();

      // Close the dialog and reset form
      setOpen(false);
      setProjectName('');
      setProjectDescription('');
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project');
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
              <Button 
                variant="outline" 
                onClick={handleJoinDialogOpen}
                disabled={!currentUser?._id} // Disable if no user
              >
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
                {!currentUser?._id ? (
                  <div className="text-red-500">Please log in to join projects</div>
                ) : loading ? (
                  <div>Loading projects...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (allProjects || []).length === 0 ? (
                  <div>No projects available to join</div>
                ) : (
                  (allProjects || []).map(project => (
                    <div key={project._id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <h3 className="font-medium">{project.projectName}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(project.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleJoinProject(project._id)}
                        size="sm"
                        disabled={!currentUser?._id}
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
        {(projects || []).map((project) => (
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
