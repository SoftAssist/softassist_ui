import React from "react";
import { Card, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { BadgePlus, MessageCircle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group.jsx";

const pullRequests = [
  {
    title: "Correct spelling and formatting errors in error_log.txt",
    number: 39,
    time: "13 hours ago",
    author: "akash0-real",
    comments: 3,
  },
  {
    title: "Fix deployment issue and setup improvement",
    number: 32,
    time: "17 hours ago",
    author: "vishwamartur",
    comments: 4,
  },
  {
    title: "doc: configure environment variables for powershell",
    number: 31,
    time: "18 hours ago",
    author: "Nigh",
    comments: 2,
  },
  {
    title: "feat: Add a Dockerfile and update package versions in requirements.txt",
    number: 30,
    time: "19 hours ago",
    author: "leeyeel",
    comments: 1,
  },
];

export default function RepositoriesPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
      <ToggleGroup type="single">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        Pull Requests
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        Actions
      </ToggleGroupItem>
    </ToggleGroup>
      </div>

      <div className="flex items-center gap-6 border-b pb-2">
        <Input placeholder="Filter pull requests" className="w-1/3" />
        <div className="font-semibold border-b-2 border-white">4 Open</div>
        <div className="text-muted-foreground">4 Closed</div>
      </div>

      <div className="space-y-2">
        {pullRequests.map((pr) => (
          <Card key={pr.number} className="hover:shadow-md">
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <div className="font-medium text-base text-blue-500 cursor-pointer">
                  {pr.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  #{pr.number} opened {pr.time} by {pr.author}
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle size={16} />
                <span className="text-sm">{pr.comments}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
