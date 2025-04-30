"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card.jsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "../components/ui/button.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const dummyTotals = {
  projects: 15,
  activeProjects: 10,
  inactiveProjects: 5,
  meetings: 28,
};

const dummyWorkflows = [
  { title: "Build & Test", status: "success", triggeredBy: "Niwant" },
  { title: "Deploy", status: "failure", triggeredBy: "Aditya" },
  { title: "Lint & Check", status: "success", triggeredBy: "Sneha" },
];

const dummyIssues = [
  { status: "To Do", count: 8 },
  { status: "In Progress", count: 5 },
  { status: "Review", count: 3 },
  { status: "Blocked", count: 1 },
  { status: "Done", count: 12 },
];

const contributors = [
  { name: "Niwant", commits: 34 },
  { name: "Aditya", commits: 27 },
  { name: "Sneha", commits: 18 },
];

export default function Dashboard() {
  const statCards = useMemo(() => [
    { title: "Total Projects", value: dummyTotals.projects },
    { title: "Active Projects", value: dummyTotals.activeProjects },
    { title: "Inactive Projects", value: dummyTotals.inactiveProjects },
    { title: "Meetings Held", value: dummyTotals.meetings },
  ], []);

  const workflowSummary = useMemo(() => ({
    labels: ["Success", "Failure"],
    datasets: [
      {
        label: "Workflow Runs",
        data: [
          dummyWorkflows.filter((w) => w.status === "success").length,
          dummyWorkflows.filter((w) => w.status === "failure").length,
        ],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)", // green
          "rgba(239, 68, 68, 0.7)", // red
        ],
        borderRadius: 8,
      },
    ],
  }), []);

  const sprintIssueData = useMemo(() => ({
    labels: dummyIssues.map((i) => i.status),
    datasets: [
      {
        label: "Issues",
        data: dummyIssues.map((i) => i.count),
        backgroundColor: [
          "rgba(96, 165, 250, 0.7)",   // blue - To Do
          "rgba(251, 191, 36, 0.7)",    // yellow - In Progress
          "rgba(139, 92, 246, 0.7)",    // purple - Review
          "rgba(239, 68, 68, 0.7)",     // red - Blocked
          "rgba(16, 185, 129, 0.7)",    // green - Done
        ],
        borderRadius: 8,
      },
    ],
  }), []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <Button variant="outline" size="sm">Refresh</Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="rounded-2xl hover:shadow-md transition">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{card.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Summary */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Workflow Run Summary</CardTitle>
            <CardDescription>Success vs Failure</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <Bar data={workflowSummary} options={{ maintainAspectRatio: false }} />
          </CardContent>
        </Card>

        {/* Sprint Issue Status */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Sprint Issue Status</CardTitle>
            <CardDescription>Jira issues across different states</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <Bar data={sprintIssueData} options={{ maintainAspectRatio: false }} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Workflow Runs</CardTitle>
            <CardDescription>Latest CI/CD pipeline activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dummyWorkflows.map((run, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium">{run.title}</div>
                  <div className="text-muted-foreground text-xs">
                    Triggered by: {run.triggeredBy}
                  </div>
                </div>
                <div
                  className={`text-xs font-semibold ${
                    run.status === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {run.status.toUpperCase()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Contributors */}
      <div className="grid grid-cols-1">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
            <CardDescription>Most active developers in recent weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {contributors.map((c, idx) => (
                <li key={idx} className="flex justify-between text-sm font-medium">
                  <span>{c.name}</span>
                  <span className="text-muted-foreground">{c.commits} commits</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
