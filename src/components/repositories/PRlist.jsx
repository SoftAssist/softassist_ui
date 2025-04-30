import React from "react";
import { Card, CardContent } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { softAssistAPI } from "../../api/softAssistAPI.js";
import { Button } from "../ui/button.jsx";

const PRlist = () => {
  const [pullRequests, setPullRequests] = React.useState([]);

  React.useEffect(() => {
    fetchPullRequests();
  }, []);

  const fetchPullRequests = async () => {
    try {
      const response = await softAssistAPI.github.getPulls("SoftAssist");
      console.log(response);
      if (response) {
        let pulls = [];
        response.repositories.forEach((repo) => {
          pulls = [...pulls, ...repo.pullRequests];
        });
        setPullRequests(pulls || []);
      }
    } catch (error) {
      console.error("Error fetching pull requests:", error);
    }
  };

  const mergePullRequest = async (pr) => {
    try {
      const repoName = pr.base.repo.name;
      const prNumber = pr.number;
      const response = await softAssistAPI.github.mergerPR({ orgName: "SoftAssist", repoName, prNumber });
      console.log(response);
      if (response) {
        alert("Pull request merged successfully");
        fetchPullRequests();
      }
    } catch (error) {
      console.error("Error merging pull request:", error);
    }
  };

  const getPRState = (pr) => {
    if (pr.state === "closed" && pr.merged_at) return "merged";
    return pr.state;
  };

  const stateColor = {
    open: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    merged: "bg-purple-100 text-purple-800",
  };

  return (
    <>
      <div className="flex items-center gap-6 border-b pb-2">
        <Input placeholder="Filter pull requests" className="w-1/3" />
      </div>

      <div className="space-y-4 mt-4">
        {pullRequests.map((pr) => (
          <Card key={pr.id} className="hover:shadow-md transition">
            <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4">
              
              {/* Left Section */}
              <div className="flex flex-col gap-2 w-full">
                
                {/* Repo Info */}
                <div className="text-xs text-muted-foreground">
                  {pr.base.repo.owner.login} / {pr.base.repo.name}
                </div>

                {/* PR Title */}
                <div className="font-semibold text-blue-600 text-lg">
                  #{pr.number} — {pr.title}
                </div>

                {/* Branch Direction */}
                <div className="text-sm text-muted-foreground">
                  {pr.head.ref} → {pr.base.ref}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img src={pr.user.avatar_url} alt={pr.user.login} className="w-5 h-5 rounded-full" />
                  <a href={pr.user.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {pr.user.login}
                  </a>
                  <span>opened on {new Date(pr.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Right Section */}
              {/* Right Section */}
<div className="flex flex-col gap-3 md:items-end w-full md:w-auto">
  
  {/* Status Badge */}
  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${stateColor[getPRState(pr)]}`}>
    {getPRState(pr)}
  </div>

  {/* View and Merge Buttons */}
  <div className="flex flex-col gap-2 w-full md:w-auto">
    <Button asChild className="w-full">
      <a
        href={pr.html_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        View PR
      </a>
    </Button>

    {getPRState(pr) === "open" && (
      <Button
        onClick={() => mergePullRequest(pr)}
        className="w-full bg-green-600 text-white hover:bg-green-700 transition"
        variant="success" // Only if you created a custom success variant; otherwise remove
      >
        Merge PR
      </Button>
    )}
  </div>

</div>

            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default PRlist;
