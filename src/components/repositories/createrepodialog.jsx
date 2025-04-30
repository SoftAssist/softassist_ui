"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog.jsx";
import { Input } from "../ui/input.jsx";        // 👈 Import Input
import { Textarea } from "../ui/textarea.jsx";
import { Button } from "../ui/button.jsx";
// import { ScrollArea } from "../ui/scroll-area"; // Optional for clean scrolling
import { softAssistAPI } from "../../api/softAssistAPI.js";

export default function CreateRepoDialog() {
  const [repoName, setRepoName] = useState("");      // 👈 NEW state
  const [context, setContext] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState("");

  const handleGenerate = async () => {
    const response = await softAssistAPI.github.getTemplates({context , repoName});
    console.log(response);

    if (response?.data) {
      setMarkdownOutput(response.data); 
    }
  };

  const createGithubRepo = async () => {
    try {
      alert("Creating repository...");
      const response = await softAssistAPI.github.createRepo(repoName, context);
      console.log(response);

      if (response?.data) {
        // Handle success (e.g., show a success message)
        console.log("Repository created successfully:", response.data);
      }
    } catch (error) {
      console.error("Error creating repository:", error);
      // Handle error (e.g., show an error message)
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">+ Create Repository</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle>Provide Project Details</DialogTitle>
        </DialogHeader>

        {/* NEW Repo Name input */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-sm font-medium">Repository Name</label>
          <Input
            placeholder="Enter repository name..."
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {/* Left side - Context textarea */}
          <div className="flex-1">
            <Textarea
              placeholder="Describe your project context here..."
              className="min-h-[300px] w-full"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <DialogFooter className="mt-4">
              <Button onClick={handleGenerate}>Generate Template</Button>
              {markdownOutput && (
                <Button
                  variant="secondary"
                  onClick={createGithubRepo}
                >
                  Create Repository
                </Button>
              )}
            </DialogFooter>
          </div>

          {/* Right side - Markdown preview */}
          <div className="flex-1 border rounded-lg p-4 bg-muted overflow-auto min-h-[300px]">
            <h3 className="text-lg font-semibold mb-2">Generated Template</h3>
            {/* <ScrollArea className="h-[260px] pr-2"> */}
              <pre className="text-sm whitespace-pre-wrap">{markdownOutput}</pre>
            {/* </ScrollArea> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
