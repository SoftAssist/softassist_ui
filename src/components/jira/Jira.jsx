import React, { useState, useEffect } from "react";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { softAssistAPI } from "../../api/softAssistAPI.js";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Jira = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jiraProjectKey, setJiraProjectKey] = useState("");
  const [associating, setAssociating] = useState(false);
  const { id: projectId } = useParams();
  const [availableProjects, setAvailableProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    fetchProjectIssues();
  }, [projectId]);

  const fetchProjectIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First get the project details to get the jiraId
      const project = await softAssistAPI.projects.getById(projectId);
      console.log('Project details:', project); // Debug log
      
      if (!project.jiraId) {
        setLoading(false);
        setIssues([]); // Ensure issues is empty when no jiraId
        return;
      }

      const response = await softAssistAPI.jira.getIssues(project.jiraId);
      console.log('Jira issues response:', response); // Debug log
      
      // Ensure we're using the correct property from the response
      const jiraIssues = response.issues || response;
      console.log('Processed Jira issues:', jiraIssues); // Added this line to log the final issues array
      setIssues(jiraIssues);
    } catch (err) {
      console.error("Error fetching Jira issues:", err);
      setError("Failed to load Jira issues");
      setIssues([]); // Clear issues on error
    } finally {
      setLoading(false);
    }
  };

  const handleAssociateJira = async () => {
    try {
      setAssociating(true);
      await softAssistAPI.projects.associateProject(projectId, jiraProjectKey);
      setDialogOpen(false);
      // Refresh issues after association
      await fetchProjectIssues();
    } catch (err) {
      console.error("Error associating Jira project:", err);
      setError("Failed to associate Jira project");
    } finally {
      setAssociating(false);
    }
  };

  const fetchAvailableProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await softAssistAPI.jira.getAvailableProjects();
      console.log('Jira API response:', response); // Debug log
      
      // Extract projects from the nested structure
      const projects = response.projects?.values || [];
      console.log('Available Jira projects:', projects); // Debug log
      
      setAvailableProjects(projects);
    } catch (err) {
      console.error("Error fetching Jira projects:", err);
      setError("Failed to load available Jira projects");
      setAvailableProjects([]); // Reset to empty array on error
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      fetchAvailableProjects();
    }
  }, [dialogOpen]);

  const renderDialog = () => (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Associate Jira Project</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {loadingProjects ? (
            <div className="text-center py-2">Loading available projects...</div>
          ) : availableProjects.length > 0 ? (
            <Select
              value={jiraProjectKey}
              onValueChange={setJiraProjectKey}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Jira project" />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map((project) => (
                  <SelectItem 
                    key={project.id} 
                    value={project.key}
                  >
                    {project.key} - {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-center text-muted-foreground">No Jira projects available</p>
          )}
          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleAssociateJira}
            disabled={!jiraProjectKey || associating || loadingProjects || availableProjects.length === 0}
          >
            {associating ? "Associating..." : "Associate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return <div className="text-center py-8">Loading Jira issues...</div>;
  }

  if (issues.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Jira Issues</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No Jira project associated with this project
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            Associate Jira Project
          </Button>
        </div>
        {renderDialog()}
      </div>
    );
  }

  return (
    
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Jira Issues</h3>
      <ul className="space-y-3">
        {issues.map((issue) => (
          <li
            key={issue.id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-background"
          >
            <div className="space-y-1">
              <h4 className="font-semibold text-lg">
                {issue.key} - {issue.fields.summary}
              </h4>
              <p className="text-sm text-muted-foreground">
                Assigned to: {issue.fields.assignee?.displayName || 'Unassigned'}
              </p>
              <p className="text-xs text-muted-foreground">
                Created on: {new Date(issue.fields.created).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4 items-center">
              <Badge variant="outline">{issue.fields.status.name}</Badge>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open(`https://softassist.atlassian.net/browse/${issue.key}`, '_blank')}
              >
                View
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Jira;
