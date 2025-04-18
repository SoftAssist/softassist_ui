import React, { useState } from "react";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";

const Jira = () => {
  const [issues, setIssues] = useState([
    {
      id: "10001",
      key: "SOFT-1",
      summary: "Fix login redirect bug",
      status: "In Progress",
      assignee: "Niwant Salunke",
      created: "2025-04-15T10:00:00.000Z",
    },
    {
      id: "10002",
      key: "SOFT-2",
      summary: "Implement user registration",
      status: "To Do",
      assignee: "Anjali Mehta",
      created: "2025-04-14T09:30:00.000Z",
    },
    {
      id: "10003",
      key: "SOFT-3",
      summary: "UI bug in analytics page",
      status: "Done",
      assignee: "Dev Patel",
      created: "2025-04-10T11:45:00.000Z",
    },
  ]);

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
              <h4 className="font-semibold text-lg">{issue.key} - {issue.summary}</h4>
              <p className="text-sm text-muted-foreground">
                Assigned to: {issue.assignee}
              </p>
              <p className="text-xs text-muted-foreground">
                Created on: {new Date(issue.created).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0 sm:ml-4 items-center">
              <Badge variant="outline">{issue.status}</Badge>
              <Button size="sm" variant="outline">
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
