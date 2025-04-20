import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs.jsx";
import Meetings from "../meetings/Meetings.jsx";
import JiraIssues from "../jira/Jira.jsx";
import TeamMembers from "../team/team.jsx";

const SingleProject = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
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
