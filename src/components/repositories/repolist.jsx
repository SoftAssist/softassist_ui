import React, { useEffect , useState } from 'react'
import { Card, CardContent } from "../ui/card.jsx";
import { Input } from "../ui/input.jsx";
import { Star } from "lucide-react";
import CreateRepoDialog from "./createrepodialog.jsx";
import { softAssistAPI } from "../../api/softAssistAPI.js";


const Repolist = () => {
    const [repositories, setRepositories] = React.useState([]);

    useEffect(() => {
        fetchRepositories();
    }, []);

    const fetchRepositories = async () => {
        try {
            const response = await softAssistAPI.github.getRepos("SoftAssist");
            console.log(response);
            if (response) {
                setRepositories(response.repositories || []);
            }
        } catch (error) {
            console.error("Error fetching repositories:", error);
        }
    }

  return (
    <>
        <div className="flex items-center gap-6 border-b pb-2">
                <Input placeholder="Filter repositories" className="w-1/3" />
                <CreateRepoDialog />
              </div>
              <div className="space-y-2 mt-2">
                {repositories.map((repo) => (
                  <Card key={repo.repoName} className="hover:shadow-md">
                  <CardContent className="p-4 flex justify-between items-start">
                    <div>
                      <div className="font-medium text-base text-blue-500">
                        {repo.repoName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created At: {new Date(repo.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Project ID: {repo.projectId}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Star size={16} />
                        <span>0</span>
                      </div>
                      <a
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        View Repo
                      </a>
                    </div>
                  </CardContent>
                </Card>
                ))}
        </div>
        </>
  )
}

export default Repolist