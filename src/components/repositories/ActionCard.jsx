import { Card, CardContent, CardHeader, CardTitle , CardDescription} from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import { Button } from "../../components/ui/button.jsx";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { softAssistAPI } from '../../api/softAssistAPI.js';
import { Play, Github } from "lucide-react";

const ActionCard = ({ workflow }) => {
    const recentRuns = workflow.recent_runs || [];
  const latestRun = recentRuns.length > 0 ? recentRuns[0] : null;

  // Get repository name from the latest run (if available)
  const repoName = latestRun?.repository?.name || "Unknown Repository";

    const runWorkflow = async () => {
        try {
            const repoName = workflow.recent_runs[0].repository.name;
            const workflowId = workflow.recent_runs[0].workflow_id;
            const response = await softAssistAPI.github.runWorkflow({orgName: "SoftAssist" ,repoName , workflowId});
            console.log(response);
            if (response) {
                // Handle success
            }
        } catch (error) {
            console.error("Error running workflow:", error);
        }
    }

    return (
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{workflow.workflow_name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  <span className="mr-2">
                    Repo: <span className="font-medium text-yellow">{repoName}</span>
                  </span>
                  {workflow.workflow_state === "active" ? (
                    <Badge variant="outline" className="text-green-600 border-green-400 ml-2">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-400 ml-2">Disabled</Badge>
                  )}
                  <span className="ml-2 text-xs text-gray-500">Total Runs: {recentRuns.length}</span>
                </CardDescription>
              </div>
    
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Github size={16} className="mr-1" />
                  <a href={latestRun?.html_url}>View Repo</a>
                </Button>
                {workflow.workflow_state === "active" && (
                  <Button variant="default" size="sm" onClick={runWorkflow}>
                    <Play size={16} className="mr-1" />
                    Trigger
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
    
          <CardContent>
            {latestRun ? (
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  Last Run:{" "}
                  <a href={latestRun.html_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    {latestRun.display_title}
                  </a>
                </div>
                <div className="text-xs text-muted-foreground">
                  Event: {latestRun.event} | Status: {latestRun.status} {latestRun.conclusion === "success" ? "✅" : "❌"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Triggered by: @{latestRun.actor?.login}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 italic">No runs yet.</div>
            )}
          </CardContent>
        </Card>
      );
  };

export default ActionCard;