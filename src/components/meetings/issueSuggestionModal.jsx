import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
          {suggestedIssues?.map((issue, index) => (
            <div key={index} className="border rounded-md p-3 bg-muted text-sm">
              <strong>{issue.key}:</strong> {issue.summary}
            </div>
          ))}
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onAddToJira}>Add to JIRA Issues</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IssueSuggestionDialog;
