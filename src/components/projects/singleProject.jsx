import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs.jsx";
import Meetings from "../meetings/Meetings.jsx";
import JiraIssues from "../jira/Jira.jsx";
import TeamMembers from "../team/team.jsx";
import { softAssistAPI } from "../../api/softAssistAPI.js";
import { useParams } from "react-router-dom";

const SingleProject = () => {
  const [projectName, setProjectName] = useState("");
  const { id: projectId } = useParams();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        console.log('Fetching project details for ID:', projectId);
        const project = await softAssistAPI.projects.getById(projectId);
        setProjectName(project.projectName || project.name || 'Untitled Project');
      } catch (error) {
        console.error("Error fetching project details:", error);
        setProjectName('Error Loading Project');
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Project Details: {projectName}
      </h2>
      <Tabs defaultValue="meetings" className="w-full">
  <TabsList className="bg-muted p-2 gap-2 rounded-lg mb-6">
    <TabsTrigger
      value="meetings"
      className="text-base px-6 py-3 rounded-md"
    >
      Meetings
    </TabsTrigger>
    <TabsTrigger
      value="jira"
      className="text-base px-6 py-3 rounded-md "
    >
      Jira Issues
    </TabsTrigger>
    <TabsTrigger
      value="team"
      className="text-base px-6 py-3 rounded-md"
    >
      Team Members
    </TabsTrigger>
  </TabsList>

  <TabsContent value="meetings">
    <Meetings />
  </TabsContent>

  <TabsContent value="jira">
    <JiraIssues />
  </TabsContent>

  <TabsContent value="team">
    <TeamMembers />
  </TabsContent>
</Tabs>
    </div>
  );
};

export default SingleProject;
