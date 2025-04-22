import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog.jsx";
import { Button } from "../ui/button.jsx";

const IssueSuggestionDialog = ({
  open,
  onOpenChange,
  meeting,
  suggestedIssues,
  onAddToJira,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Suggested JIRA Issues from "{meeting?.title}"
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {suggestedIssues?.map((issue) => (
            <div key={issue.key} className="border rounded-md p-4 bg-muted">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{issue.summary}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    issue.status === 'proposed' ? 'bg-yellow-100 text-yellow-800' :
                    issue.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    issue.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.status}
                  </span>
                  {issue.status === 'proposed' && (
                    <Button 
                      onClick={() => onAddToJira(issue)}
                      size="sm"
                      variant="outline"
                    >
                      Add to JIRA
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueSuggestionDialog;
